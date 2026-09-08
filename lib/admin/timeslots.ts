import db from "@/src/db/index";
import { bookings, timeSlots } from "@/src/db/schema";
import { AdminBusinessError, HttpError } from "@/utils/withErrorHandler";
import { eq, and, gte, lte, desc, gt, lt, not } from "drizzle-orm";
import { DateTime } from "luxon";

// ============================================
// TYPES
// ============================================

export interface CreateTimeslotData {
  startTime: string; // ISO 8601 string
  endTime: string; // ISO 8601 string
}

export interface UpdateTimeslotData {
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}

export interface TimeslotFilters {
  month?: string; // Format: "YYYY-MM"
  isActive?: boolean;
  startDate?: string; // ISO 8601
  endDate?: string; // ISO 8601
}

// ============================================
// SERVICE FUNCTIONS
// ============================================

/**
 * Fetches all time slots with optional filters
 * Used by the admin to see every slot, including inactive ones
 */
export async function getAllTimeslotsAdmin(filters?: TimeslotFilters) {
  let query = db.select().from(timeSlots);

  const conditions = [];

  if (filters?.month) {
    const monthDT = DateTime.fromFormat(filters.month, "yyyy-MM", {
      zone: "Europe/Paris",
    });
    const startOfMonth = monthDT.startOf("month").toJSDate();
    const endOfMonth = monthDT.endOf("month").toJSDate();

    conditions.push(gte(timeSlots.startTime, startOfMonth));
    conditions.push(lte(timeSlots.startTime, endOfMonth));
  }

  if (filters?.startDate) {
    conditions.push(gte(timeSlots.startTime, new Date(filters.startDate)));
  }
  if (filters?.endDate) {
    conditions.push(lte(timeSlots.startTime, new Date(filters.endDate)));
  }

  if (filters?.isActive !== undefined) {
    conditions.push(eq(timeSlots.isActive, filters.isActive));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }

  const slots = await query.orderBy(desc(timeSlots.startTime)).execute();
  return slots;
}

export async function getTimeslotById(id: string) {
  const [slot] = await db
    .select()
    .from(timeSlots)
    .where(eq(timeSlots.id, id))
    .limit(1)
    .execute();

  if (!slot) {
    throw new HttpError(404, "Créneau non trouvé");
  }

  return slot;
}

/**
 * Creates a new time slot
 * Used by the admin to add availability
 */
export async function createTimeslot(data: CreateTimeslotData) {
  const { startTime, endTime } = data;

  // Guard: no overlap with an existing active slot
  const overlapping = await db
    .select()
    .from(timeSlots)
    .where(
      and(
        eq(timeSlots.isActive, true),
        // Overlap when: new start < existing end AND new end > existing start
        lt(timeSlots.startTime, new Date(endTime)),
        gt(timeSlots.endTime, new Date(startTime)),
      ),
    )
    .limit(1)
    .execute();

  if (overlapping.length > 0) {
    throw new AdminBusinessError(
      "Ce créneau chevauche un créneau existant. Veuillez choisir d'autres horaires.",
    );
  }

  const [newSlot] = await db
    .insert(timeSlots)
    .values({
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      isActive: true,
      lockedAt: null,
    })
    .returning();

  return newSlot;
}

/**
 * Updates an existing time slot
 * The admin can change the dates or deactivate the slot
 */
export async function updateTimeslot(id: string, data: UpdateTimeslotData) {
  const { startTime, endTime, isActive } = data;

  const existingSlot = await getTimeslotById(id);

  if (startTime || endTime) {
    // Fall back to the existing values for whichever date wasn't provided
    const newStart = startTime ? new Date(startTime) : existingSlot.startTime;
    const newEnd = endTime ? new Date(endTime) : existingSlot.endTime;

    const overlapping = await db
      .select()
      .from(timeSlots)
      .where(
        and(
          eq(timeSlots.isActive, true),
          // Exclude the slot currently being edited
          not(eq(timeSlots.id, id)),
          // Overlap when:
          lt(timeSlots.startTime, newEnd),
          gt(timeSlots.endTime, newStart),
        ),
      )
      .limit(1)
      .execute();

    if (overlapping.length > 0) {
      throw new AdminBusinessError(
        "Ces nouvelles dates chevauchent un créneau existant. Veuillez choisir d'autres horaires.",
      );
    }
  }

  const updateData: Partial<typeof timeSlots.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (startTime !== undefined) {
    updateData.startTime = new Date(startTime);
  }
  if (endTime !== undefined) {
    updateData.endTime = new Date(endTime);
  }
  if (isActive !== undefined) {
    updateData.isActive = isActive;
  }

  const [updated] = await db
    .update(timeSlots)
    .set(updateData)
    .where(eq(timeSlots.id, id))
    .returning();

  if (!updated) {
    throw new HttpError(404, "Créneau non trouvé");
  }

  return updated;
}

export async function deleteTimeslot(id: string) {
  const [deleted] = await db
    .delete(timeSlots)
    .where(eq(timeSlots.id, id))
    .returning();

  if (!deleted) {
    throw new HttpError(404, "Créneau non trouvé");
  }

  return deleted;
}

/**
 * Counts available slots for a given month
 * Used for the admin dashboard stats
 */
export async function countAvailableSlotsForMonth(month: string) {
  const monthDT = DateTime.fromFormat(month, "yyyy-MM", {
    zone: "Europe/Paris",
  });
  const startOfMonth = monthDT.startOf("month").toJSDate();
  const endOfMonth = monthDT.endOf("month").toJSDate();

  const slots = await db
    .select()
    .from(timeSlots)
    .where(
      and(
        eq(timeSlots.isActive, true),
        gte(timeSlots.startTime, startOfMonth),
        lte(timeSlots.startTime, endOfMonth),
      ),
    )
    .execute();

  return slots.length;
}

/**
 * Checks that no booking is linked to this slot
 * Throws a business error if one is found
 */
export async function checkNoLinkedBookings(timeslotId: string): Promise<void> {
  const linkedBookings = await db
    .select()
    .from(bookings)
    .where(eq(bookings.timeSlotId, timeslotId))
    .limit(1);

  if (linkedBookings.length > 0) {
    throw new AdminBusinessError(
      "Impossible de supprimer ce créneau : une réservation y est liée. Veuillez d'abord supprimer la réservation.",
    );
  }
}
