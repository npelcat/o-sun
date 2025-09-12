import { NextRequest, NextResponse } from "next/server";
import db from "@/src/db/index";
import { timeSlots } from "@/src/db/schema";
import { eq } from "drizzle-orm";

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
  try {
    const { timeSlotId } = await req.json();

    if (!timeSlotId) {
      return NextResponse.json(
        { error: "ID du créneau manquant" },
        { status: 400 }
      );
    }

    await db
      .update(timeSlots)
      .set({ isActive: true, lockedAt: null })
      .where(eq(timeSlots.id, timeSlotId))
      .execute();

    return NextResponse.json({ message: "Créneau libéré avec succès" });
  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
