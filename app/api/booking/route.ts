import { NextResponse, NextRequest } from "next/server";
import { withErrorHandler } from "@/utils/withErrorHandler";
import logger from "@/utils/logger";
import { getAllBookings } from "@/lib/bookings";

/**
 * @swagger
 * /api/booking:
 *   get:
 *     summary: Récupère toutes les réservations avec détails complets
 *     description: |
 *       Retourne la liste de toutes les réservations avec les informations enrichies :
 *       - Détails du créneau (timeSlot)
 *       - Informations du client
 *       - Données du formulaire (animal, service, réponses)
 *       Triées par date de création décroissante.
 *     tags:
 *       - Admin
 *       - Booking
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
 *                         example: "550e8400-e29b-41d4-a716-446655440000"
 *                       status:
 *                         type: string
 *                         description: Statut de la réservation
 *                         enum: [pending, confirmed, canceled]
 *                         example: "pending"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date de création de la réservation
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date de dernière mise à jour de la réservation
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
 *                       clientId:
 *                         type: string
 *                         description: ID du client
 *                       clientName:
 *                         type: string
 *                         description: Nom du client
 *                       clientEmail:
 *                         type: string
 *                         format: email
 *                         description: Email du client
 *                       clientPhone:
 *                         type: string
 *                         nullable: true
 *                         description: Téléphone du client
 *                       formId:
 *                         type: string
 *                         description: ID du formulaire
 *                       animalName:
 *                         type: string
 *                         description: Nom de l'animal
 *                       animalType:
 *                         type: string
 *                         nullable: true
 *                         description: Type/espèce de l'animal
 *                       service:
 *                         type: string
 *                         description: Type de service demandé
 *                       answers:
 *                         type: string
 *                         nullable: true
 *                         description: Réponses au formulaire (JSON stringifié)
 *                       formCreatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date de création du formulaire
 *       500:
 *         description: Erreur interne du serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur interne"
 */

export async function GET(req: NextRequest) {
  return withErrorHandler(req, async () => {
    logger.info("GET /booking - Retrieving all reservations");
    const reservations = await getAllBookings();
    logger.info(`GET /booking - Retrieved ${reservations.length} reservations`);
    return NextResponse.json({ reservations });
  });
}
