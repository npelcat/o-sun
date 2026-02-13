import * as NextAuthNS from "next-auth";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { admins } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "./password";

// Build providers conditionally to avoid throwing during build if envs are missing
const providers: Array<unknown> = [
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }
      try {
        const { default: db } = await import("@/src/db/index");
        const adminList = await db
          .select({
            id: admins.id,
            email: admins.email,
            username: admins.username,
            passwordHash: admins.passwordHash,
          })
          .from(admins)
          .where(eq(admins.email, credentials.email as string))
          .limit(1);

        if (adminList.length === 0) {
          return null;
        }

        const admin = adminList[0];
        const isPasswordValid = await verifyPassword(
          admin.passwordHash,
          credentials.password as string,
        );

        if (!isPasswordValid) {
          return null;
        }

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
            user.name = adminList[0].username;
            user.id = adminList[0].id;
            return true;
          }
          return false; // Google user not in admin table
        } catch (error) {
          console.error("Erreur signIn Google:", error);
          return false;
        }
      }
      return true;
    },
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
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.name = (token.username as string) ?? session.user.name;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  // Fallback secret to allow building without secret in CI/local
  secret: process.env.NEXTAUTH_SECRET || "dev-build-secret",
};

// Compatibilité ESM/CommonJS: utiliser default si présent, sinon la fonction du module
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

export const { handlers, signIn, signOut, auth } = nextAuthResult;
