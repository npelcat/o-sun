import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/withErrorHandler";
import { getAllBookingsAdmin, createBookingAdmin } from "@/lib/admin/bookings";
import {
  bookingFiltersSchema,
  createBookingAdminSchema,
} from "@/lib/validation/admin";
import logger from "@/utils/logger";

/**
 * GET /api/admin/bookings
 * Récupère toutes les réservations avec filtres optionnels
 *
 * Query params possibles :
 * - status: "pending" | "confirmed" | "canceled"
 * - month: "YYYY-MM" (ex: "2026-01")
 * - clientEmail: "email@example.com"
 *
 * Exemple : GET /api/admin/bookings?status=pending&month=2026-01
 */
export async function GET(req: NextRequest) {
  return withErrorHandler(req, async () => {
    logger.info(
      "GET /api/admin/bookings - Récupération des réservations admin"
    );

    // Extraire et valider les paramètres de query
    const searchParams = req.nextUrl.searchParams;
    const filters = {
      status: searchParams.get("status") || undefined,
      month: searchParams.get("month") || undefined,
      clientEmail: searchParams.get("clientEmail") || undefined,
    };

    // Valider les filtres avec Zod
    const validatedFilters = bookingFiltersSchema.parse(filters);

    const bookings = await getAllBookingsAdmin(validatedFilters);

    logger.info(
      `GET /api/admin/bookings - ${bookings.length} réservations récupérées`,
      { filters: validatedFilters }
    );

    return NextResponse.json({ bookings });
  });
}

/**
 * POST /api/admin/bookings
 * Crée manuellement une réservation (admin uniquement)
 *
 * Utile si ta cliente veut ajouter une réservation externe au système
 * (ex: réservation par téléphone, par un autre canal)
 */
export async function POST(req: NextRequest) {
  return withErrorHandler(req, async () => {
    logger.info(
      "POST /api/admin/bookings - Création manuelle d'une réservation"
    );

    const body = await req.json();
    const validatedData = createBookingAdminSchema.parse(body);

    const result = await createBookingAdmin(validatedData);

    logger.info("POST /api/admin/bookings - Réservation créée avec succès", {
      bookingId: result.booking.id,
    });

    return NextResponse.json(
      {
        message: "Réservation créée avec succès",
        booking: result.booking,
      },
      { status: 201 }
    );
  });
}
