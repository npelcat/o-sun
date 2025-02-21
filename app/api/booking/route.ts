import { NextResponse, NextRequest } from "next/server";
import db from "@/src/db/index";
import { bookings, formData } from "@/src/db/schema";

export async function GET() {
  try {
    const reservations = await db.select().from(bookings);
    return NextResponse.json({ reservations });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des réservations" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { timeSlotId, name, email, content } = body;

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
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la réservation" },
      { status: 500 }
    );
  }
}
