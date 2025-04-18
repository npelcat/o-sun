import db from "@/src/db/index";
import { timeSlots } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function getSlotById(id: string) {
  const [slot] = await db.select().from(timeSlots).where(eq(timeSlots.id, id));
  if (!slot) throw new Error("Créneau non trouvé");
  return slot;
}
