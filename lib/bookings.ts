import { bookings, timeSlots, formData, clients } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";
import { BookingWithDetails } from "@/app/api/types/booking";
import db, { DbTransaction } from "@/src/db/index";

export interface CreateBookingData {
  timeSlotId: string;
  clientId: string;
  formId: string;
  status?: "pending" | "confirmed" | "canceled";
}

export async function createBooking(
  trx: DbTransaction,
  data: CreateBookingData
) {
  const { timeSlotId, clientId, formId, status = "pending" } = data;

  const [insertedBooking] = await trx
    .insert(bookings)
    .values({
      timeSlotId,
      clientId,
      formId,
      status,
    })
    .returning();

  return insertedBooking;
}

export async function getAllBookings(): Promise<BookingWithDetails[]> {
  const reservations = await db
    .select({
      id: bookings.id,
      status: bookings.status,
      createdAt: bookings.createdAt,
      updatedAt: bookings.updatedAt,
      adminNotes: bookings.adminNotes,
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
}

export async function getBookingById(
  bookingId: string
): Promise<BookingWithDetails> {
  const [booking] = await db
    .select({
      id: bookings.id,
      status: bookings.status,
      createdAt: bookings.createdAt,
      updatedAt: bookings.updatedAt,
      adminNotes: bookings.adminNotes,
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
    .where(eq(bookings.id, bookingId))
    .limit(1);

  if (!booking) {
    throw new Error("Réservation non trouvée");
  }

  return booking;
}

export async function getBookingByIdSimple(bookingId: string) {
  const [booking] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .limit(1);

  if (!booking) {
    throw new Error("Réservation non trouvée");
  }

  return booking;
}

export async function updateBookingStatus(
  bookingId: string,
  status: "pending" | "confirmed" | "canceled"
) {
  const [updated] = await db
    .update(bookings)
    .set({ status, updatedAt: new Date() })
    .where(eq(bookings.id, bookingId))
    .returning();

  if (!updated) {
    throw new Error("Réservation non trouvée");
  }

  return updated;
}

export async function deleteBooking(bookingId: string) {
  const [deleted] = await db
    .delete(bookings)
    .where(eq(bookings.id, bookingId))
    .returning();

  if (!deleted) {
    throw new Error("Réservation non trouvée");
  }

  return deleted;
}
