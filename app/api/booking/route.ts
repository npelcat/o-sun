import { NextResponse, NextRequest } from "next/server";
import db from "@/src/db/index";
import { bookings, formData } from "@/src/db/schema";
import { withErrorHandler, HttpError } from "@/utils/withErrorHandler";

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
