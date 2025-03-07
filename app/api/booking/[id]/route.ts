import { NextResponse, NextRequest } from "next/server";
import db from "@/src/db/index";
import { bookings } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { withErrorHandler, HttpError } from "@/utils/withErrorHandler";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandler(req, async () => {
    const { id } = params;
    const reservation = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id));
    if (!reservation.length) {
      throw new HttpError(404, "Réservation introuvable");
    }
    return NextResponse.json({ reservation: reservation[0] });
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandler(req, async () => {
    const { id } = params;
    const body = await req.json();
    const { timeSlotId, status } = body;

    if (!timeSlotId || !status) {
      throw new HttpError(400, "Données manquantes ou invalides");
    }

    const updatedReservation = await db
      .update(bookings)
      .set({ timeSlotId, status })
      .where(eq(bookings.id, id))
      .returning();

    if (!updatedReservation.length) {
      throw new HttpError(404, "Réservation introuvable ou non mise à jour");
    }
    return NextResponse.json({ reservation: updatedReservation[0] });
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandler(req, async () => {
    const { id } = params;
    const deletedReservation = await db
      .delete(bookings)
      .where(eq(bookings.id, id))
      .returning();

    if (!deletedReservation.length) {
      throw new HttpError(404, "Réservation introuvable ou non supprimée");
    }
    return NextResponse.json({ message: "Réservation supprimée" });
  });
}
