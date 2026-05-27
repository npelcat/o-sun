import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { clients } from "@/src/db/schema";
import { lt } from "drizzle-orm";
import { NextResponse } from "next/server";

// Cette route est appelée automatiquement chaque mois par GitHub Actions.
// Elle supprime les clients dont les données n'ont pas été mises à jour
// depuis plus de 2 ans, conformément à la politique de confidentialité.
// La suppression des clients entraîne automatiquement la suppression
// de leurs réservations et formulaires associés (cascade définie dans le schéma).

// Ici une connexion dédiée avec le rôle postgres (droits complets),
// distincte de la connexion applicative booking_app qui est volontairement
// restreinte pour la sécurité du front.
const cronClient = postgres(process.env.CRON_DATABASE_URL!, { prepare: false });
const cronDb = drizzle(cronClient);

export async function GET(request: Request) {
  // Vérification du token secret pour s'assurer que la requête
  // vient bien de GitHub Actions et pas d'un visiteur quelconque.
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.log("[CRON] Auth header reçu:", authHeader);
  console.log("[CRON] Secret attendu:", `Bearer ${process.env.CRON_SECRET}`);

  // Calcul de la date limite : aujourd'hui moins 2 ans
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  try {
    // Suppression de tous les clients dont le champ updated_at
    // est antérieur à la date limite calculée ci-dessus.
    // Les réservations et formulaires associés sont supprimés
    // automatiquement grâce aux cascades définies dans le schéma.
    const deleted = await cronDb
      .delete(clients)
      .where(lt(clients.updatedAt, twoYearsAgo))
      .returning({ id: clients.id });

    // Retourne le nombre de clients supprimés pour pouvoir
    // vérifier dans les logs GitHub Actions que tout s'est bien passé.
    return NextResponse.json({
      success: true,
      deletedCount: deleted.length,
    });
  } catch (err) {
    console.error("[CRON cleanup] Erreur lors de la suppression :", err);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
