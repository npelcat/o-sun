import { NextRequest, NextResponse } from "next/server";
import db from "@/src/db/index";
import { timeSlots } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { withErrorHandler } from "@/utils/withErrorHandler";
import logger from "@/utils/logger";

export async function POST(request: NextRequest) {
  return withErrorHandler(request, async () => {
    const { timeSlotId } = await request.json();
    if (!timeSlotId) {
      logger.error("POST /booking/cancel - timeSlotId manquant");
      return NextResponse.json(
        { message: "timeSlotId manquant" },
        { status: 400 }
      );
    }

    logger.info("POST /booking/cancel - Annulation de la réservation", {
      timeSlotId,
    });

    await db
      .update(timeSlots)
      .set({ isActive: true })
      .where(eq(timeSlots.id, timeSlotId))
      .execute();

    logger.info("POST /booking/cancel - Créneau remis à disposition", {
      timeSlotId,
    });

    return NextResponse.json({ message: "Créneau remis à disposition" });
  });
}
