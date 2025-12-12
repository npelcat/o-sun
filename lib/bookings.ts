import { bookings, timeSlots, formData, clients } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";
import { BookingWithDetails } from "@/app/api/types/booking";

export async function getAllBookings(): Promise<BookingWithDetails[]> {
  try {
    const { default: db } = await import("@/src/db/index");
    const reservations = await db
      .select({
        id: bookings.id,
        status: bookings.status,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,

        timeSlotId: timeSlots.id,
        startTime: timeSlots.startTime,
        endTime: timeSlots.endTime,
        isTimeSlotActive: timeSlots.isActive,

        clientId: clients.id,
        clientName: clients.name,
        clientEmail: clients.email,
        clientPhone: clients.phone,

        formId: formData.id,
        animalName: formData.animalName,
        animalType: formData.animalType,
        service: formData.service,
        answers: formData.answers,
        formCreatedAt: formData.createdAt,
      })
      .from(bookings)
      .innerJoin(timeSlots, eq(bookings.timeSlotId, timeSlots.id))
      .innerJoin(clients, eq(bookings.clientId, clients.id))
      .innerJoin(formData, eq(bookings.formId, formData.id))
      .orderBy(desc(bookings.createdAt));

    return reservations;
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error);
    throw new Error("Impossible de récupérer les réservations");
  }
}
