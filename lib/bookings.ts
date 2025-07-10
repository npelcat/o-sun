import db from "@/src/db/index";
import { bookings, timeSlots, formData } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";
import { BookingWithDetails } from "@/app/api/types/booking";

export async function getAllBookings(): Promise<BookingWithDetails[]> {
  try {
    const reservations = await db
      .select({
        id: bookings.id,
        status: bookings.status,
        createdAt: bookings.createdAt,

        timeSlotId: timeSlots.id,
        startTime: timeSlots.startTime,
        endTime: timeSlots.endTime,
        isTimeSlotActive: timeSlots.isActive,

        formId: formData.id,
        clientName: formData.name,
        clientEmail: formData.email,
        clientContent: formData.content,
        formCreatedAt: formData.createdAt,
      })
      .from(bookings)
      .innerJoin(timeSlots, eq(bookings.timeSlotId, timeSlots.id))
      .innerJoin(formData, eq(bookings.formId, formData.id))
      .orderBy(desc(bookings.createdAt));

    return reservations;
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error);
    throw new Error("Impossible de récupérer les réservations");
  }
}
