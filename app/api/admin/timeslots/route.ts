import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/utils/withErrorHandler";
import { getAllTimeslotsAdmin, createTimeslot } from "@/lib/admin/timeslots";
import {
  timeslotFiltersSchema,
  createTimeslotSchema,
} from "@/lib/validation/admin";
import logger from "@/utils/logger";

/**
 * @swagger
 * /api/admin/timeslots:
 *   get:
 *     summary: Liste tous les créneaux horaires
 *     description: Récupère tous les créneaux avec filtres optionnels. Requiert d'être connecté.
 *     tags:
 *       - Admin - Timeslots
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *           example: "2026-01"
 *         description: Filtrer par mois au format YYYY-MM
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: Filtrer par statut actif/inactif
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filtrer à partir de cette date (ISO 8601)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filtrer jusqu'à cette date (ISO 8601)
 *     responses:
 *       200:
 *         description: Liste des créneaux
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 timeslots:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       startTime:
 *                         type: string
 *                         format: date-time
 *                       endTime:
 *                         type: string
 *                         format: date-time
 *                       isActive:
 *                         type: boolean
 *       400:
 *         description: Filtres invalides
 *       401:
 *         description: Non authentifié
 *   post:
 *     summary: Crée un nouveau créneau horaire
 *     description: Crée un créneau avec une date de début et de fin. Les dates doivent être au format ISO 8601. Requiert d'être connecté.
 *     tags:
 *       - Admin - Timeslots
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startTime
 *               - endTime
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-02-15T09:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-02-15T17:00:00Z"
 *     responses:
 *       201:
 *         description: Créneau créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Créneau créé avec succès"
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
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
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
      { filters: validatedFilters },
    );

    return NextResponse.json({ timeslots });
  });
}

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
      { status: 201 },
    );
  });
}
