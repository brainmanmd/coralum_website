# GCP Cloud SQL Waitlist Database Plan

This note captures the current direction for the waitlist persistence layer: move the waitlist storage from the previous hosted Postgres flow to a managed Postgres database in Google Cloud Platform.

## Goal

Keep the existing Drizzle schema and waitlist API behavior intact while switching the backing database to a GCP Cloud SQL Postgres instance.

## Implementation Notes

- The waitlist route continues to use the same Drizzle schema and insert/select flow.
- The runtime expects `POSTGRES_URL` and `POSTGRES_URL_NON_POOLING` to be configured for the target database.
- The deployment environment should provide a GCP Cloud SQL connection string or a Cloud SQL proxy-compatible socket configuration.
- Migrations should be applied with the same Drizzle tooling already configured in the repo.

## Checklist

- [ ] Provision a GCP Cloud SQL for PostgreSQL instance.
- [ ] Configure the application environment variables for the new database.
- [ ] Apply the existing Drizzle migrations to the GCP database.
- [ ] Verify the waitlist form persists new signups and dedupes by email.
