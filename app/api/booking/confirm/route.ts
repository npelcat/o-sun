import { NextResponse, NextRequest } from "next/server";
import db from "@/src/db/index";
import { formData, bookings, timeSlots } from "@/src/db/schema";
import { withErrorHandler, HttpError } from "@/utils/withErrorHandler";
import logger from "@/utils/logger";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  return withErrorHandler(req, async () => {
    const { timeSlotId, name, email, content } = await req.json();

    if (!timeSlotId || !name || !email) {
      logger.error("POST /booking/confirm - Données manquantes");
      throw new HttpError(400, "Données manquantes ou invalides");
    }
    logger.info("POST /booking/confirm - Tentative de confirmation", {
      timeSlotId,
      name,
      email,
    });

    await db.transaction(async (trx) => {
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

      // 5️⃣ definitely mark the slot as reserved
      await trx
        .update(timeSlots)
        .set({
          isActive: false,
          lockedAt: null,
        })
        .where(eq(timeSlots.id, timeSlotId))
        .execute();
      logger.info("POST /booking/confirm - Créneau confirmé", { timeSlotId });

      // 6️⃣  create the linked form
      const [insertedForm] = await trx
        .insert(formData)
        .values({ name, email, content })
        .returning();
      logger.info("POST /booking/confirm - Form data inséré", {
        formId: insertedForm.id,
      });

      // 7️⃣ create booking
      const [insertedBooking] = await trx
        .insert(bookings)
        .values({
          timeSlotId,
          status: "pending",
          formId: insertedForm.id,
        })
        .returning();
      logger.info("POST /booking/confirm - Réservation créé", {
        bookingId: insertedBooking.id,
      });
    });

    return NextResponse.json(
      { message: "Réservation confirmée" },
      { status: 201 }
    );
  });
}
