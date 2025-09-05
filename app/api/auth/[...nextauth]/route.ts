import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * @swagger
 * /api/auth/{...nextauth}:
 *   get:
 *     summary: Endpoints d'authentification NextAuth
 *     description: Gère les callbacks, sessions, signin/signout (géré par NextAuth)
 *     responses:
 *       200:
 *         description: Varie selon l'endpoint NextAuth appelé
 *   post:
 *     summary: Endpoints d'authentification NextAuth
 *     description: Gère les callbacks, sessions, signin/signout (géré par NextAuth)
 *     responses:
 *       200:
 *         description: Varie selon l'endpoint NextAuth appelé
 */

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
