import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/withErrorHandler";
import { getAllTimeslotsAdmin, createTimeslot } from "@/lib/admin/timeslots";
import {
  timeslotFiltersSchema,
  createTimeslotSchema,
} from "@/lib/validation/admin";
import logger from "@/utils/logger";

/**
 * GET /api/admin/timeslots
 * Récupère tous les créneaux avec filtres optionnels
 *
 * Query params possibles :
 * - month: "YYYY-MM" (ex: "2026-01")
 * - isActive: "true" | "false"
 * - startDate: ISO 8601 string
 * - endDate: ISO 8601 string
 *
 * Exemple : GET /api/admin/timeslots?month=2026-01&isActive=true
 */
export async function GET(req: NextRequest) {
  return withErrorHandler(req, async () => {
    logger.info("GET /api/admin/timeslots - Récupération créneaux admin");

    // Extraire et valider les paramètres de query
    const searchParams = req.nextUrl.searchParams;
    const filters = {
      month: searchParams.get("month") || undefined,
      isActive: searchParams.get("isActive") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
    };

    // Valider les filtres avec Zod
    const validatedFilters = timeslotFiltersSchema.parse(filters);

    const timeslots = await getAllTimeslotsAdmin(validatedFilters);

    logger.info(
      `GET /api/admin/timeslots - ${timeslots.length} créneaux récupérés`,
      { filters: validatedFilters }
    );

    return NextResponse.json({ timeslots });
  });
}

/**
 * POST /api/admin/timeslots
 * Crée un nouveau créneau horaire
 *
 * Body attendu :
 * {
 *   "startTime": "2026-02-15T09:00:00Z",
 *   "endTime": "2026-02-15T17:00:00Z"
 * }
 *
 * Note : Les dates doivent être au format ISO 8601
 */
export async function POST(req: NextRequest) {
  return withErrorHandler(req, async () => {
    logger.info("POST /api/admin/timeslots - Création d'un créneau");

    const body = await req.json();

    // Valider les données avec Zod
    const validatedData = createTimeslotSchema.parse(body);

    const newTimeslot = await createTimeslot(validatedData);

    logger.info("POST /api/admin/timeslots - Créneau créé avec succès", {
      timeslotId: newTimeslot.id,
      startTime: newTimeslot.startTime,
      endTime: newTimeslot.endTime,
    });

    return NextResponse.json(
      {
        message: "Créneau créé avec succès",
        timeslot: newTimeslot,
      },
      { status: 201 }
    );
  });
}
