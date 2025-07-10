import "dotenv/config";
import { defineConfig } from "drizzle-kit";

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
