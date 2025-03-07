import { NextResponse, NextRequest } from "next/server";
import db from "@/src/db/index";
import { bookings } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { withErrorHandler, HttpError } from "@/utils/withErrorHandler";
import logger from "@/utils/logger";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandler(req, async () => {
    const { id } = params;
    logger.info(`GET /booking/${id} - Retrieving reservation`);
    const reservation = await db
      .select()
      .from(bookings)
      .where(eq(bookings.id, id));
    if (!reservation.length) {
      logger.error(`Reservation not found for id: ${id}`);
      throw new HttpError(404, "Réservation introuvable");
    }
    logger.info(`Reservation found for id: ${id}`);
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

    logger.info(`PUT /booking/${id} - Updating reservation`, {
      timeSlotId,
      status,
    });

    if (!timeSlotId || !status) {
      logger.error(`PUT /booking/${id} - Missing or invalid data`);
      throw new HttpError(400, "Données manquantes ou invalides");
    }

    const updatedReservation = await db
      .update(bookings)
      .set({ timeSlotId, status })
      .where(eq(bookings.id, id))
      .returning();

    if (!updatedReservation.length) {
      logger.error(`PUT /booking/${id} - Reservation not found or not updated`);
      throw new HttpError(404, "Réservation introuvable ou non mise à jour");
    }
    logger.info(`PUT /booking/${id} - Reservation successfully updated`);
    return NextResponse.json({ reservation: updatedReservation[0] });
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withErrorHandler(req, async () => {
    const { id } = params;
    logger.info(`DELETE /booking/${id} - Deleting reservation`);
    const deletedReservation = await db
      .delete(bookings)
      .where(eq(bookings.id, id))
      .returning();

    if (!deletedReservation.length) {
      logger.error(
        `DELETE /booking/${id} - Reservation not found or not deleted`
      );
      throw new HttpError(404, "Réservation introuvable ou non supprimée");
    }
    logger.info(`DELETE /booking/${id} - Reservation successfully deleted`);
    return NextResponse.json({ message: "Réservation supprimée" });
  });
}
