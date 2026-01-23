import db, { DbTransaction } from "@/src/db/index";
import { timeSlots } from "@/src/db/schema";
import { HttpError } from "@/utils/withErrorHandler";
import { eq, and, or, isNull, lt } from "drizzle-orm";

export async function getSlotById(id: string) {
  const [slot] = await db
    .select()
    .from(timeSlots)
    .where(eq(timeSlots.id, id))
    .execute();
  if (!slot) throw new Error("Créneau non trouvé");
  return slot;
}

export async function getAvailableSlots() {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  const availableSlots = await db
    .select()
    .from(timeSlots)
    .where(
      and(
        eq(timeSlots.isActive, true),
        or(
          isNull(timeSlots.lockedAt),
          lt(timeSlots.lockedAt, fifteenMinutesAgo)
        )
      )
    )
    .execute();

  return availableSlots;
}

export async function lockSlot(timeSlotId: string) {
  await db
    .update(timeSlots)
    .set({ lockedAt: new Date() })
    .where(eq(timeSlots.id, timeSlotId))
    .execute();
}

export async function releaseSlot(timeSlotId: string) {
  await db
    .update(timeSlots)
    .set({ isActive: true, lockedAt: null })
    .where(eq(timeSlots.id, timeSlotId))
    .execute();
}

export async function confirmSlot(timeSlotId: string) {
  await db
    .update(timeSlots)
    .set({
      isActive: false,
      lockedAt: null,
      updatedAt: new Date(),
    })
    .where(eq(timeSlots.id, timeSlotId))
    .execute();
}

export async function reserveSlot(timeSlotId: string): Promise<void> {
  const FIFTEEN_MINUTES_AGO = new Date(Date.now() - 15 * 60 * 1000);

  await db.transaction(async (trx) => {
    const [slot] = await trx
      .select()
      .from(timeSlots)
      .where(
        and(
          eq(timeSlots.id, timeSlotId),
          eq(timeSlots.isActive, true),
          or(
            isNull(timeSlots.lockedAt),
            lt(timeSlots.lockedAt, FIFTEEN_MINUTES_AGO)
          )
        )
      )
      .limit(1)
      .for("update")
      .execute();

    if (!slot) {
      throw new Error("Créneau indisponible ou déjà réservé");
    }

    await trx
      .update(timeSlots)
      .set({ lockedAt: new Date() })
      .where(eq(timeSlots.id, timeSlotId))
      .execute();
  });
}

/**
 * Vérifie qu'un slot est valide pour la confirmation
 * - Existe
 * - Est actif
 * - Est verrouillé
 * - Le verrou n'a pas expiré (< 15 min)
 */
export async function validateSlotForConfirmation(
  trx: DbTransaction,
  timeSlotId: string
) {
  const rows = await trx
    .select()
    .from(timeSlots)
    .where(eq(timeSlots.id, timeSlotId))
    .limit(1)
    .execute();

  if (!rows.length) {
    throw new HttpError(404, "Créneau introuvable");
  }

  const slot = rows[0];

  // Vérifier que le slot est actif
  if (!slot.isActive) {
    throw new HttpError(409, "Créneau déjà confirmé ou annulé");
  }

  // Vérifier que le slot est verrouillé
  if (!slot.lockedAt) {
    throw new HttpError(409, "Créneau non réservé précédemment");
  }

  // Vérifier l'expiration du verrou (15 min max)
  const now = Date.now();
  const lockedTime = new Date(slot.lockedAt).getTime();
  const elapsed = now - lockedTime;

  if (elapsed > 15 * 60 * 1000) {
    throw new HttpError(
      410,
      "Le temps de réservation a expiré, merci de re-sélectionner un créneau"
    );
  }

  return slot;
}

export async function confirmSlotPermanently(
  trx: DbTransaction,
  timeSlotId: string
) {
  await trx
    .update(timeSlots)
    .set({
      isActive: false,
      lockedAt: null,
      updatedAt: new Date(),
    })
    .where(eq(timeSlots.id, timeSlotId))
    .execute();
}
