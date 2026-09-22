ALTER TABLE "waitlist_signups" ALTER COLUMN "joining_as" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "waitlist_signups" ALTER COLUMN "patient_name" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "waitlist_signups" ALTER COLUMN "date_of_birth" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "waitlist_signups" ALTER COLUMN "zip_code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "waitlist_signups" ALTER COLUMN "parkinsons_duration" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "waitlist_signups" ALTER COLUMN "uses_wearable" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "waitlist_signups" ALTER COLUMN "beta_consent" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "waitlist_signups" ADD COLUMN "full_name" varchar(255);--> statement-breakpoint
ALTER TABLE "waitlist_signups" ADD COLUMN "state" varchar(50);--> statement-breakpoint
ALTER TABLE "waitlist_signups" ADD COLUMN "testing_interest" boolean;