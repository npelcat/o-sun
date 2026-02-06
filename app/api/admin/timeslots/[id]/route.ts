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
 * GET /api/admin/timeslots/[id]
 * Récupère un créneau spécifique par son ID
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

/**
 * PUT /api/admin/timeslots/[id]
 * Met à jour un créneau existant
 *
 * Body attendu (tous les champs sont optionnels) :
 * {
 *   "startTime": "2026-02-15T10:00:00Z",
 *   "endTime": "2026-02-15T18:00:00Z",
 *   "isActive": false
 * }
 */
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

/**
 * DELETE /api/admin/timeslots/[id]
 * Supprime un créneau
 *
 * ⚠️ IMPORTANT : La suppression échoue si une réservation est liée au créneau
 * (protection contre la suppression accidentelle de créneaux réservés)
 */
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
