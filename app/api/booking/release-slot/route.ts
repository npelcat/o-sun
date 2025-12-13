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
 *     description: Remet un créneau en disponibilité en annulant son verrouillage provisoire
 *     tags:
 *       - Booking
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
 *         description: ID du créneau manquant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID du créneau manquant"
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
