import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { clients } from "@/src/db/schema";
import { lt } from "drizzle-orm";
import { NextResponse } from "next/server";

// This route is called automatically once a month by GitHub Actions.
// It deletes clients whose data hasn't been updated in over 2 years,
// per the privacy policy. Deleting a client cascades to their bookings
// and form data (cascade defined in the schema).

// Dedicated connection using the postgres role (full rights), separate
// from the app's booking_app connection, which is intentionally
// restricted for frontend security.
const cronClient = postgres(process.env.CRON_DATABASE_URL!, { prepare: false });
const cronDb = drizzle(cronClient);

export async function GET(request: Request) {
  // Verify the secret token to confirm the request comes from GitHub
  // Actions and not an arbitrary visitor.
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  try {
    const deleted = await cronDb
      .delete(clients)
      .where(lt(clients.updatedAt, twoYearsAgo))
      .returning({ id: clients.id });

    // Return the deleted count so the GitHub Actions log can confirm
    // the run went as expected.
    return NextResponse.json({
      success: true,
      deletedCount: deleted.length,
    });
  } catch (err) {
    console.error("[CRON cleanup] Deletion failed:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
