# Supabase-Backed Waitlist Database Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/waitlist` actually persist signups by connecting the existing `waitlist_signups` Drizzle schema to a real Supabase Postgres database, provisioned through Vercel's native Supabase Marketplace integration, so responses are durably stored and viewable by the team.

**Architecture:** The codebase already has a complete Drizzle schema (`waitlist_signups` table) and a generated migration (`drizzle/0000_nebulous_microchip.sql`) — it was just never pointed at a live database. Vercel's Supabase integration injects `POSTGRES_URL` / `POSTGRES_URL_NON_POOLING` env vars (same names this codebase already expects, no renaming needed). The one required code change: swap the Postgres driver from `@vercel/postgres` to `postgres` (postgres.js), because `@vercel/postgres` has a hardcoded Neon-pooler hostname check that is confirmed incompatible with Supabase's pooler ([vercel/storage#797](https://github.com/vercel/storage/issues/797)). `postgres` + `drizzle-orm/postgres-js` is Supabase's own documented Drizzle setup.

**Tech Stack:** Next.js 16 (App Router) on Vercel, Drizzle ORM, `postgres` (postgres.js), Supabase Postgres via Vercel Marketplace integration, Vitest.

---

## Prerequisites (manual — you do these in the Vercel/Supabase dashboards; not automatable from a coding session)

### Prereq 1: Connect Supabase to the Vercel project

1. Open the [Vercel dashboard](https://vercel.com/dashboard) → select the `coralum_prod` project → **Storage** tab → **Connect Database** → choose **Supabase** from the marketplace.
2. Follow the flow to create a new Supabase project. Pick a region close to wherever this Vercel project is deployed, to minimize query latency.
3. Confirm the connection. Vercel will automatically inject these env vars into every environment (Production/Preview/Development) of the Vercel project: `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Prereq 2: Pull the env vars down for local development

From the project root:

```bash
npx vercel link        # only if this checkout isn't linked to the Vercel project yet
npx vercel env pull .env.local
```

`.env.local` is already gitignored. Open it and confirm it contains a `POSTGRES_URL_NON_POOLING` line whose host ends in `.supabase.com` — that confirms the integration is wired up correctly before writing any code.

**Do not proceed to Task 1 until Prereq 1 and 2 are done** — Task 3's migration step needs a live `POSTGRES_URL_NON_POOLING`, and Task 4's integration test needs a live `POSTGRES_URL`.

---

## Task 1: Swap the Postgres driver from @vercel/postgres to postgres.js

**Files:**
- Modify: `package.json`
- Modify: `src/lib/db/client.ts`

- [ ] **Step 1: Install postgres.js, remove @vercel/postgres**

```bash
npm install postgres
npm uninstall @vercel/postgres
```

- [ ] **Step 2: Rewrite the db client**

Replace the full contents of `src/lib/db/client.ts`:

```typescript
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

import * as schema from './schema';

// `prepare: false` is required for Supabase's transaction-mode pooler
// (port 6543 / PgBouncer), which does not support prepared statements.
const client = postgres(process.env.POSTGRES_URL!, { prepare: false });
export const db = drizzle(client, { schema });
```

- [ ] **Step 3: Confirm the app still typechecks**

```bash
npx tsc --noEmit
```

Expected: no output, no errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/lib/db/client.ts
git commit -m "fix: swap @vercel/postgres for postgres.js for Supabase pooler compatibility"
```

---

## Task 2: Verify drizzle-kit is configured for the direct (non-pooled) connection

**Why:** Schema migrations (`CREATE TABLE`, etc.) must run over a direct/session connection, not a transaction-mode pooler — transaction-mode poolers can silently break multi-statement DDL. `drizzle.config.ts` already does this correctly; this task is a verification checkpoint, not a code change.

**Files:**
- Read only: `drizzle.config.ts`

- [ ] **Step 1: Open `drizzle.config.ts` and confirm this exact line is present:**

```typescript
url: process.env.POSTGRES_URL_NON_POOLING ?? (() => { throw new Error('POSTGRES_URL_NON_POOLING is not set'); })(),
```

If it's not there (e.g. someone changed it since this plan was written), restore it before continuing.

---

## Task 3: Apply the existing migration to the new Supabase database

**Files:** none changed — applies the migration already committed at `drizzle/0000_nebulous_microchip.sql`.

- [ ] **Step 1: Run the migration**

```bash
npx drizzle-kit migrate
```

Expected output ends with something like:

```
[✓] migrations applied successfully!
```

This creates four tables in the new Supabase database: `users`, `sessions`, `onboarding_choice`, `waitlist_signups`.

- [ ] **Step 2: Verify in the Supabase dashboard**

Open the Supabase project → **Table Editor** → confirm `waitlist_signups` exists with these columns: `id, full_name, email, date_of_birth, zip_code, insurance_provider, contact_consent, beta_consent, created_at`. This Table Editor is also where the team will read waitlist responses going forward — no admin UI is being built in this plan.

---

## Task 4: Add an integration test that proves a real signup round-trips through the database

**Files:**
- Modify: `vitest.config.ts`
- Create: `src/app/api/waitlist/route.integration.test.ts`

- [ ] **Step 1: Exclude integration tests from the default unit-test run**

Replace the full contents of `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    exclude: ["**/node_modules/**", "**/*.integration.test.ts"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
```

This keeps `npx vitest run` (the existing fast unit suite, used in this session and presumably any future CI) from failing for anyone who doesn't have `POSTGRES_URL` set. The integration test below is run explicitly by file path instead.

- [ ] **Step 2: Write the integration test**

Create `src/app/api/waitlist/route.integration.test.ts`:

```typescript
import { describe, it, expect, afterAll } from 'vitest';
import { eq } from 'drizzle-orm';
import { POST } from './route';
import { db } from '@/lib/db/client';
import { waitlistSignups } from '@/lib/db/schema';

const TEST_EMAIL = 'integration-test@coralum.care';

describe('POST /api/waitlist (integration, requires live POSTGRES_URL)', () => {
  afterAll(async () => {
    await db.delete(waitlistSignups).where(eq(waitlistSignups.email, TEST_EMAIL));
  });

  it('persists a signup row to the database', async () => {
    const request = new Request('http://localhost/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: 'Integration Test',
        email: TEST_EMAIL,
        date_of_birth: '1990-01-01',
        zip_code: '94301',
        contact_consent: true,
        beta_consent: false,
      }),
    });

    const response = await POST(request as never);
    expect(response.status).toBe(200);

    const rows = await db
      .select()
      .from(waitlistSignups)
      .where(eq(waitlistSignups.email, TEST_EMAIL));

    expect(rows).toHaveLength(1);
    expect(rows[0].fullName).toBe('Integration Test');
    expect(rows[0].contactConsent).toBe(true);
  });
});
```

- [ ] **Step 3: Run the unit suite and confirm the integration test is skipped**

```bash
npx vitest run
```

Expected: same 6 test files / 37 tests as before — `route.integration.test.ts` does not appear in the run.

- [ ] **Step 4: Run the integration test explicitly (requires `.env.local` from Prereq 2)**

```bash
npx vitest run src/app/api/waitlist/route.integration.test.ts --no-config 2>/dev/null || \
  npx dotenv -e .env.local -- npx vitest run src/app/api/waitlist/route.integration.test.ts
```

Expected: `PASS`, 1 test, 1 file. If it fails with a missing-env-var error, re-check Prereq 2 — `.env.local` needs to actually be loaded into the process; the second command form loads it explicitly via `dotenv-cli` (`npm install -D dotenv-cli` if not already present).

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts src/app/api/waitlist/route.integration.test.ts
git commit -m "test: add integration test proving waitlist signups persist to Supabase"
```

---

## Task 5: Update `.env.example` to describe the Supabase-via-Vercel setup accurately

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Replace the Postgres section**

Find this block in `.env.example`:

```
# PostgreSQL (Vercel Postgres)
# Get from: vercel env pull (after linking to Vercel)
POSTGRES_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."
```

Replace it with:

```
# PostgreSQL (Supabase, connected via Vercel's Supabase Marketplace integration)
# Setup: Vercel dashboard -> Storage -> Connect Database -> Supabase
# Then locally: npx vercel link && npx vercel env pull .env.local
POSTGRES_URL="postgresql://...pooler.supabase.com:6543/postgres"
POSTGRES_URL_NON_POOLING="postgresql://...supabase.com:5432/postgres"
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: update .env.example for Supabase-via-Vercel database setup"
```

---

## Task 6: End-to-end verification in the browser preview

**Files:** none changed — this is a manual verification pass using the already-built `/waitlist` UI.

- [ ] **Step 1: Start the dev server with the real env vars loaded**

Confirm `.env.local` (from Prereq 2) is present, then start the dev server normally (it auto-loads `.env.local`).

- [ ] **Step 2: Submit the waitlist form**

Go to `/waitlist`, fill out the form with a throwaway email, check "I consent to be contacted...", and submit.

Expected: the success screen ("You're on the list!") renders — meaning the API call returned 200, which means the insert succeeded.

- [ ] **Step 3: Confirm the row landed in Supabase**

Open the Supabase **Table Editor** → `waitlist_signups` → confirm the new row is there with the submitted data.

- [ ] **Step 4: Submit the same email a second time**

Expected: success screen again (the route's existing dedupe-by-email logic returns `{ success: true }` without inserting a duplicate row) — confirm in the Table Editor that only one row exists for that email.

---

## Self-Review Notes

- **Spec coverage:** "make the waitlist functional with a database that stores responses, using Vercel's Supabase connector" → Task 1–3 wire up the real connection and apply the schema; Task 4 proves it works with an automated test; Task 6 proves it works end-to-end through the actual UI; "for us to access" → Supabase's built-in Table Editor (Task 3 Step 2) satisfies this without building a separate admin page.
- **Out of scope, by earlier explicit decision in this project:** the `users`/`sessions`/`onboarding_choice` tables and the signup/onboarding wearable-flow pages are untouched — they'll start working against the same Supabase database as a side effect of this plan (same connection string), but no behavior there was changed or tested here.
- **Not addressed here, flagged from the prior session:** the in-memory rate limiter in `src/proxy.ts` is still per-instance, not globally durable — that was explicitly deferred earlier and isn't part of this plan.
