CREATE SCHEMA "booking";
--> statement-breakpoint
CREATE TYPE "booking"."booking_status" AS ENUM('pending', 'confirmed', 'canceled');--> statement-breakpoint
CREATE TABLE "booking"."admins" (
	"admin_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admins_admin_name_unique" UNIQUE("admin_name"),
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "booking"."bookings" (
	"booking_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"time_slot_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"form_id" uuid NOT NULL,
	"status" "booking"."booking_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bookings_form_id_unique" UNIQUE("form_id")
);
--> statement-breakpoint
CREATE TABLE "booking"."clients" (
	"client_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clients_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "booking"."form_data" (
	"form_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"animal_name" varchar(255) NOT NULL,
	"animal_type" varchar(100),
	"service" varchar(255) NOT NULL,
	"answers" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "booking"."time_slots" (
	"time_slot_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"locked_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "booking"."bookings" ADD CONSTRAINT "bookings_time_slot_id_time_slots_time_slot_id_fk" FOREIGN KEY ("time_slot_id") REFERENCES "booking"."time_slots"("time_slot_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking"."bookings" ADD CONSTRAINT "bookings_client_id_clients_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "booking"."clients"("client_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "booking"."bookings" ADD CONSTRAINT "bookings_form_id_form_data_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "booking"."form_data"("form_id") ON DELETE cascade ON UPDATE no action;