import { NextResponse, NextRequest } from "next/server";
import db from "../../../src/db/index";
import { bookings, formData, timeSlots } from "../../../src/db/schema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { timeSlotId, formData: formDataInput } = body;

    const insertedFormData = await db
      .insert(formData)
      .values({
        name: formDataInput.name,
        email: formDataInput.email,
        content: formDataInput.content,
      })
      .returning();

    await db.insert(bookings).values({
      timeSlotId,
      status: "pending",
      formId: insertedFormData[0].id,
    });

    return NextResponse.json(
      { message: "Reservation created" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error creating reservation" },
      { status: 500 }
    );
  }
}
