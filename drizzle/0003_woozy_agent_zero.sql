ALTER TABLE "booking"."form_data" ALTER COLUMN "animal_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "booking"."form_data" ADD COLUMN "animal_info" text;--> statement-breakpoint
ALTER TABLE "booking"."form_data" ADD COLUMN "household_info" text;--> statement-breakpoint
ALTER TABLE "booking"."form_data" ADD COLUMN "service_specific_answers" text;--> statement-breakpoint
ALTER TABLE "booking"."form_data" ADD COLUMN "preferred_pronoun" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "booking"."form_data" ADD COLUMN "social_media_consent" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "booking"."form_data" ADD COLUMN "monthly_planning_ack" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "booking"."form_data" ADD COLUMN "cgv_accepted" boolean DEFAULT false NOT NULL;