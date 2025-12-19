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
 *     summary: Confirme une réservation provisoire
 *     description: Valide définitivement un créneau verrouillé et crée la réservation
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
 *               - name
 *               - email
 *             properties:
 *               timeSlotId:
 *                 type: string
 *                 description: ID du créneau à confirmer
 *               name:
 *                 type: string
 *                 description: Nom du client
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email du client
 *               content:
 *                 type: string
 *                 description: Message optionnel du client
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
 *       400:
 *         description: Données manquantes ou invalides
 *       404:
 *         description: Créneau introuvable
 *       409:
 *         description: Créneau déjà confirmé ou non réservé
 *       410:
 *         description: Temps de réservation expiré
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
