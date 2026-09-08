import * as NextAuthNS from "next-auth";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { admins } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "./password";
import { loginRateLimiter } from "../security/rate-limit-simple";

// Providers are listed conditionally so the build doesn't fail if an env
// var (like GOOGLE_CLIENT_ID) isn't set yet at build time.
const providers: Array<unknown> = [
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    // authorize() runs on every email/password login attempt.
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }
      try {
        const normalizedEmail = (credentials.email as string)
          .toLowerCase()
          .trim();

        // Brute-force guard: check this email hasn't exceeded the allowed
        // number of attempts.
        const isAllowed = loginRateLimiter.check(normalizedEmail);

        if (!isAllowed) {
          console.warn(`Rate limit exceeded for email: ${normalizedEmail}`);
          // Important: return null, exactly like a failed login attempt.
          return null;
        }

        // Dynamic DB import: avoids loading the DB connection unnecessarily
        // when we bail out earlier (e.g. rate limit hit).
        const { default: db } = await import("@/src/db/index");
        const adminList = await db
          .select({
            id: admins.id,
            email: admins.email,
            username: admins.username,
            passwordHash: admins.passwordHash,
          })
          .from(admins)
          // Parameterized query via Drizzle (no SQL string concatenation)
          .where(eq(admins.email, credentials.email as string))
          .limit(1);

        if (adminList.length === 0) {
          // Unknown email: return null without revealing "unknown email"
          return null;
        }

        const admin = adminList[0];

        // Compare the supplied password against the stored Argon2id hash.
        const isPasswordValid = await verifyPassword(
          admin.passwordHash,
          credentials.password as string,
        );

        if (!isPasswordValid) {
          return null;
        }

        // Whatever is returned here becomes available in the jwt() callback
        // via the `user` param. Never return the password hash.
        return {
          id: admin.id,
          email: admin.email,
          name: admin.username,
        };
      } catch (error) {
        console.error("Auth error:", error);
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
    // signIn() runs right after a provider successfully authenticates a user.
    // Used here to restrict Google login to addresses already present in
    // the `admins` table (whitelist).
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
            // Replace the Google profile info with our admin table's data
            // (internal id, internal username) to stay consistent with the
            // credentials login path.
            user.name = adminList[0].username;
            user.id = adminList[0].id;
            return true;
          }
          // Google email not found in admins → access denied
          return false;
        } catch (error) {
          console.error("Google signIn error:", error);
          return false;
        }
      }
      // For the "credentials" provider, authorize() already did the check.
      return true;
    },

    // jwt() runs on every token creation/update.
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

    // session() turns the JWT payload into a usable `session` object
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

  // "jwt" strategy = stateless session, everything is encoded in the signed
  // cookie. No "sessions" table in the DB.
  session: {
    strategy: "jwt",
    // Max session cookie lifetime: 8h (NextAuth defaults to 30 days)
    maxAge: 60 * 60 * 8,
    // Sliding session: while the admin is active, the cookie is silently
    // renewed every hour. They're only logged out after 8h of inactivity.
    updateAge: 60 * 60,
  },

  // Read into a local var so it can be validated before use.
  secret: (() => {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      if (process.env.NODE_ENV === "production") {
        // Prefer an explicit crash at deploy time over a prod instance
        // silently running with a secret hardcoded in the source.
        throw new Error("NEXTAUTH_SECRET missing: required in production.");
      }
      // Fallback allowed in local dev/CI only, never in production.
      return "dev-only-secret-do-not-use-in-prod";
    }
    return secret;
  })(),
};

// ESM/CommonJS compatibility: depending on the version/bundler, NextAuth may
// be exported as `default` or directly as the module's function.
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

// handlers → used in app/api/auth/[...nextauth]/route.ts
// signIn/signOut → usable server-side (Server Actions, etc.)
// auth() → fetches the session server-side (Server Components, middleware...)
export const { handlers, signIn, signOut, auth } = nextAuthResult;
