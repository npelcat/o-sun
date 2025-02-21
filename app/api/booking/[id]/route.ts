// app/api/reservations/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import db from "@/src/db/index";
import { bookings } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const reservation = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id));
    if (!reservation.length) {
      return NextResponse.json(
        { error: "Réservation introuvable" },
        { status: 404 }
      );
    }
    return NextResponse.json({ reservation: reservation[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la réservation" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { timeSlotId, status } = body;

    const updatedReservation = await db
      .update(bookings)
      .set({ timeSlotId, status })
      .where(eq(bookings.id, id))
      .returning();

    if (!updatedReservation.length) {
      return NextResponse.json(
        { error: "Réservation introuvable ou non mise à jour" },
        { status: 404 }
      );
    }
    return NextResponse.json({ reservation: updatedReservation[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la réservation" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const deletedReservation = await db
      .delete(bookings)
      .where(eq(bookings.id, id))
      .returning();

    if (!deletedReservation.length) {
      return NextResponse.json(
        { error: "Réservation introuvable ou non supprimée" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Réservation supprimée" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la réservation" },
      { status: 500 }
    );
  }
}
