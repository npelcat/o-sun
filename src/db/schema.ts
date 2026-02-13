import {
  pgSchema,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

export const bookingSchema = pgSchema("booking");

export const bookingStatusEnum = bookingSchema.enum("booking_status", [
  "pending",
  "confirmed",
  "canceled",
]);

// Table : Admin
export const admins = bookingSchema.table("admins", {
  id: uuid("admin_id").primaryKey().defaultRandom(),
  username: varchar("admin_name", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Table : Client
export const clients = bookingSchema.table("clients", {
  id: uuid("client_id").primaryKey().defaultRandom(),
  name: varchar("client_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }), // Optionnel
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Table : TimeSlot
export const timeSlots = bookingSchema.table("time_slots", {
  id: uuid("time_slot_id").primaryKey().defaultRandom(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  lockedAt: timestamp("locked_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Table : FormData
export const formData = bookingSchema.table("form_data", {
  id: uuid("form_id").primaryKey().defaultRandom(),
  animalName: varchar("animal_name", { length: 255 }).notNull(),
  animalType: varchar("animal_type", { length: 100 }),
  service: varchar("service", { length: 255 }).notNull(),
  answers: text("answers"), // JSON stringifié si besoin
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Table : Booking
export const bookings = bookingSchema.table("bookings", {
  id: uuid("booking_id").primaryKey().defaultRandom(),
  timeSlotId: uuid("time_slot_id")
    .notNull()
    .references(() => timeSlots.id, { onDelete: "restrict" }), // 🔒 Prevents cancellation of booking slots
  clientId: uuid("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }), // 🗑️ Cancel reservation if customer deleted
  formId: uuid("form_id")
    .notNull()
    .unique()
    .references(() => formData.id, { onDelete: "cascade" }), // 🗑️ Cancel reservation if form deleted
  status: bookingStatusEnum().notNull().default("pending"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Table : Password Reset Tokens
export const passwordResetTokens = bookingSchema.table(
  "password_reset_tokens",
  {
    id: uuid("token_id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    used: boolean("used").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
);
