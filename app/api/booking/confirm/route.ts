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
import { validateEmail } from "@/lib/validation/email";
import { verifyTurnstileToken } from "@/lib/validation/turnstile";
import { apiRateLimiter } from "@/lib/security/rate-limit-simple";

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
 *               turnstileToken:
 *                 type: string
 *                 description: Token de vérification Cloudflare Turnstile (généré par le widget anti-bot)
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
 *       429:
 *         description: Trop de requêtes (rate limiting par IP)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trop de requêtes, réessayez dans quelques instants"
 */

export async function POST(req: NextRequest) {
  return withErrorHandler(req, async () => {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const isAllowed = apiRateLimiter.check(ip);

    if (!isAllowed) {
      logger.warn(`Rate limit exceeded for IP: ${ip} on /api/booking/confirm`);
      return NextResponse.json(
        { message: "Trop de requêtes, réessayez dans quelques instants" },
        { status: 429 },
      );
    }

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
      animalInfo,
      householdInfo,
      serviceSpecificAnswers,
      preferredPronoun,
      socialMediaConsent,
      monthlyPlanningAck,
      cgvAccepted,
      turnstileToken,
    } = validatedData;

    logger.info("POST /booking/confirm - Confirmation attempt", {
      timeSlotId,
      animalName,
    });

    if (!cgvAccepted) {
      return NextResponse.json(
        { message: "Les conditions générales de vente doivent être acceptées" },
        { status: 400 },
      );
    }

    const turnstileCheck = await verifyTurnstileToken(turnstileToken);

    if (!turnstileCheck.success) {
      logger.warn("POST /booking/confirm - Turnstile check failed");
      return NextResponse.json(
        { message: turnstileCheck.error || "Vérification de sécurité échouée" },
        { status: 400 },
      );
    }

    const emailValidation = await validateEmail(clientEmail);

    if (!emailValidation.isValid) {
      logger.warn("POST /booking/confirm - Invalid email", {
        domain: clientEmail.split("@")[1],
        reason: emailValidation.message,
      });

      return NextResponse.json(
        { message: emailValidation.message },
        { status: 400 },
      );
    }

    if (emailValidation.message) {
      logger.info("POST /booking/confirm - Email accepted with warning", {
        domain: clientEmail.split("@")[1],
        warning: emailValidation.message,
      });
    }

    const result = await db.transaction(async (trx) => {
      await validateSlotForConfirmation(trx, timeSlotId);
      logger.info("POST /booking/confirm - Slot validated", { timeSlotId });

      const { client, isNew } = await createOrUpdateClient(trx, {
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
      });
      logger.info(
        `POST /booking/confirm - Client ${isNew ? "created" : "updated"}`,
        { clientId: client.id },
      );

      const form = await createFormData(trx, {
        animalName,
        animalType,
        service,
        answers,
        animalInfo,
        householdInfo,
        serviceSpecificAnswers,
        preferredPronoun,
        socialMediaConsent,
        monthlyPlanningAck,
        cgvAccepted,
      });
      logger.info("POST /booking/confirm - FormData created", {
        formId: form.id,
      });

      const booking = await createBooking(trx, {
        timeSlotId,
        clientId: client.id,
        formId: form.id,
        status: "pending",
      });
      logger.info("POST /booking/confirm - Booking created", {
        bookingId: booking.id,
      });

      await confirmSlotPermanently(trx, timeSlotId);
      logger.info("POST /booking/confirm - Slot confirmed", { timeSlotId });

      return {
        booking,
        client,
        form,
      };
    });

    logger.info("POST /booking/confirm - Booking confirmed successfully", {
      bookingId: result.booking.id,
    });

    return NextResponse.json(
      { message: "Réservation confirmée", data: result },
      { status: 201 },
    );
  });
}
