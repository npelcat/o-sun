import { NextResponse, NextRequest } from "next/server";
import db from "@/src/db/index";
import { withErrorHandler } from "@/utils/withErrorHandler";
import logger from "@/utils/logger";
import { timeSlots } from "@/src/db/schema";

export async function GET(req: NextRequest) {
  return withErrorHandler(req, async () => {
    logger.info(
      "GET /booking/timeslots - Récupération des créneaux disponibles"
    );

    const slots = await db.select().from(timeSlots).execute();

    const availableSlots = slots.filter((slot) => slot.isActive === true);
    logger.info(
      `GET /booking/timeslots - ${availableSlots.length} créneaux disponibles récupérés`
    );
    return NextResponse.json({ slots: availableSlots });
  });
}
