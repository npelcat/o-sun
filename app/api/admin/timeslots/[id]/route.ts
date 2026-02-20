import { NextRequest, NextResponse } from "next/server";
import { AdminBusinessError, withErrorHandler } from "@/utils/withErrorHandler";
import {
  getTimeslotById,
  updateTimeslot,
  deleteTimeslot,
} from "@/lib/admin/timeslots";
import { updateTimeslotSchema } from "@/lib/validation/admin";
import db from "@/src/db/index";
import { bookings } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import logger from "@/utils/logger";

/**
 * @swagger
 * /api/admin/timeslots/{id}:
 *   get:
 *     summary: Récupère un créneau par ID
 *     description: Retourne les détails d'un créneau spécifique. Requiert d'être connecté.
 *     tags:
 *       - Admin - Timeslots
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique du créneau
 *     responses:
 *       200:
 *         description: Créneau trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 timeslot:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     startTime:
 *                       type: string
 *                       format: date-time
 *                     endTime:
 *                       type: string
 *                       format: date-time
 *                     isActive:
 *                       type: boolean
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Créneau introuvable
 *   put:
 *     summary: Met à jour un créneau
 *     description: Modifie les dates ou le statut actif d'un créneau. Tous les champs sont optionnels. Requiert d'être connecté.
 *     tags:
 *       - Admin - Timeslots
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique du créneau
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-02-15T10:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-02-15T18:00:00Z"
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Créneau mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Créneau mis à jour avec succès"
 *                 timeslot:
 *                   type: object
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Créneau introuvable
 *   delete:
 *     summary: Supprime un créneau
 *     description: |
 *       Supprime définitivement un créneau.
 *       ⚠️ La suppression échoue si une réservation est liée à ce créneau — supprimez d'abord la réservation.
 *       Requiert d'être connecté.
 *     tags:
 *       - Admin - Timeslots
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unique du créneau
 *     responses:
 *       200:
 *         description: Créneau supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Créneau supprimé avec succès"
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Créneau introuvable
 *       409:
 *         description: Suppression impossible - une réservation est liée à ce créneau
 */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withErrorHandler(req, async () => {
    const { id } = await params;
    logger.info(`GET /api/admin/timeslots/${id} - Récupération créneau`);

    const timeslot = await getTimeslotById(id);

    logger.info(`GET /api/admin/timeslots/${id} - Créneau trouvé`);

    return NextResponse.json({ timeslot });
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withErrorHandler(req, async () => {
    const { id } = await params;
    const body = await req.json();

    logger.info(`PUT /api/admin/timeslots/${id} - Mise à jour créneau`, {
      updates: body,
    });

    // Valider les données avec Zod
    const validatedData = updateTimeslotSchema.parse(body);

    const updatedTimeslot = await updateTimeslot(id, validatedData);

    logger.info(
      `PUT /api/admin/timeslots/${id} - Créneau mis à jour avec succès`,
      {
        isActive: updatedTimeslot.isActive,
      },
    );

    return NextResponse.json({
      message: "Créneau mis à jour avec succès",
      timeslot: updatedTimeslot,
    });
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return withErrorHandler(req, async () => {
    const { id } = await params;

    logger.info(`DELETE /api/admin/timeslots/${id} - Tentative suppression`);

    // Vérifier qu'aucune réservation n'est liée à ce créneau
    const linkedBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.timeSlotId, id))
      .limit(1);

    if (linkedBookings.length > 0) {
      logger.warn(
        `DELETE /api/admin/timeslots/${id} - Suppression refusée : réservation liée`,
        { bookingId: linkedBookings[0].id },
      );

      throw new AdminBusinessError(
        "Impossible de supprimer ce créneau : une réservation y est liée. Veuillez d'abord supprimer la réservation.",
      );
    }

    await deleteTimeslot(id);

    logger.info(`DELETE /api/admin/timeslots/${id} - Créneau supprimé`);

    return NextResponse.json({
      message: "Créneau supprimé avec succès",
    });
  });
}
