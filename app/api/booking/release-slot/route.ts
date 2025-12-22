import { NextRequest, NextResponse } from "next/server";
import logger from "@/utils/logger";
import { releaseSlotSchema } from "@/lib/validation/booking";
import { releaseSlot } from "@/lib/timeslots";
import { withErrorHandler } from "@/utils/withErrorHandler";

/**
 * @swagger
 * /api/booking/release-slot:
 *   post:
 *     summary: Libère un créneau verrouillé
 *     description: |
 *       Remet un créneau en disponibilité en supprimant son verrouillage.
 *       Met à jour le créneau pour :
 *       - isActive = true
 *       - lockedAt = null
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
 *                 description: ID du créneau à libérer
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Créneau libéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Créneau libéré avec succès"
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

export async function POST(req: NextRequest) {
  return withErrorHandler(req, async () => {
    const body = await req.json();

    const { timeSlotId } = releaseSlotSchema.parse(body);

    logger.info("POST /booking/release-slot - Libération du créneau", {
      timeSlotId,
    });

    await releaseSlot(timeSlotId);

    logger.info("POST /booking/release-slot - Créneau libéré avec succès", {
      timeSlotId,
    });

    return NextResponse.json({ message: "Créneau libéré avec succès" });
  });
}
