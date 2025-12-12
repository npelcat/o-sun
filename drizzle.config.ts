import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// Uncomment for migrations to testing and production :
// import { config } from "dotenv";

// to point to the testing DB
// config({ path: ".env.test" });

// to point to the prod DB
// config({ path: ".env.production" });

export default defineConfig({
  // folder in which Drizzle will place the generated migrations
  out: "./drizzle",

  // path to your schema definitions file
  schema: "./src/db/schema.ts",

  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },

  // SCHEMA FILTERING to only touch the booking schema
  schemaFilter: ["booking"],
});
