import { NextResponse, NextRequest } from "next/server";
import logger from "@/utils/logger";
import {
  deleteBooking,
  getBookingByIdSimple,
  updateBookingStatus,
} from "@/lib/bookings";
import { withErrorHandler } from "@/utils/withErrorHandler";
import { updateBookingStatusSchema } from "@/lib/validation/booking";

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
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandler(req, async () => {
    const { id } = await params;
    logger.info(`GET /booking/${id} - Retrieving reservation`);

    const reservation = await getBookingByIdSimple(id);

    logger.info(`Reservation found for id: ${id}`);
    return NextResponse.json({ reservation });
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandler(req, async () => {
    const { id } = await params;
    const body = await req.json();

    const { status } = updateBookingStatusSchema.parse(body);

    logger.info(`PUT /booking/${id} - Updating reservation status`, { status });

    const updatedReservation = await updateBookingStatus(id, status);

    logger.info(`PUT /booking/${id} - Reservation status updated to ${status}`);
    return NextResponse.json({ reservation: updatedReservation });
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandler(req, async () => {
    const { id } = await params;
    logger.info(`DELETE /booking/${id} - Deleting reservation`);

    await deleteBooking(id);

    logger.info(`DELETE /booking/${id} - Reservation successfully deleted`);
    return NextResponse.json({ message: "Réservation supprimée" });
  });
}
