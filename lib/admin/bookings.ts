import db from "@/src/db/index";
import { bookings, clients, timeSlots, formData } from "@/src/db/schema";
import { eq, and, gte, lte, lt, desc } from "drizzle-orm";
import { BookingWithDetails } from "@/app/api/types/booking";
import { DateTime } from "luxon";
import { AdminBusinessError } from "@/utils/withErrorHandler";
import { BOOKING_PERIOD, BookingPeriod, BookingStatus } from "../constants";

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
  animalType?: string | null;
  service: string;
  answers?: string | null;
  status?: BookingStatus;
  adminNotes?: string | null;
}

export interface BookingFilters {
  status?: BookingStatus;
  month?: string; // Format: "YYYY-MM"
  clientEmail?: string;
  period?: BookingPeriod;
}

// ============================================
// FONCTIONS DE SERVICE
// ============================================

/**
 * Récupère toutes les réservations avec filtres optionnels
 * Version admin : inclut TOUTES les réservations (même annulées)
 */
export async function getAllBookingsAdmin(
  filters?: BookingFilters,
): Promise<BookingWithDetails[]> {
  let query = db
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
    .innerJoin(formData, eq(bookings.formId, formData.id));

  const conditions = [];

  // Filtre par statut
  if (filters?.status) {
    conditions.push(eq(bookings.status, filters.status));
  }

  // Filtre par période
  if (filters?.period === BOOKING_PERIOD.UPCOMING) {
    const now = new Date();
    conditions.push(gte(timeSlots.startTime, now));
  } else if (filters?.period === BOOKING_PERIOD.PAST) {
    const now = new Date();
    conditions.push(lt(timeSlots.startTime, now));
  }

  // Filtre par mois
  if (filters?.month) {
    const monthDT = DateTime.fromFormat(filters.month, "yyyy-MM", {
      zone: "Europe/Paris",
    });
    const startOfMonth = monthDT.startOf("month").toJSDate();
    const endOfMonth = monthDT.endOf("month").toJSDate();

    conditions.push(gte(timeSlots.startTime, startOfMonth));
    conditions.push(lte(timeSlots.startTime, endOfMonth));
  }

  // Filtre par email client
  if (filters?.clientEmail) {
    conditions.push(eq(clients.email, filters.clientEmail.toLowerCase()));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }

  const reservations = await query.orderBy(desc(bookings.createdAt)).execute();

  return reservations as BookingWithDetails[];
}

/**
 * Récupère une réservation par ID (version admin avec adminNotes)
 */
export async function getBookingByIdAdmin(
  bookingId: string,
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
    throw new AdminBusinessError("Réservation non trouvée");
  }

  return booking as BookingWithDetails;
}

/**
 * Met à jour une réservation (statut et/ou notes admin)
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
    throw new AdminBusinessError("Réservation non trouvée");
  }

  return updated;
}

/**
 * Supprime une réservation
 * Note : Cela ne supprime PAS le client ni le formData (conservation historique)
 * mais libère le créneau horaire
 */
export async function deleteBookingAdmin(bookingId: string) {
  return await db.transaction(async (trx) => {
    // 1. Récupérer la réservation pour obtenir le timeSlotId
    const [booking] = await trx
      .select({ timeSlotId: bookings.timeSlotId })
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (!booking) {
      throw new AdminBusinessError("Réservation non trouvée");
    }

    // 2. Supprimer la réservation
    const [deleted] = await trx
      .delete(bookings)
      .where(eq(bookings.id, bookingId))
      .returning();

    // 3. Réactiver le créneau si nécessaire
    await trx
      .update(timeSlots)
      .set({
        isActive: true,
        lockedAt: null,
        updatedAt: new Date(),
      })
      .where(eq(timeSlots.id, booking.timeSlotId))
      .execute();

    return deleted;
  });
}

/**
 * Crée manuellement une réservation (admin)
 * Utile si ta cliente veut ajouter une réservation externe au système
 */
export async function createBookingAdmin(data: CreateBookingAdminData) {
  return await db.transaction(async (trx) => {
    // 1. Vérifier que le créneau existe et est disponible
    const [slot] = await trx
      .select()
      .from(timeSlots)
      .where(eq(timeSlots.id, data.timeSlotId))
      .limit(1);

    if (!slot) {
      throw new AdminBusinessError("Créneau non trouvé");
    }

    if (!slot.isActive) {
      throw new AdminBusinessError("Ce créneau n'est pas disponible");
    }

    // 2. Créer ou récupérer le client
    let clientId: string;
    const existingClient = await trx
      .select()
      .from(clients)
      .where(eq(clients.email, data.clientEmail.toLowerCase()))
      .limit(1);

    if (existingClient.length > 0) {
      clientId = existingClient[0].id;
      // Mettre à jour les infos si besoin
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

    // 3. Créer le formulaire
    const [form] = await trx
      .insert(formData)
      .values({
        animalName: data.animalName,
        animalType: data.animalType || null,
        service: data.service,
        answers: data.answers || null,
      })
      .returning();

    // 4. Créer la réservation
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

    // 5. Désactiver le créneau
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
 * Compte les réservations par statut (pour stats dashboard)
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
