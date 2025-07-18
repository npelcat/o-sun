import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import db from "@/src/db/index";
import { users } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
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
          const userList = await db
            .select({
              id: users.id,
              email: users.email,
              username: users.username,
              passwordHash: users.passwordHash,
              role: users.role,
            })
            .from(users)
            .where(eq(users.email, credentials.email))
            .limit(1);
          if (userList.length === 0) {
            return null;
          }
          const user = userList[0];
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );
          if (!isPasswordValid || user.role !== "admin") {
            return null;
          }
          return {
            id: user.id,
            email: user.email,
            name: user.username,
          };
        } catch (error) {
          console.error("Erreur auth:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const userList = await db
            .select({
              id: users.id,
              email: users.email,
              username: users.username,
              role: users.role,
            })
            .from(users)
            .where(eq(users.email, user.email!))
            .limit(1);
          if (userList.length > 0 && userList[0].role === "admin") {
            user.name = userList[0].username;
            user.id = userList[0].id;
            return true;
          }
          return false;
        } catch (error) {
          console.error("Erreur signIn Google:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.username = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.name = token.username as string;
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
  secret: process.env.NEXTAUTH_SECRET,
};
