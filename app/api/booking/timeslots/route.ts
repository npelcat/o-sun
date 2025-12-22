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
 *     description: |
 *       Retourne la liste des créneaux réservables :
 *       - isActive = true
 *       - ET (lockedAt = null OU lockedAt < maintenant - 15 minutes)
 *       Les créneaux verrouillés depuis plus de 15 minutes sont considérés comme disponibles.
 *     tags:
 *       - TimeSlots
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
 *                         example: "550e8400-e29b-41d4-a716-446655440000"
 *                       startTime:
 *                         type: string
 *                         format: date-time
 *                         description: Heure de début du créneau
 *                         example: "2024-12-25T14:00:00Z"
 *                       endTime:
 *                         type: string
 *                         format: date-time
 *                         description: Heure de fin du créneau
 *                         example: "2024-12-25T15:00:00Z"
 *                       isActive:
 *                         type: boolean
 *                         description: Statut d'activité du créneau (toujours true ici)
 *                         example: true
 *                       lockedAt:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         description: Date de verrouillage provisoire (null si libre, ou expiré si > 15 min)
 *                         example: null
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date de création du créneau
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date de dernière mise à jour
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur interne"
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
