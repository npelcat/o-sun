import { handlers } from "@/lib/auth/auth";

// https://authjs.dev/reference/nextjs

export const GET =
  handlers?.GET ??
  (async () => new Response("Auth not configured", { status: 500 }));
export const POST =
  handlers?.POST ??
  (async () => new Response("Auth not configured", { status: 500 }));
