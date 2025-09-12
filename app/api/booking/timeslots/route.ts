import { NextResponse, NextRequest } from "next/server";
import db from "@/src/db/index";
import { withErrorHandler } from "@/utils/withErrorHandler";
import logger from "@/utils/logger";
import { timeSlots } from "@/src/db/schema";
import { and, eq, isNull, lt, or } from "drizzle-orm";

export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/booking/timeslots:
 *   get:
 *     summary: Récupère tous les créneaux disponibles
 *     description: Retourne la liste des créneaux libres ou dont le verrou provisoire a expiré (plus de 15 minutes)
 *     tags:
 *       - Booking
 *     responses:
 *       200:
 *         description: Liste des créneaux disponibles récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 slots:
 *                   type: array
 *                   description: Tableau des créneaux disponibles
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: ID unique du créneau
 *                       startTime:
 *                         type: string
 *                         format: date-time
 *                         description: Heure de début du créneau
 *                       isActive:
 *                         type: boolean
 *                         description: Statut d'activité du créneau
 *                         example: true
 *                       lockedAt:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         description: Date de verrouillage provisoire (null si libre)
 *       500:
 *         description: Erreur interne du serveur
 */

export async function GET(req: NextRequest) {
  return withErrorHandler(req, async () => {
    logger.info(
      "GET /booking/timeslots - Récupération des créneaux disponibles"
    );

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    // Select active slots whose lock does not exist or has expired
    const availableSlots = await db
      .select()
      .from(timeSlots)
      .where(
        and(
          eq(timeSlots.isActive, true),
          or(
            isNull(timeSlots.lockedAt),
            lt(timeSlots.lockedAt, fifteenMinutesAgo)
          )
        )
      )
      .execute();

    logger.info(
      `GET /booking/timeslots - ${availableSlots.length} créneaux disponibles récupérés`
    );

    return NextResponse.json({ slots: availableSlots });
  });
}
