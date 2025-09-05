import { NextResponse, NextRequest } from "next/server";
import db from "@/src/db/index";
import { bookings } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { withErrorHandler, HttpError } from "@/utils/withErrorHandler";
import logger from "@/utils/logger";

/**
 * @swagger
 * /api/booking/{id}:
 *   get:
 *     summary: Récupère une réservation par ID
 *     description: Retourne les détails d'une réservation spécifique
 *     tags:
 *       - Booking
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique de la réservation
 *     responses:
 *       200:
 *         description: Réservation trouvée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservation:
 *                   type: object
 *                   description: Données de la réservation
 *       404:
 *         description: Réservation introuvable
 *   put:
 *     summary: Met à jour une réservation
 *     description: Modifie le créneau ou le statut d'une réservation existante
 *     tags:
 *       - Booking
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique de la réservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - timeSlotId
 *               - status
 *             properties:
 *               timeSlotId:
 *                 type: string
 *                 description: Nouveau créneau pour la réservation
 *               status:
 *                 type: string
 *                 description: Nouveau statut de la réservation
 *                 enum: [pending, confirmed, cancelled]
 *     responses:
 *       200:
 *         description: Réservation mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservation:
 *                   type: object
 *                   description: Données de la réservation mise à jour
 *       400:
 *         description: Données manquantes ou invalides
 *       404:
 *         description: Réservation introuvable ou non mise à jour
 *   delete:
 *     summary: Supprime une réservation
 *     description: Supprime définitivement une réservation
 *     tags:
 *       - Booking
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique de la réservation
 *     responses:
 *       200:
 *         description: Réservation supprimée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Réservation supprimée"
 *       404:
 *         description: Réservation introuvable ou non supprimée
 */

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandler(req, async () => {
    const { id } = params;
    logger.info(`GET /booking/${id} - Retrieving reservation`);
    const reservation = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id));
    if (!reservation.length) {
      logger.error(`Reservation not found for id: ${id}`);
      throw new HttpError(404, "Réservation introuvable");
    }
    logger.info(`Reservation found for id: ${id}`);
    return NextResponse.json({ reservation: reservation[0] });
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandler(req, async () => {
    const { id } = params;
    const body = await req.json();
    const { timeSlotId, status } = body;

    logger.info(`PUT /booking/${id} - Updating reservation`, {
      timeSlotId,
      status,
    });

    if (!timeSlotId || !status) {
      logger.error(`PUT /booking/${id} - Missing or invalid data`);
      throw new HttpError(400, "Données manquantes ou invalides");
    }

    const updatedReservation = await db
      .update(bookings)
      .set({ timeSlotId, status })
      .where(eq(bookings.id, id))
      .returning();

    if (!updatedReservation.length) {
      logger.error(`PUT /booking/${id} - Reservation not found or not updated`);
      throw new HttpError(404, "Réservation introuvable ou non mise à jour");
    }
    logger.info(`PUT /booking/${id} - Reservation successfully updated`);
    return NextResponse.json({ reservation: updatedReservation[0] });
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandler(req, async () => {
    const { id } = params;
    logger.info(`DELETE /booking/${id} - Deleting reservation`);
    const deletedReservation = await db
      .delete(bookings)
      .where(eq(bookings.id, id))
      .returning();

    if (!deletedReservation.length) {
      logger.error(
        `DELETE /booking/${id} - Reservation not found or not deleted`
      );
      throw new HttpError(404, "Réservation introuvable ou non supprimée");
    }
    logger.info(`DELETE /booking/${id} - Reservation successfully deleted`);
    return NextResponse.json({ message: "Réservation supprimée" });
  });
}
