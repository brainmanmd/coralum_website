ALTER TABLE "waitlist_signups" ADD COLUMN "full_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "waitlist_signups" ADD COLUMN "state" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "waitlist_signups" ADD COLUMN "testing_interest" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "waitlist_signups" DROP COLUMN "joining_as";--> statement-breakpoint
ALTER TABLE "waitlist_signups" DROP COLUMN "patient_name";--> statement-breakpoint
ALTER TABLE "waitlist_signups" DROP COLUMN "caregiver_name";--> statement-breakpoint
ALTER TABLE "waitlist_signups" DROP COLUMN "date_of_birth";--> statement-breakpoint
ALTER TABLE "waitlist_signups" DROP COLUMN "zip_code";--> statement-breakpoint
ALTER TABLE "waitlist_signups" DROP COLUMN "insurance_provider";--> statement-breakpoint
ALTER TABLE "waitlist_signups" DROP COLUMN "parkinsons_duration";--> statement-breakpoint
ALTER TABLE "waitlist_signups" DROP COLUMN "uses_wearable";--> statement-breakpoint
ALTER TABLE "waitlist_signups" DROP COLUMN "wearable_device";--> statement-breakpoint
ALTER TABLE "waitlist_signups" DROP COLUMN "beta_consent";