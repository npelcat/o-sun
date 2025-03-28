import { NextResponse, NextRequest } from "next/server";
import db from "@/src/db/index";
import { formData, bookings, timeSlots } from "@/src/db/schema";
import { withErrorHandler, HttpError } from "@/utils/withErrorHandler";
import logger from "@/utils/logger";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  return withErrorHandler(req, async () => {
    const body = await req.json();
    const { timeSlotId, name, email, content } = body;

    logger.info("POST /booking/confirm - Tentative de confirmation", {
      timeSlotId,
      name,
      email,
    });

    if (!timeSlotId || !name || !email) {
      logger.error("POST /booking/confirm - Données manquantes ou invalides");
      throw new HttpError(400, "Données manquantes ou invalides");
    }

    await db.transaction(async (trx: any) => {
      const slot = await trx
        .select()
        .from(timeSlots)
        .where(eq(timeSlots.id, timeSlotId))
        .limit(1)
        .execute();

      if (!slot || slot.length === 0 || slot[0].isActive !== false) {
        logger.error(
          "POST /booking/confirm - Créneau non verrouillé ou indisponible",
          { timeSlotId }
        );
        throw new HttpError(404, "Créneau non verrouillé ou indisponible");
      }

      const insertedFormData = await trx
        .insert(formData)
        .values({ name, email, content })
        .returning();
      const formId = insertedFormData[0].id;
      logger.info("POST /booking/confirm - Form data inséré", { formId });

      const insertedBooking = await trx
        .insert(bookings)
        .values({
          timeSlotId,
          status: "pending",
          formId: formId,
        })
        .returning();
      logger.info("POST /booking/confirm - Réservation confirmée", {
        bookingId: insertedBooking[0].id,
      });
    });

    return NextResponse.json(
      { message: "Réservation confirmée" },
      { status: 201 }
    );
  });
}
