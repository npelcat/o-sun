import { NextResponse, NextRequest } from "next/server";
import db from "@/src/db/index";
import { formData, bookings, timeSlots, clients } from "@/src/db/schema";
import { withErrorHandler, HttpError } from "@/utils/withErrorHandler";
import logger from "@/utils/logger";
import { eq } from "drizzle-orm";

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
    const {
      timeSlotId,
      clientName,
      clientEmail,
      clientPhone,
      animalName,
      animalType,
      service,
      answers,
    } = await req.json();

    if (!timeSlotId || !clientName || !clientEmail || !animalName || !service) {
      logger.error("POST /booking/confirm - Données manquantes");
      throw new HttpError(400, "Données manquantes ou invalides");
    }
    logger.info("POST /booking/confirm - Tentative de confirmation", {
      timeSlotId,
      clientEmail,
      animalName,
    });

    const result = await db.transaction(async (trx) => {
      // 1️⃣ get the slot
      const rows = await trx
        .select()
        .from(timeSlots)
        .where(eq(timeSlots.id, timeSlotId))
        .limit(1)
        .execute();

      if (!rows.length) {
        logger.error("POST /booking/confirm - Créneau introuvable", {
          timeSlotId,
        });
        throw new HttpError(404, "Créneau introuvable");
      }

      const slot = rows[0];

      // 2️⃣ check isActive
      if (!slot.isActive) {
        logger.error(
          "POST /booking/confirm - Créneau déjà confirmé ou annulé",
          {
            timeSlotId,
          }
        );
        throw new HttpError(409, "Créneau déjà confirmé ou annulé");
      }

      // 3️⃣ check lockedAt
      if (!slot.lockedAt) {
        logger.error(
          "POST /booking/confirm - Créneau non verrouillé provisoirement",
          { timeSlotId }
        );
        throw new HttpError(409, "Créneau non réservé précédemment");
      }

      // 4️⃣ check lock expiration (15 min max)
      const now = Date.now();
      const lockedTime = new Date(slot.lockedAt).getTime();
      const elapsed = now - lockedTime;
      if (elapsed > 15 * 60 * 1000) {
        logger.error("POST /booking/confirm - Verrou expiré", { timeSlotId });
        throw new HttpError(
          410,
          "Le temps de réservation a expiré, merci de re-sélectionner un créneau"
        );
      }

      // 5️⃣ Create or update client
      let client = await trx
        .select()
        .from(clients)
        .where(eq(clients.email, clientEmail))
        .limit(1);

      if (client.length === 0) {
        const [newClient] = await trx
          .insert(clients)
          .values({
            name: clientName,
            email: clientEmail,
            phone: clientPhone || null,
          })
          .returning();

        client = [newClient];
        logger.info("POST /booking/confirm - Nouveau client créé", {
          clientId: newClient.id,
        });
      } else {
        const [updatedClient] = await trx
          .update(clients)
          .set({
            name: clientName,
            phone: clientPhone || client[0].phone,
            updatedAt: new Date(),
          })
          .where(eq(clients.id, client[0].id))
          .returning();

        client = [updatedClient];
        logger.info("POST /booking/confirm - Client mis à jour", {
          clientId: updatedClient.id,
        });
      }

      // 6️⃣ Create FormData
      const [insertedForm] = await trx
        .insert(formData)
        .values({
          animalName,
          animalType: animalType || null,
          service,
          answers:
            typeof answers === "string" ? answers : JSON.stringify(answers),
        })
        .returning();

      logger.info("POST /booking/confirm - FormData créé", {
        formId: insertedForm.id,
      });

      // 7️⃣ Create the booking
      const [insertedBooking] = await trx
        .insert(bookings)
        .values({
          timeSlotId,
          clientId: client[0].id,
          formId: insertedForm.id,
          status: "pending",
        })
        .returning();

      logger.info("POST /booking/confirm - Booking créé", {
        bookingId: insertedBooking.id,
      });

      // 8️⃣ definitely mark the slot as reserved
      await trx
        .update(timeSlots)
        .set({
          isActive: false,
          lockedAt: null,
          updatedAt: new Date(),
        })
        .where(eq(timeSlots.id, timeSlotId))
        .execute();
      logger.info("POST /booking/confirm - Créneau confirmé", { timeSlotId });

      return {
        booking: insertedBooking,
        client: client[0],
        form: insertedForm,
      };
    });

    return NextResponse.json(
      { message: "Réservation confirmée", data: result },
      { status: 201 }
    );
  });
}
