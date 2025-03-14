import { NextResponse, NextRequest } from "next/server";
import db from "@/src/db/index";
import { bookings, formData } from "@/src/db/schema";
import { withErrorHandler, HttpError } from "@/utils/withErrorHandler";
import { timeSlots } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  return withErrorHandler(req, async () => {
    const reservations = await db.select().from(bookings);
    return NextResponse.json({ reservations });
  });
}

export async function POST(req: NextRequest) {
  return withErrorHandler(req, async () => {
    const body = await req.json();
    const { timeSlotId, name, email, content } = body;

    if (!timeSlotId || !name || !email) {
      throw new HttpError(400, "Données manquantes ou invalides");
    }

    const timeSlot = await db
      .select()
      .from(timeSlots)
      .where(eq(timeSlots.id, timeSlotId))
      .limit(1)
      .execute();

    if (!timeSlot) {
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

    const insertedBooking = await db
      .insert(bookings)
      .values({
        timeSlotId,
        status: "pending",
        formId: formId,
      })
      .returning();

    return NextResponse.json({ booking: insertedBooking[0] }, { status: 201 });
  });
}
