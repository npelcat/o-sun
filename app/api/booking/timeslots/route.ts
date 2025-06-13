import { NextResponse, NextRequest } from "next/server";
import db from "@/src/db/index";
import { withErrorHandler } from "@/utils/withErrorHandler";
import logger from "@/utils/logger";
import { timeSlots } from "@/src/db/schema";
import { and, eq, isNull, lt, or } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return withErrorHandler(req, async () => {
    logger.info(
      "GET /booking/timeslots - Récupération des créneaux disponibles"
    );

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    // Select active slots whose lock does not exist or has expired
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

    logger.info(
      `GET /booking/timeslots - ${availableSlots.length} créneaux disponibles récupérés`
    );

    return NextResponse.json({ slots: availableSlots });
  });
}
