import { NextResponse, NextRequest } from "next/server";
import { withErrorHandler } from "@/utils/withErrorHandler";
import logger from "@/utils/logger";
import { getAllBookings } from "@/lib/bookings";

/**
 * @swagger
 * /api/booking:
 *   get:
 *     summary: Récupère toutes les réservations avec détails complets
 *     description: Retourne la liste de toutes les réservations avec les informations des créneaux et des clients (JOIN complet)
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: Liste des réservations avec détails récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reservations:
 *                   type: array
 *                   description: Tableau des réservations triées par date décroissante
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: ID unique de la réservation
 *                       status:
 *                         type: string
 *                         description: Statut de la réservation
 *                         enum: [pending, confirmed, cancelled]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date de création de la réservation
 *                       timeSlotId:
 *                         type: string
 *                         description: ID du créneau réservé
 *                       startTime:
 *                         type: string
 *                         format: date-time
 *                         description: Heure de début du créneau
 *                       endTime:
 *                         type: string
 *                         format: date-time
 *                         description: Heure de fin du créneau
 *                       isTimeSlotActive:
 *                         type: boolean
 *                         description: Statut d'activité du créneau
 *                       formId:
 *                         type: string
 *                         description: ID du formulaire client
 *                       clientName:
 *                         type: string
 *                         description: Nom du client
 *                       clientEmail:
 *                         type: string
 *                         format: email
 *                         description: Email du client
 *                       clientContent:
 *                         type: string
 *                         description: Message du client
 *                       formCreatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date de création du formulaire
 *       500:
 *         description: Erreur interne du serveur
 */

export async function GET(req: NextRequest) {
  return withErrorHandler(req, async () => {
    logger.info("GET /booking - Retrieving all reservations");
    const reservations = await getAllBookings();
    logger.info(`GET /booking - Retrieved ${reservations.length} reservations`);
    return NextResponse.json({ reservations });
  });
}
