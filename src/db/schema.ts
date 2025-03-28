import {
  pgSchema,
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";

// New schema different from "public" to avoid conflicts with the tables used in the Strapi backend
export const bookingSchema = pgSchema("booking");

export const users = bookingSchema.table("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 50 }).notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const timeSlots = bookingSchema.table("time_slots", {
  id: uuid("id").primaryKey().defaultRandom(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const formData = bookingSchema.table("form_data", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "canceled",
]);

export const bookings = bookingSchema.table("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  timeSlotId: uuid("time_slot_id")
    .notNull()
    .references(() => timeSlots.id, { onDelete: "cascade" }),
  status: bookingStatusEnum().notNull(),
  formId: uuid("form_id")
    .notNull()
    .references(() => formData.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});
