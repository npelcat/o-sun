import db from "@/src/db/index";
import { bookings, clients, timeSlots, formData } from "@/src/db/schema";
import { eq, and, gte, lte, lt, desc } from "drizzle-orm";
import { BookingWithDetails } from "@/app/api/types/booking";
import { DateTime } from "luxon";
import { AdminBusinessError } from "@/utils/withErrorHandler";
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
    .select(bookingSelectFields)
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
    .select(bookingSelectFields)
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
 * → Supprime aussi le formData associé (cascade SQL)
 * → Conserve le client (indépendant de ses réservations)
 * → Libère le créneau horaire
 */
export async function deleteBookingAdmin(bookingId: string) {
  return await db.transaction(async (trx) => {
    const [booking] = await trx
      .select({ timeSlotId: bookings.timeSlotId })
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1);

    if (!booking) throw new AdminBusinessError("Réservation non trouvée");

    // La cascade supprime automatiquement le formData lié
    const [deleted] = await trx
      .delete(bookings)
      .where(eq(bookings.id, bookingId))
      .returning();

    // Le créneau doit être réactivé manuellement
    await trx
      .update(timeSlots)
      .set({ isActive: true, lockedAt: null, updatedAt: new Date() })
      .where(eq(timeSlots.id, booking.timeSlotId));

    return deleted;
  });
}

/**
 * Crée manuellement une réservation (admin)
 * Utile si ma cliente veut ajouter une réservation externe au système
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
