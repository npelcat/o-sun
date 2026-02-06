import db from "@/src/db/index";
import { timeSlots } from "@/src/db/schema";
import { AdminBusinessError } from "@/utils/withErrorHandler";
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
// FONCTIONS DE SERVICE
// ============================================

/**
 * Récupère tous les créneaux avec filtres optionnels
 * Utilisé par l'admin pour voir tous ses créneaux (même les inactifs)
 */
export async function getAllTimeslotsAdmin(filters?: TimeslotFilters) {
  let query = db.select().from(timeSlots);

  const conditions = [];

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

  // Filtre par plage de dates
  if (filters?.startDate) {
    conditions.push(gte(timeSlots.startTime, new Date(filters.startDate)));
  }
  if (filters?.endDate) {
    conditions.push(lte(timeSlots.startTime, new Date(filters.endDate)));
  }

  // Filtre par statut actif/inactif
  if (filters?.isActive !== undefined) {
    conditions.push(eq(timeSlots.isActive, filters.isActive));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }

  const slots = await query.orderBy(desc(timeSlots.startTime)).execute();
  return slots;
}

/**
 * Récupère un créneau par son ID
 */
export async function getTimeslotById(id: string) {
  const [slot] = await db
    .select()
    .from(timeSlots)
    .where(eq(timeSlots.id, id))
    .limit(1)
    .execute();

  if (!slot) {
    throw new AdminBusinessError("Créneau non trouvé");
  }

  return slot;
}

/**
 * Crée un nouveau créneau horaire
 * Utilisé par l'admin pour ajouter des disponibilités
 */
export async function createTimeslot(data: CreateTimeslotData) {
  const { startTime, endTime } = data;

  // Vérification : pas de chevauchement avec un créneau existant actif
  const overlapping = await db
    .select()
    .from(timeSlots)
    .where(
      and(
        eq(timeSlots.isActive, true),
        // Chevauchement si :
        // nouveau start < existing end ET nouveau end > existing start
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
 * Met à jour un créneau existant
 * L'admin peut modifier les dates ou désactiver le créneau
 */
export async function updateTimeslot(id: string, data: UpdateTimeslotData) {
  const { startTime, endTime, isActive } = data;

  // Vérifier que le créneau existe
  const existingSlot = await getTimeslotById(id);

  // Vérifier le chevauchement si on modifie les dates
  if (startTime || endTime) {
    // Utiliser les nouvelles valeurs si fournies, sinon garder les anciennes
    const newStart = startTime ? new Date(startTime) : existingSlot.startTime;
    const newEnd = endTime ? new Date(endTime) : existingSlot.endTime;

    // Vérifier qu'il n'y a pas de chevauchement avec un autre créneau actif
    const overlapping = await db
      .select()
      .from(timeSlots)
      .where(
        and(
          eq(timeSlots.isActive, true),
          // Exclure le créneau qu'on est en train de modifier
          not(eq(timeSlots.id, id)),
          // Chevauchement si :
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
    throw new AdminBusinessError("Erreur lors de la mise à jour du créneau");
  }

  return updated;
}

/**
 * Supprime un créneau
 * ATTENTION : Vérifier qu'aucune réservation n'est liée avant de supprimer
 */
export async function deleteTimeslot(id: string) {
  // Note : La vérification des réservations liées sera faite dans la route
  // pour renvoyer une erreur plus explicite à l'utilisateur

  const [deleted] = await db
    .delete(timeSlots)
    .where(eq(timeSlots.id, id))
    .returning();

  if (!deleted) {
    throw new AdminBusinessError("Créneau non trouvé");
  }

  return deleted;
}

/**
 * Compte le nombre de créneaux disponibles pour un mois donné
 * Utile pour afficher des stats dans le dashboard admin
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
