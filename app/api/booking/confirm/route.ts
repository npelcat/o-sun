import { NextResponse, NextRequest } from "next/server";
import db from "@/src/db/index";
import { withErrorHandler } from "@/utils/withErrorHandler";
import logger from "@/utils/logger";
import { confirmBookingSchema } from "@/lib/validation/booking";
import {
  confirmSlotPermanently,
  validateSlotForConfirmation,
} from "@/lib/timeslots";
import { createOrUpdateClient } from "@/lib/clients";
import { createFormData } from "@/lib/form-data";
import { createBooking } from "@/lib/bookings";

/**
 * @swagger
 * /api/booking/confirm:
 *   post:
 *     summary: Confirme une réservation
 *     description: |
 *       Valide définitivement un créneau précédemment verrouillé et crée :
 *       - Un client (ou met à jour si existant)
 *       - Un formulaire avec les informations de l'animal
 *       - Une réservation liée au créneau
 *       Le créneau doit avoir été verrouillé dans les 15 dernières minutes.
 *     tags:
 *       - Booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - timeSlotId
 *               - clientName
 *               - clientEmail
 *               - animalName
 *               - service
 *             properties:
 *               timeSlotId:
 *                 type: string
 *                 description: ID du créneau à confirmer (doit être verrouillé)
 *               clientName:
 *                 type: string
 *                 description: Nom complet du client
 *               clientEmail:
 *                 type: string
 *                 format: email
 *                 description: Email du client
 *               clientPhone:
 *                 type: string
 *                 description: Téléphone du client (optionnel)
 *                 nullable: true
 *               animalName:
 *                 type: string
 *                 description: Nom de l'animal
 *               animalType:
 *                 type: string
 *                 description: Type/espèce de l'animal (optionnel)
 *                 nullable: true
 *               service:
 *                 type: string
 *                 description: Type de service demandé
 *               answers:
 *                 oneOf:
 *                   - type: string
 *                   - type: object
 *                 description: Réponses au formulaire (JSON ou string)
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Réservation confirmée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Réservation confirmée"
 *                 data:
 *                   type: object
 *                   properties:
 *                     booking:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         timeSlotId:
 *                           type: string
 *                         clientId:
 *                           type: string
 *                         formId:
 *                           type: string
 *                         status:
 *                           type: string
 *                           enum: [pending]
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                     client:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         phone:
 *                           type: string
 *                           nullable: true
 *                     form:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         animalName:
 *                           type: string
 *                         animalType:
 *                           type: string
 *                           nullable: true
 *                         service:
 *                           type: string
 *                         answers:
 *                           type: string
 *                           nullable: true
 *       400:
 *         description: Données manquantes ou invalides (validation Zod échouée)
 *       404:
 *         description: Créneau introuvable
 *       409:
 *         description: Créneau déjà confirmé/annulé ou non verrouillé préalablement
 *       410:
 *         description: Temps de réservation expiré (> 15 minutes)
 */

export async function POST(req: NextRequest) {
  return withErrorHandler(req, async () => {
    const body = await req.json();

    const validatedData = confirmBookingSchema.parse(body);

    const {
      timeSlotId,
      clientName,
      clientEmail,
      clientPhone,
      animalName,
      animalType,
      service,
      answers,
    } = validatedData;

    logger.info("POST /booking/confirm - Tentative de confirmation", {
      timeSlotId,
      clientEmail,
      animalName,
    });

    const result = await db.transaction(async (trx) => {
      await validateSlotForConfirmation(trx, timeSlotId);
      logger.info("POST /booking/confirm - Créneau validé", { timeSlotId });

      const { client, isNew } = await createOrUpdateClient(trx, {
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
      });
      logger.info(
        `POST /booking/confirm - Client ${isNew ? "créé" : "mis à jour"}`,
        { clientId: client.id }
      );

      const form = await createFormData(trx, {
        animalName,
        animalType,
        service,
        answers,
      });
      logger.info("POST /booking/confirm - FormData créé", {
        formId: form.id,
      });

      const booking = await createBooking(trx, {
        timeSlotId,
        clientId: client.id,
        formId: form.id,
        status: "pending",
      });
      logger.info("POST /booking/confirm - Booking créé", {
        bookingId: booking.id,
      });

      await confirmSlotPermanently(trx, timeSlotId);
      logger.info("POST /booking/confirm - Créneau confirmé", { timeSlotId });

      return {
        booking,
        client,
        form,
      };
    });

    logger.info("POST /booking/confirm - Réservation confirmée avec succès", {
      bookingId: result.booking.id,
    });

    return NextResponse.json(
      { message: "Réservation confirmée", data: result },
      { status: 201 }
    );
  });
}
