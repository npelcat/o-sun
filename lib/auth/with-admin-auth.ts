import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Checks a valid admin session exists before running the handler.
 *
 * → Defense in depth: middleware stays the first line of defense, but this
 *   avoids relying on a single layer. If a route is ever added without
 *   being covered by the middleware matcher, or a future framework bug
 *   bypasses the middleware, this check still holds.
 */
export function withAdminAuth<T extends unknown[]>(
  handler: (req: NextRequest, ...args: T) => Promise<NextResponse>,
) {
  return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    return handler(req, ...args);
  };
}
