import { NextRequest, NextResponse } from "next/server";
import db from "@/src/db/index";
import { timeSlots } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { timeSlotId } = await req.json();

    if (!timeSlotId) {
      return NextResponse.json(
        { error: "ID du créneau manquant" },
        { status: 400 }
      );
    }

    await db
      .update(timeSlots)
      .set({ isActive: true })
      .where(eq(timeSlots.id, timeSlotId))
      .execute();

    return NextResponse.json({ message: "Créneau libéré avec succès" });
  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
