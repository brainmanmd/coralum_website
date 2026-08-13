ALTER TABLE "waitlist_signups" DROP COLUMN "full_name";--> statement-breakpoint
ALTER TABLE "waitlist_signups" ADD COLUMN "joining_as" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "waitlist_signups" ADD COLUMN "patient_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "waitlist_signups" ADD COLUMN "caregiver_name" varchar(255);--> statement-breakpoint
ALTER TABLE "waitlist_signups" ADD COLUMN "parkinsons_duration" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "waitlist_signups" ADD COLUMN "uses_wearable" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "waitlist_signups" ADD COLUMN "wearable_device" varchar(255);
