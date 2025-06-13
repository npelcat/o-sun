import { NextResponse, NextRequest } from "next/server";
import db from "@/src/db/index";
import { bookings } from "@/src/db/schema";
import { withErrorHandler } from "@/utils/withErrorHandler";
import logger from "@/utils/logger";

export async function GET(req: NextRequest) {
  return withErrorHandler(req, async () => {
    logger.info("GET /booking - Retrieving all reservations");
    const reservations = await db.select().from(bookings);
    logger.info(`GET /booking - Retrieved ${reservations.length} reservations`);
    return NextResponse.json({ reservations });
  });
}
