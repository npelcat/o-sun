import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/withErrorHandler";
import logger from "@/utils/logger";
import { reserveSlotSchema } from "@/lib/validation/booking";
import { reserveSlot } from "@/lib/timeslots";

/**
 * @swagger
 * /api/booking/reserve:
 *   post:
 *     summary: Réserve provisoirement un créneau
 *     description: |
 *       Verrouille un créneau pendant 15 minutes maximum via une transaction atomique.
 *       Vérifie d'abord que le créneau est disponible :
 *       - isActive = true
 *       - lockedAt = null OU expiré (> 15 min)
 *       Puis met à jour lockedAt = now()
 *     tags:
 *       - Booking
 *       - TimeSlots
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - timeSlotId
 *             properties:
 *               timeSlotId:
 *                 type: string
 *                 description: ID du créneau à réserver provisoirement
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Créneau réservé provisoirement avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Créneau réservé provisoirement"
 *                 timeSlotId:
 *                   type: string
 *                   description: ID du créneau verrouillé
 *                   example: "550e8400-e29b-41d4-a716-446655440000"
 *       400:
 *         description: Données invalides (validation Zod échouée)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "timeSlotId est requis"
 *       409:
 *         description: Créneau indisponible ou déjà réservé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Créneau indisponible ou déjà réservé"
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

export async function POST(request: NextRequest) {
  return withErrorHandler(request, async () => {
    const body = await request.json();

    const { timeSlotId } = reserveSlotSchema.parse(body);

    logger.info("POST /booking/reserve - Réservation provisoire demandée", {
      timeSlotId,
    });

    await reserveSlot(timeSlotId);

    logger.info("POST /booking/reserve - Créneau verrouillé provisoirement", {
      timeSlotId,
    });

    return NextResponse.json({
      message: "Créneau réservé provisoirement",
      timeSlotId,
    });
  });
}
