import * as NextAuthNS from "next-auth";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { admins } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "./password";
import { loginRateLimiter } from "../security/rate-limit-simple";

// Liste des providers de façon conditionnelle,
// pour ne pas faire planter le build si une variable d'env
// (comme GOOGLE_CLIENT_ID) n'est pas encore définie au moment du build
const providers: Array<unknown> = [
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    // authorize() est appelée à chaque tentative de connexion par email/mdp.
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }
      try {
        const normalizedEmail = (credentials.email as string)
          .toLowerCase()
          .trim();

        // Anti brute-force : on vérifie qu'on n'a pas dépassé le nombre
        // de tentatives autorisées pour cet email.
        const isAllowed = loginRateLimiter.check(normalizedEmail);

        if (!isAllowed) {
          console.warn(`Rate limit dépassé pour email: ${normalizedEmail}`);
          // Important : on retourne null, exactement comme un login raté.
          return null;
        }

        // Import dynamique de la DB : évite de charger la connexion DB
        // inutilement si on sort avant (ex: rate limit atteint).
        const { default: db } = await import("@/src/db/index");
        const adminList = await db
          .select({
            id: admins.id,
            email: admins.email,
            username: admins.username,
            passwordHash: admins.passwordHash,
          })
          .from(admins)
          // Requête paramétrée via Drizzle (pas de concaténation SQL)
          .where(eq(admins.email, credentials.email as string))
          .limit(1);

        if (adminList.length === 0) {
          // Email inconnu : on retourne null sans préciser "email inconnu"
          return null;
        }

        const admin = adminList[0];

        // Comparaison du mot de passe fourni avec le hash Argon2id stocké.
        const isPasswordValid = await verifyPassword(
          admin.passwordHash,
          credentials.password as string,
        );

        if (!isPasswordValid) {
          return null;
        }

        // Ce qui est retourné ici devient disponible dans le callback jwt()
        // via le paramètre `user`. Pas de renvoi du hash du mot de passe.
        return {
          id: admin.id,
          email: admin.email,
          name: admin.username,
        };
      } catch (error) {
        console.error("Erreur auth:", error);
        return null;
      }
    },
  }),
];

// Le provider Google n'est ajouté que si les variables d'env sont présentes.
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.unshift(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

const config = {
  providers,
  callbacks: {
    // signIn() est appelée juste après une authentification réussie par un provider.
    // On l'utilise ici pour restreindre l'accès Google aux seules adresses
    // déjà présentes dans la table `admins` (whitelist).
    async signIn({
      user,
      account,
    }: {
      user: { id?: string; email?: string | null; name?: string | null };
      account?: { provider?: string | null } | null;
    }) {
      if (account?.provider === "google") {
        try {
          const { default: db } = await import("@/src/db/index");
          const adminList = await db
            .select({
              id: admins.id,
              email: admins.email,
              username: admins.username,
            })
            .from(admins)
            .where(eq(admins.email, user.email!))
            .limit(1);

          if (adminList.length > 0) {
            // On remplace les infos Google par celles de notre table admin
            // (id interne, username interne) pour rester cohérent avec le
            // login par credentials.
            user.name = adminList[0].username;
            user.id = adminList[0].id;
            return true; // connexion autorisée
          }
          // Email Google non présent dans la table admins → accès refusé
          return false;
        } catch (error) {
          console.error("Erreur signIn Google:", error);
          return false;
        }
      }
      // Pour le provider "credentials", authorize() a déjà fait le contrôle.
      return true;
    },

    // jwt() est appelée à chaque création/mise à jour du token.
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: { id: string; name?: string | null } | null;
    }) {
      if (user) {
        token.sub = user.id;
        token.username = user.name;
      }
      return token;
    },

    // session() transforme le contenu du JWT en objet `session` exploitable
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.name = (token.username as string) ?? session.user.name;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },

  // Stratégie "jwt" = session stateless, tout est encodé dans le cookie signé.
  // Pas de table "sessions" en DB
  session: {
    strategy: "jwt",
    // Durée de vie max du cookie de session : 8h (nexthauth 30 jours par défaut)
    maxAge: 60 * 60 * 8,
    // "Session glissante" : si l'admin est active, le cookie est renouvelé
    // silencieusement toutes les heures. Elle n'est déconnectée que si elle
    // reste inactive plus de 8h.
    updateAge: 60 * 60,
  },

  // On sépare la lecture de la variable pour pouvoir la contrôler avant usage.
  secret: (() => {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      if (process.env.NODE_ENV === "production") {
        // On préfère un crash explicite au déploiement plutôt qu'une prod
        // qui tourne silencieusement avec un secret visible dans le code.
        throw new Error("NEXTAUTH_SECRET missing: required in production.");
      }
      // Fallback autorisé uniquement en dev/CI locale, jamais en prod.
      return "dev-only-secret-do-not-use-in-prod";
    }
    return secret;
  })(),
};

// Compatibilité ESM/CommonJS : selon la version/le bundler, NextAuth peut
// être exporté en `default` ou directement comme fonction du module.
const nextAuth =
  (NextAuthNS as unknown as { default?: (cfg: unknown) => unknown }).default ??
  (NextAuthNS as unknown as (cfg: unknown) => unknown);

const nextAuthResult = nextAuth(config) as {
  handlers: {
    GET: (req: Request) => Promise<Response> | Response;
    POST: (req: Request) => Promise<Response> | Response;
  };
  signIn: (...args: unknown[]) => Promise<unknown>;
  signOut: (...args: unknown[]) => Promise<unknown>;
  auth: (() => Promise<Session | null>) & ((...args: unknown[]) => unknown);
};

// handlers → utilisés dans app/api/auth/[...nextauth]/route.ts
// signIn/signOut → utilisables côté serveur (Server Actions, etc.)
// auth() → récupère la session côté serveur (Server Components, middleware...)
export const { handlers, signIn, signOut, auth } = nextAuthResult;
