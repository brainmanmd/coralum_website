import {
  pgTable,
  serial,
  varchar,
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
