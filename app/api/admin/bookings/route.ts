import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/withErrorHandler";
import { getAllBookingsAdmin, createBookingAdmin } from "@/lib/admin/bookings";
import {
  bookingFiltersSchema,
  createBookingAdminSchema,
} from "@/lib/validation/admin";
import logger from "@/utils/logger";

/**
 * @swagger
 * /api/admin/bookings:
 *   get:
 *     summary: Liste toutes les réservations
 *     description: Récupère toutes les réservations avec filtres optionnels. Requiert d'être connecté.
 *     tags:
 *       - Admin - Bookings
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, canceled]
 *         description: Filtrer par statut
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *           example: "2026-01"
 *         description: Filtrer par mois au format YYYY-MM
 *       - in: query
 *         name: clientEmail
 *         schema:
 *           type: string
 *           format: email
 *         description: Filtrer par email client
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *         description: Filtrer par période
 *     responses:
 *       200:
 *         description: Liste des réservations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [pending, confirmed, canceled]
 *                       adminNotes:
 *                         type: string
 *                         nullable: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Filtres invalides
 *       401:
 *         description: Non authentifié
 *   post:
 *     summary: Crée manuellement une réservation
 *     description: Permet à l'admin de créer une réservation externe au système (ex - réservation par téléphone). Requiert d'être connecté.
 *     tags:
 *       - Admin - Bookings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - timeSlotId
 *               - clientId
 *             properties:
 *               timeSlotId:
 *                 type: string
 *                 description: ID du créneau à réserver
 *               clientId:
 *                 type: string
 *                 description: ID du client
 *               adminNotes:
 *                 type: string
 *                 description: Notes internes (optionnel)
 *     responses:
 *       201:
 *         description: Réservation créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Réservation créée avec succès"
 *                 booking:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */

export async function GET(req: NextRequest) {
  return withErrorHandler(req, async () => {
    logger.info(
      "GET /api/admin/bookings - Récupération des réservations admin",
    );

    // Extraire et valider les paramètres de query
    const searchParams = req.nextUrl.searchParams;
    const filters = {
      status: searchParams.get("status") || undefined,
      month: searchParams.get("month") || undefined,
      clientEmail: searchParams.get("clientEmail") || undefined,
      period: searchParams.get("period") || undefined,
    };

    // Valider les filtres avec Zod
    const validatedFilters = bookingFiltersSchema.parse(filters);

    const bookings = await getAllBookingsAdmin(validatedFilters);

    logger.info(
      `GET /api/admin/bookings - ${bookings.length} réservations récupérées`,
      { filters: validatedFilters },
    );

    return NextResponse.json({ bookings });
  });
}

export async function POST(req: NextRequest) {
  return withErrorHandler(req, async () => {
    logger.info(
      "POST /api/admin/bookings - Création manuelle d'une réservation",
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
      { status: 201 },
    );
  });
}
