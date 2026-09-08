import db from "@/src/db/index";
import { bookings, clients, timeSlots, formData } from "@/src/db/schema";
import { eq, and, gte, lte, lt, desc, ilike } from "drizzle-orm";
import { BookingWithDetails } from "@/app/api/types/booking";
import { DateTime } from "luxon";
import { AdminBusinessError, HttpError } from "@/utils/withErrorHandler";
import {
  BOOKING_PERIOD,
  BookingPeriod,
  BookingStatus,
} from "../utils/constants";
import { bookingSelectFields } from "../../src/db/queries";

// ============================================
// TYPES
// ============================================

export interface UpdateBookingAdminData {
  status?: BookingStatus;
  adminNotes?: string | null;
}

export interface CreateBookingAdminData {
  timeSlotId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
  animalName: string;
  animalType: string;
  service: string;
  answers?: string | null;
  status?: BookingStatus;
  adminNotes?: string | null;
  animalInfo?: string | null;
  householdInfo?: string | null;
  serviceSpecificAnswers?: string | null;
  preferredPronoun?: string | null;
  socialMediaConsent?: boolean;
}

export interface BookingFilters {
  status?: BookingStatus;
  month?: string; // Format: "YYYY-MM"
  clientEmail?: string;
  period?: BookingPeriod;
}

// ============================================
// SERVICE FUNCTIONS
// ============================================

/**
 * Fetches all bookings with optional filters
 * Admin version: includes every booking, even canceled ones
 */
export async function getAllBookingsAdmin(
  filters?: BookingFilters,
): Promise<BookingWithDetails[]> {
  let query = db
    .select(bookingSelectFields)
    .from(bookings)
    .innerJoin(timeSlots, eq(bookings.timeSlotId, timeSlots.id))
    .innerJoin(clients, eq(bookings.clientId, clients.id))
    .innerJoin(formData, eq(bookings.formId, formData.id));

  const conditions = [];

  if (filters?.status) {
    conditions.push(eq(bookings.status, filters.status));
  }

  if (filters?.period === BOOKING_PERIOD.UPCOMING) {
    const now = new Date();
    conditions.push(gte(timeSlots.startTime, now));
  } else if (filters?.period === BOOKING_PERIOD.PAST) {
    const now = new Date();
    conditions.push(lt(timeSlots.startTime, now));
  }

  if (filters?.month) {
    const monthDT = DateTime.fromFormat(filters.month, "yyyy-MM", {
      zone: "Europe/Paris",
    });
    const startOfMonth = monthDT.startOf("month").toJSDate();
    const endOfMonth = monthDT.endOf("month").toJSDate();

    conditions.push(gte(timeSlots.startTime, startOfMonth));
    conditions.push(lte(timeSlots.startTime, endOfMonth));
  }

  if (filters?.clientEmail) {
    conditions.push(ilike(clients.email, `%${filters.clientEmail}%`));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }

  const reservations = await query.orderBy(desc(bookings.createdAt)).execute();

  return reservations as BookingWithDetails[];
}

/**
 * Fetches a booking by ID (admin version, includes adminNotes)
 */
export async function getBookingByIdAdmin(
  bookingId: string,
): Promise<BookingWithDetails> {
  const [booking] = await db
    .select(bookingSelectFields)
    .from(bookings)
    .innerJoin(timeSlots, eq(bookings.timeSlotId, timeSlots.id))
    .innerJoin(clients, eq(bookings.clientId, clients.id))
    .innerJoin(formData, eq(bookings.formId, formData.id))
    .where(eq(bookings.id, bookingId))
    .limit(1);

  if (!booking) {
    throw new HttpError(404, "Réservation non trouvée");
  }

  return booking as BookingWithDetails;
}

/**
 * Updates a booking's status and/or admin notes
 */
export async function updateBookingAdmin(
  bookingId: string,
  data: UpdateBookingAdminData,
) {
  const { status, adminNotes } = data;

  const updateData: Partial<typeof bookings.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (status !== undefined) {
    updateData.status = status;
  }

  if (adminNotes !== undefined) {
    updateData.adminNotes = adminNotes;
  }

  const [updated] = await db
    .update(bookings)
    .set(updateData)
    .where(eq(bookings.id, bookingId))
    .returning();

  if (!updated) {
    throw new HttpError(404, "Réservation non trouvée");
  }

  return updated;
}

/**
 * Deletes a booking
 * → Also deletes the linked formData (SQL cascade)
 * → Keeps the client (not tied to its bookings)
 * → Releases the time slot
 */
export async function deleteBookingAdmin(bookingId: string) {
  return await db.transaction(async (trx) => {
    const [booking] = await trx
      .select({ timeSlotId: bookings.timeSlotId })
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (!booking) throw new HttpError(404, "Réservation non trouvée");

    const [deleted] = await trx
      .delete(bookings)
      .where(eq(bookings.id, bookingId))
      .returning();

    await trx
      .update(timeSlots)
      .set({ isActive: true, lockedAt: null, updatedAt: new Date() })
      .where(eq(timeSlots.id, booking.timeSlotId));

    return deleted;
  });
}

/**
 * Manually creates a booking (admin)
 * Useful when the practitioner wants to add a booking made outside the system
 */
export async function createBookingAdmin(data: CreateBookingAdminData) {
  return await db.transaction(async (trx) => {
    // 1. Check the slot exists and is available
    const [slot] = await trx
      .select()
      .from(timeSlots)
      .where(eq(timeSlots.id, data.timeSlotId))
      .limit(1);

    if (!slot) {
      throw new HttpError(404, "Créneau non trouvé");
    }

    if (!slot.isActive) {
      throw new AdminBusinessError("Ce créneau n'est pas disponible");
    }

    // 2. Create or reuse the client
    let clientId: string;
    const existingClient = await trx
      .select()
      .from(clients)
      .where(eq(clients.email, data.clientEmail.toLowerCase()))
      .limit(1);

    if (existingClient.length > 0) {
      clientId = existingClient[0].id;
      await trx
        .update(clients)
        .set({
          name: data.clientName,
          phone: data.clientPhone || existingClient[0].phone,
          updatedAt: new Date(),
        })
        .where(eq(clients.id, clientId));
    } else {
      const [newClient] = await trx
        .insert(clients)
        .values({
          name: data.clientName,
          email: data.clientEmail.toLowerCase(),
          phone: data.clientPhone || null,
        })
        .returning();
      clientId = newClient.id;
    }

    // 3. Create the form
    const [form] = await trx
      .insert(formData)
      .values({
        animalName: data.animalName,
        animalType: data.animalType,
        service: data.service,
        answers: data.answers ?? null,
        animalInfo: data.animalInfo ?? null,
        householdInfo: data.householdInfo ?? null,
        serviceSpecificAnswers: data.serviceSpecificAnswers ?? null,
        preferredPronoun: data.preferredPronoun ?? "non renseigné",
        socialMediaConsent: data.socialMediaConsent ?? false,
        monthlyPlanningAck: true,
        cgvAccepted: true,
      })
      .returning();

    // 4. Create the booking
    const [booking] = await trx
      .insert(bookings)
      .values({
        timeSlotId: data.timeSlotId,
        clientId,
        formId: form.id,
        status: data.status || "confirmed",
        adminNotes: data.adminNotes || null,
      })
      .returning();

    // 5. Deactivate the slot
    await trx
      .update(timeSlots)
      .set({
        isActive: false,
        lockedAt: null,
        updatedAt: new Date(),
      })
      .where(eq(timeSlots.id, data.timeSlotId));

    return { booking, client: { id: clientId }, form };
  });
}

/**
 * Counts bookings by status (dashboard stats)
 */
export async function countBookingsByStatus() {
  const allBookings = await db
    .select({ status: bookings.status })
    .from(bookings);

  return {
    total: allBookings.length,
    pending: allBookings.filter((b) => b.status === "pending").length,
    confirmed: allBookings.filter((b) => b.status === "confirmed").length,
    canceled: allBookings.filter((b) => b.status === "canceled").length,
  };
}
