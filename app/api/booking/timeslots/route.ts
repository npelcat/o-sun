import { NextResponse, NextRequest } from "next/server";
import { withErrorHandler } from "@/utils/withErrorHandler";
import logger from "@/utils/logger";
import { getAvailableSlots } from "@/lib/timeslots";

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

    const availableSlots = await getAvailableSlots();

    logger.info(
      `GET /booking/timeslots - ${availableSlots.length} créneaux disponibles`
    );
    return NextResponse.json({ slots: availableSlots });
  });
}
