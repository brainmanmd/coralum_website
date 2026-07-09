CREATE TABLE "clinicians" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"specialty" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "medication_recommendations" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"drug_name" varchar(255) NOT NULL,
	"drug_sub" varchar(255),
	"current_dose_label" varchar(100) NOT NULL,
	"current_freq" varchar(50) NOT NULL,
	"current_levodopa_mg" numeric NOT NULL,
	"current_times_per_day" integer NOT NULL,
	"recommended_carbidopa_mg" numeric NOT NULL,
	"recommended_levodopa_mg" numeric NOT NULL,
	"recommended_freq" varchar(50) NOT NULL,
	"urgency" varchar(30) NOT NULL,
	"confidence" varchar(30) NOT NULL,
	"drawer_label" varchar(255),
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"decided_at" timestamp,
	"decided_by_clinician_id" integer,
	"decision_note" text,
	"deferred_until" date,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"id" serial PRIMARY KEY NOT NULL,
	"mrn" varchar(50) NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"date_of_birth" date NOT NULL,
	"sex" varchar(20) NOT NULL,
	"diagnosis" varchar(255) NOT NULL,
	"diagnosis_sub" varchar(255),
	"problems" text[] DEFAULT '{}' NOT NULL,
	"last_visit_date" date,
	"wearable_status" varchar(255),
	"pharmacy_name" varchar(255),
	"pharmacy_address" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recommendation_reasons" (
	"id" serial PRIMARY KEY NOT NULL,
	"recommendation_id" integer NOT NULL,
	"icon" varchar(30) NOT NULL,
	"chip_color" varchar(20) NOT NULL,
	"body" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transcript_highlights" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"body" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transcript_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"sender_name" varchar(255) NOT NULL,
	"is_patient" boolean NOT NULL,
	"sent_at" timestamp NOT NULL,
	"body" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "medication_recommendations" ADD CONSTRAINT "medication_recommendations_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medication_recommendations" ADD CONSTRAINT "medication_recommendations_decided_by_clinician_id_clinicians_id_fk" FOREIGN KEY ("decided_by_clinician_id") REFERENCES "public"."clinicians"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendation_reasons" ADD CONSTRAINT "recommendation_reasons_recommendation_id_medication_recommendations_id_fk" FOREIGN KEY ("recommendation_id") REFERENCES "public"."medication_recommendations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transcript_highlights" ADD CONSTRAINT "transcript_highlights_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transcript_messages" ADD CONSTRAINT "transcript_messages_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_clinicians_email" ON "clinicians" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_patients_mrn" ON "patients" USING btree ("mrn");