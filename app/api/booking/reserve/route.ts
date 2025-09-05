import { NextRequest, NextResponse } from "next/server";
import db from "@/src/db/index";
import { timeSlots } from "@/src/db/schema";
import { withErrorHandler } from "@/utils/withErrorHandler";
import logger from "@/utils/logger";
import { and, eq, isNull, lt, or } from "drizzle-orm";

/**
 * @swagger
 * /api/booking/reserve:
 *   post:
 *     summary: Réserve provisoirement un créneau
 *     description: Verrouille un créneau pendant 15 minutes pour permettre à l'utilisateur de finaliser sa réservation
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
 *                 description: ID du créneau à réserver provisoirement
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
 *       400:
 *         description: ID du créneau manquant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "timeSlotId manquant"
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
 */

export async function POST(request: NextRequest) {
  return withErrorHandler(request, async () => {
    const { timeSlotId } = await request.json();
    if (!timeSlotId) {
      logger.error("POST /booking/reserve - timeSlotId manquant");
      return NextResponse.json(
        { message: "timeSlotId manquant" },
        { status: 400 }
      );
    }

    logger.info("POST /booking/reserve - Réservation provisoire demandée", {
      timeSlotId,
    });

    const FIFTEEN_MINUTES_AGO = new Date(Date.now() - 15 * 60 * 1000);

    await db.transaction(async (trx) => {
      const slot = await trx
        .select()
        .from(timeSlots)
        .where(
          and(
            eq(timeSlots.id, timeSlotId),
            eq(timeSlots.isActive, true),
            or(
              isNull(timeSlots.lockedAt),
              lt(timeSlots.lockedAt, FIFTEEN_MINUTES_AGO)
            )
          )
        )
        .limit(1)
        .execute();

      if (!slot || slot.length === 0) {
        logger.error(
          "POST /booking/reserve - Créneau indisponible ou déjà réservé",
          { timeSlotId }
        );
        throw new Error("Créneau indisponible ou déjà réservé");
      }

      await trx
        .update(timeSlots)
        .set({ lockedAt: new Date() })
        .where(eq(timeSlots.id, timeSlotId))
        .execute();

      logger.info("POST /booking/reserve - Créneau verrouillé provisoirement", {
        timeSlotId,
      });
    });

    return NextResponse.json({ message: "Créneau réservé provisoirement" });
  });
}
