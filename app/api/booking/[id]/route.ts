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
 *     description: Retourne les informations basiques d'une réservation (sans les jointures)
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
 *                   properties:
 *                     id:
 *                       type: string
 *                     timeSlotId:
 *                       type: string
 *                     clientId:
 *                       type: string
 *                     formId:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [pending, confirmed, canceled]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Réservation introuvable
 *   put:
 *     summary: Met à jour le statut d'une réservation
 *     description: Modifie uniquement le statut d'une réservation existante
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 description: Nouveau statut de la réservation
 *                 enum: [pending, confirmed, canceled]
 *     responses:
 *       200:
 *         description: Statut mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservation:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     status:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Réservation introuvable
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
 *         description: Réservation introuvable
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
