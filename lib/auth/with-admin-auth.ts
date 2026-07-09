import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Vérifie qu'une session admin valide existe avant d'exécuter le handler.
 *
 * → Défense en profondeur : le middleware reste la première ligne de défense,
 *   mais pas de dépendance à une seule couche. Si une route est un jour
 *   ajoutée sans être couverte par le matcher du middleware, ou si un futur
 *   bug de framework contourne le middleware, cette vérification reste active.
 *
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
