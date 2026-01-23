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
 * GET /api/admin/bookings/[id]
 * Récupère une réservation spécifique avec tous ses détails (incluant adminNotes)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandler(req, async () => {
    const { id } = await params;
    logger.info(
      `GET /api/admin/bookings/${id} - Récupération réservation admin`
    );

    const booking = await getBookingByIdAdmin(id);

    logger.info(`GET /api/admin/bookings/${id} - Réservation trouvée`);

    return NextResponse.json({ booking });
  });
}

/**
 * PUT /api/admin/bookings/[id]
 * Met à jour une réservation (statut et/ou notes admin)
 * Retourne le booking complet avec toutes les jointures
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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
      }
    );

    return NextResponse.json({
      message: "Réservation mise à jour avec succès",
      booking: updatedBooking, // Retourne le booking complet
    });
  });
}

/**
 * DELETE /api/admin/bookings/[id]
 * Supprime une réservation et libère le créneau associé
 * ⚠️ Cette action est irréversible !
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandler(req, async () => {
    const { id } = await params;

    logger.info(`DELETE /api/admin/bookings/${id} - Suppression réservation`);

    await deleteBookingAdmin(id);

    logger.info(
      `DELETE /api/admin/bookings/${id} - Réservation supprimée et créneau libéré`
    );

    return NextResponse.json({
      message: "Réservation supprimée avec succès",
    });
  });
}
