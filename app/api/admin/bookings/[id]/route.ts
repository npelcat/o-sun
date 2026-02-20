import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/withErrorHandler";
import {
  getBookingByIdAdmin,
  updateBookingAdmin,
  deleteBookingAdmin,
} from "@/lib/admin/bookings";
import { updateBookingAdminSchema } from "@/lib/validation/admin";
import logger from "@/utils/logger";

/**
 * @swagger
 * /api/admin/bookings/{id}:
 *   get:
 *     summary: Récupère une réservation par ID (détail complet)
 *     description: Retourne une réservation avec toutes ses jointures et les notes admin. Requiert d'être connecté.
 *     tags:
 *       - Admin - Bookings
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
 *                 booking:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [pending, confirmed, canceled]
 *                     adminNotes:
 *                       type: string
 *                       nullable: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Réservation introuvable
 *   put:
 *     summary: Met à jour une réservation
 *     description: Modifie le statut et/ou les notes admin d'une réservation. Retourne le booking complet avec toutes les jointures. Requiert d'être connecté.
 *     tags:
 *       - Admin - Bookings
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
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, canceled]
 *                 description: Nouveau statut (optionnel)
 *               adminNotes:
 *                 type: string
 *                 description: Notes internes admin (optionnel)
 *     responses:
 *       200:
 *         description: Réservation mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Réservation mise à jour avec succès"
 *                 booking:
 *                   type: object
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Réservation introuvable
 *   delete:
 *     summary: Supprime une réservation
 *     description: Supprime définitivement une réservation et libère le créneau associé. ⚠️ Action irréversible. Requiert d'être connecté.
 *     tags:
 *       - Admin - Bookings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique de la réservation
 *     responses:
 *       200:
 *         description: Réservation supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Réservation supprimée avec succès"
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Réservation introuvable
 */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withErrorHandler(req, async () => {
    const { id } = await params;
    logger.info(
      `GET /api/admin/bookings/${id} - Récupération réservation admin`,
    );

    const booking = await getBookingByIdAdmin(id);

    logger.info(`GET /api/admin/bookings/${id} - Réservation trouvée`);

    return NextResponse.json({ booking });
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withErrorHandler(req, async () => {
    const { id } = await params;
    const body = await req.json();

    logger.info(`PUT /api/admin/bookings/${id} - Mise à jour réservation`, {
      updates: body,
    });

    // Valider les données avec Zod
    const validatedData = updateBookingAdminSchema.parse(body);

    // Mettre à jour
    await updateBookingAdmin(id, validatedData);

    // Re-fetch le booking complet avec toutes les jointures
    const updatedBooking = await getBookingByIdAdmin(id);

    logger.info(
      `PUT /api/admin/bookings/${id} - Réservation mise à jour avec succès`,
      {
        status: updatedBooking.status,
        hasNotes: !!updatedBooking.adminNotes,
      },
    );

    return NextResponse.json({
      message: "Réservation mise à jour avec succès",
      booking: updatedBooking, // Retourne le booking complet
    });
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withErrorHandler(req, async () => {
    const { id } = await params;

    logger.info(`DELETE /api/admin/bookings/${id} - Suppression réservation`);

    await deleteBookingAdmin(id);

    logger.info(
      `DELETE /api/admin/bookings/${id} - Réservation supprimée et créneau libéré`,
    );

    return NextResponse.json({
      message: "Réservation supprimée avec succès",
    });
  });
}
