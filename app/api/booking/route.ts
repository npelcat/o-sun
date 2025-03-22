import { NextResponse, NextRequest } from "next/server";
import db from "@/src/db/index";
import { bookings, formData } from "@/src/db/schema";
import { withErrorHandler, HttpError } from "@/utils/withErrorHandler";
import { timeSlots } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import logger from "@/utils/logger";

export async function GET(req: NextRequest) {
  return withErrorHandler(req, async () => {
    logger.info("GET /booking - Retrieving all reservations");
    const reservations = await db.select().from(bookings);
    logger.info(`GET /booking - Retrieved ${reservations.length} reservations`);
    return NextResponse.json({ reservations });
  });
}

export async function POST(req: NextRequest) {
  return withErrorHandler(req, async () => {
    const body = await req.json();
    const { timeSlotId, name, email, content } = body;

    logger.info("POST /booking - Attempting to create a reservation", {
      timeSlotId,
      name,
      email,
    });

    if (!timeSlotId || !name || !email) {
      logger.error("POST /booking - Missing or invalid data");
      throw new HttpError(400, "Données manquantes ou invalides");
    }

    const timeSlot = await db
      .select()
      .from(timeSlots)
      .where(eq(timeSlots.id, timeSlotId))
      .limit(1)
      .execute();

    if (!timeSlot) {
      logger.error(`POST /booking - Time slot ${timeSlotId} unavailable`);
      throw new HttpError(
        404,
        "Ce créneau horaire est malheureusement indisponible"
      );
    }

    const insertedFormData = await db
      .insert(formData)
      .values({
        name,
        email,
        content,
      })
      .returning();

    const formId = insertedFormData[0].id;
    logger.info("POST /booking - Form data inserted", { formId });

    const insertedBooking = await db
      .insert(bookings)
      .values({
        timeSlotId,
        status: "pending",
        formId: formId,
      })
      .returning();

    logger.info("POST /booking - Reservation created", {
      bookingId: insertedBooking[0].id,
    });
    return NextResponse.json({ booking: insertedBooking[0] }, { status: 201 });
  });
}
