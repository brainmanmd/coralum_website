import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  numeric,
  date,
  timestamp,
  uniqueIndex,
  boolean,
} from 'drizzle-orm/pg-core';

export const waitlistSignups = pgTable(
  'waitlist_signups',
  {
    id: serial('id').primaryKey(),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    dateOfBirth: date('date_of_birth').notNull(),
    zipCode: varchar('zip_code', { length: 20 }).notNull(),
    insuranceProvider: varchar('insurance_provider', { length: 255 }),
    contactConsent: boolean('contact_consent').notNull(),
    betaConsent: boolean('beta_consent').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex('idx_waitlist_signups_email').on(table.email),
  })
);

export const clinicians = pgTable(
  'clinicians',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    specialty: varchar('specialty', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex('idx_clinicians_email').on(table.email),
  })
);

export const patients = pgTable(
  'patients',
  {
    id: serial('id').primaryKey(),
    mrn: varchar('mrn', { length: 50 }).notNull(),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    dateOfBirth: date('date_of_birth').notNull(),
    sex: varchar('sex', { length: 20 }).notNull(),
    diagnosis: varchar('diagnosis', { length: 255 }).notNull(),
    diagnosisSub: varchar('diagnosis_sub', { length: 255 }),
    problems: text('problems').array().notNull().default([]),
    lastVisitDate: date('last_visit_date'),
    wearableStatus: varchar('wearable_status', { length: 255 }),
    pharmacyName: varchar('pharmacy_name', { length: 255 }),
    pharmacyAddress: varchar('pharmacy_address', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    mrnIdx: uniqueIndex('idx_patients_mrn').on(table.mrn),
  })
);

export const medicationRecommendations = pgTable('medication_recommendations', {
  id: serial('id').primaryKey(),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patients.id),
  drugName: varchar('drug_name', { length: 255 }).notNull(),
  drugSub: varchar('drug_sub', { length: 255 }),
  currentDoseLabel: varchar('current_dose_label', { length: 100 }).notNull(),
  currentFreq: varchar('current_freq', { length: 50 }).notNull(),
  currentLevodopaMg: numeric('current_levodopa_mg', { mode: 'number' }).notNull(),
  currentTimesPerDay: integer('current_times_per_day').notNull(),
  recommendedCarbidopaMg: numeric('recommended_carbidopa_mg').notNull(),
  recommendedLevodopaMg: numeric('recommended_levodopa_mg').notNull(),
  recommendedFreq: varchar('recommended_freq', { length: 50 }).notNull(),
  urgency: varchar('urgency', { length: 30 }).notNull(),
  confidence: varchar('confidence', { length: 30 }).notNull(),
  drawerLabel: varchar('drawer_label', { length: 255 }),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  decidedAt: timestamp('decided_at'),
  decidedByClinicianId: integer('decided_by_clinician_id').references(() => clinicians.id),
  decisionNote: text('decision_note'),
  deferredUntil: date('deferred_until'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const recommendationReasons = pgTable('recommendation_reasons', {
  id: serial('id').primaryKey(),
  recommendationId: integer('recommendation_id')
    .notNull()
    .references(() => medicationRecommendations.id),
  icon: varchar('icon', { length: 30 }).notNull(),
  chipColor: varchar('chip_color', { length: 20 }).notNull(),
  body: text('body').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const transcriptMessages = pgTable('transcript_messages', {
  id: serial('id').primaryKey(),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patients.id),
  senderName: varchar('sender_name', { length: 255 }).notNull(),
  isPatient: boolean('is_patient').notNull(),
  sentAt: timestamp('sent_at').notNull(),
  body: text('body').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const transcriptHighlights = pgTable('transcript_highlights', {
  id: serial('id').primaryKey(),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patients.id),
  body: text('body').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
});
