import { handlers } from "@/lib/auth/auth";

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

// Évite un crash au build si NextAuth ne fournit pas encore les handlers
export const GET =
  handlers?.GET ??
  (async () => new Response("Auth not configured", { status: 500 }));
export const POST =
  handlers?.POST ??
  (async () => new Response("Auth not configured", { status: 500 }));
