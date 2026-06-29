# Signup & Authentication Flow Design

**Date:** June 29, 2026  
**Project:** Coralum Care MVP  
**Scope:** User registration, password-based authentication, post-signup onboarding choice  

---

## Executive Summary

Implement a simple signup flow (Approach 1) that allows users to register with email, password, full name, and date of birth, then immediately redirects them to choose between self-service wearable onboarding or scheduling a phone call with support. Auto-login on signup, no email verification for MVP.

**Success criteria:**
- Users can sign up with 4 fields (email, password, name, DOB)
- Passwords are securely hashed with bcrypt
- Sessions are stored in httpOnly cookies
- Post-signup, users see a choice page (self-service onboarding OR schedule call via Calendly)
- All data persists in PostgreSQL

---

## Architecture & Tech Stack

### Database
- **Engine:** Vercel Postgres (serverless PostgreSQL with connection pooling included)
  - Alternative: Neon DB (serverless Postgres with generous free tier)
  - Why Vercel Postgres: Native Vercel integration, built-in connection pooling for serverless, managed backups
- **ORM:** Drizzle ORM (type-safe, minimal overhead, matches existing patterns, Vercel-friendly)
- **Driver:** `@vercel/postgres` (official Vercel driver with connection pooling) OR `postgres` with external PgBouncer
- **Connection pooling:** Handled by Vercel Postgres (no additional setup needed)

### Authentication
- **Password hashing:** bcryptjs (12 salt rounds)
- **Sessions:** httpOnly, Secure, SameSite=Strict cookies
- **Session storage:** `sessions` table in PostgreSQL

### Scheduling Integration
- **Service:** Calendly (free tier)
- **Integration:** Embedded Calendly link/widget on choice page
- **Calendly event tracking:** Optional field in `onboarding_choice` table for analytics

---

## Database Schema

### Table: `users`
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes for serverless query optimization
  CONSTRAINT email_unique UNIQUE (email)
);

CREATE INDEX idx_users_email ON users(email);
```

**Constraints:**
- Email must be unique (prevent duplicate signups)
- All fields required (no nulls except timestamps)
- Date of birth stored as DATE for birthday/age calculations later

**Indexes:**
- `email` — Signup duplicate check, login lookups
- **Why:** Serverless functions execute per-request; fast email lookups prevent N+1 queries

### Table: `sessions`
```sql
CREATE TABLE sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

**Rationale:** One active session per user (new login invalidates prior sessions). Expires at allows cleanup of stale sessions.

**Indexes:**
- `user_id` — Session lookups during request (every authenticated route)
- `expires_at` — Batch cleanup of expired sessions (cron job or lazy delete)
- **Why:** Every authenticated request queries by `user_id`; Vercel serverless requires fast reads

**Alternative (Vercel KV):** For ultra-low latency, store sessions in Vercel KV (Redis) instead of Postgres. Trade-off: KV has 30-day max TTL, costs more at scale, but avoids DB round-trip. MVP recommendation: Keep in Postgres for simplicity, upgrade to KV if session lookups become a bottleneck.

### Table: `onboarding_choice`
```sql
CREATE TABLE onboarding_choice (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  choice VARCHAR(50) NOT NULL CHECK (choice IN ('self_service', 'phone_call')),
  calendly_event_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_onboarding_choice_user_id ON onboarding_choice(user_id);
CREATE INDEX idx_onboarding_choice_choice ON onboarding_choice(choice);
```

**Rationale:** Track user's chosen onboarding path for analytics and support workflows. `calendly_event_id` stored for reference if they book a call (optional).

**Indexes:**
- `user_id` — Lookup user's choice after signup
- `choice` — Analytics queries (count self-service vs phone calls)
- **Why:** Serverless functions need predictable query performance; indexes guarantee sub-millisecond lookups

---

## Pages

### 1. `/signup` — Registration Form

**Type:** Client component (interactive form)

**Fields:**
- Email (text input, required, validated)
- Password (password input, required, min 8 chars, must include uppercase + number + special char)
- Confirm Password (password input, match validation)
- Full Name (text input, required, min 2 chars)
- Date of Birth (date input, required, must be 18+)

**Client-side validation:**
- Email format (basic regex or native HTML5)
- Password strength (length, uppercase, number, special char)
- Password confirmation match
- Age 18+ (calculated from DOB)
- Generic error messages (don't leak user existence)

**Submit action:**
- POST to `/api/auth/signup` with form data
- Show loading state on button
- On success: redirect to `/onboarding-choice` (via server redirect in response)
- On error: display error message (email exists, validation failed, server error)

**Styling:** Match existing Coralum Care design (emerald accent, rounded borders, Tailwind v4)

---

### 2. `/onboarding-choice` — Onboarding Method Selection

**Type:** Server component with client actions

**Checks:**
- User must be logged in (check session cookie)
- If not logged in: redirect to `/signup`

**Layout:**
- Heading: "How would you like to get started?"
- Two options (side-by-side on desktop, stacked on mobile):

  **Option A: Self-Service Onboarding**
  - Button: "Connect Wearables Myself"
  - Description: "Choose and connect your health devices now. Takes 5-10 minutes."
  - On click: → redirect to `/onboarding` (existing flow)

  **Option B: Phone Onboarding**
  - Button: "Schedule a Call with Our Team"
  - Description: "Let our team guide you through setup. Pick a time that works for you."
  - On click: Show Calendly embed (full width, inline) OR redirect to Calendly booking link
  - On successful Calendly booking: Store choice in DB, show confirmation message
  - Confirmation: "Great! We'll call you at the time you selected. In the meantime, you can explore your dashboard."

**Post-choice flow:**
- After self-service selection: immediately redirect to `/onboarding`
- After phone call booking: stay on page with confirmation, show "Continue to Dashboard" button (→ `/dashboard` or `/onboarding`)

---

## API Routes

### `POST /api/auth/signup`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "date_of_birth": "2000-01-15"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "redirect": "/onboarding-choice"
}
```
*Sets httpOnly session cookie in headers.*

**Response (Error - 400):**
```json
{
  "error": "Email already in use"
}
```
OR
```json
{
  "error": "Password must be at least 8 characters with uppercase, number, and special character"
}
```

**Implementation:**
1. Validate all required fields present (client + server-side)
2. Validate email format + password strength (server-side)
3. Check if email already exists → return 400 if yes (fast index lookup)
4. Validate date_of_birth (user is 18+)
5. Hash password with bcrypt (12 rounds, CPU-bound but still fast on Vercel)
6. Insert user into `users` table + create session in one transaction (or two atomic queries)
7. Set session cookie (httpOnly, Secure, SameSite=Strict, 30-day expiry)
8. Return success + redirect path

**Serverless optimizations:**
- Email check is indexed (fast)
- Bcrypt hashing happens in Node.js (not delegated, no extra latency)
- Both DB operations use connection pooling (no connection setup overhead)
- No N+1 queries; signup is 2 operations max
- Total latency target: <500ms (Vercel cold start ~100ms + bcrypt ~150ms + DB ~200ms)

**Rate limiting:** 5 requests per minute per IP (prevent brute force)

**Error codes:**
- `email_exists` — Email already registered
- `invalid_email` — Email format invalid
- `weak_password` — Password doesn't meet requirements
- `invalid_age` — User under 18
- `server_error` — Database error (log and return generic message)

---

### `POST /api/onboarding/choice` (Optional)

**Purpose:** Record user's onboarding choice in database for analytics/support tracking.

**Request:**
```json
{
  "choice": "self_service" | "phone_call",
  "calendly_event_id": "abc123xyz" // optional, only if user booked via Calendly
}
```

**Response (Success - 200):**
```json
{
  "success": true
}
```

**Implementation:**
1. Verify user is logged in (check session)
2. Validate `choice` is `self_service` or `phone_call`
3. Insert/update `onboarding_choice` record (one record per user)
4. If choice is `phone_call`, Calendly event ID is captured via URL param or form field (MVP: store manually or fetch from Calendly API later)
5. Return success

**Note:** For MVP, this route is optional—choice can be tracked client-side and called asynchronously. Priority is implementing the choice UI and redirects first.

---

## Security Considerations

### Password Security
- **Hashing:** bcryptjs with 12 salt rounds (strong, resistant to GPU brute force)
- **Storage:** Never store plaintext; hash only
- **Client validation:** Enforce strength rules in UI (password will be hashed server-side)
- **HTTPS only:** All auth endpoints require HTTPS in production

### Session Security
- **Cookie attributes:**
  - `httpOnly: true` — JavaScript cannot access (prevents XSS leakage)
  - `Secure: true` — HTTPS only (production)
  - `SameSite: Strict` — CSRF protection (no cross-site cookie sending)
  - `maxAge: 30 days` — Session expiry
- **Session invalidation:** New login creates new session; old sessions remain until expiry
- **One session per user:** Logout deletes current session; login replaces prior session (optional: store multiple sessions for mobile/web clients)

### Input Validation
- **Server-side:** All inputs validated before database insert (never trust client)
- **Email:** Checked for uniqueness + format
- **Password:** Min 8 chars, uppercase, digit, special char
- **Name:** Non-empty, reasonable length (prevent injection)
- **DOB:** Valid date, user 18+
- **Error messages:** Generic to prevent user enumeration ("Email already in use" is OK; "We couldn't find that user" is not, as it leaks user existence)

### Database Security
- **Connection:** Use connection pooling (Drizzle + postgres driver handle this)
- **Secrets:** Database URL in environment variables (`.env.local`, never committed)
- **SQL injection:** Parameterized queries (Drizzle ORM prevents this)

### Rate Limiting
- **Signup endpoint:** 5 requests per minute per IP
- **Implementation:** Simple in-memory store (good enough for single server MVP) or Redis-backed (for scaled deployments)
- **How:** Check request IP against rate limit table in memory, reject with 429 if exceeded
- **Prevents:** Brute force, account enumeration, spam signups

---

## Dependencies to Install

```json
{
  "bcryptjs": "^2.4.3",
  "drizzle-orm": "^0.30.0",
  "drizzle-kit": "^0.20.0",
  "@vercel/postgres": "^0.5.0"
}
```

**Dev dependencies:**
- `drizzle-kit` for migrations

**Why `@vercel/postgres` instead of `postgres`:**
- Built-in connection pooling (optimized for serverless)
- Automatic failover and backup handling
- Native Vercel deployment integration
- Edge Runtime compatible (Middleware support)
- No separate PgBouncer setup needed

---

## Environment Variables (Vercel-Specific)

**Vercel Postgres automatically provides:**
```bash
POSTGRES_URL="postgresql://user:password@host/dbname"
POSTGRES_URL_NON_POOLING="postgresql://user:password@host/dbname"  # For migrations
POSTGRES_HOST="host"
POSTGRES_PASSWORD="password"
POSTGRES_USER="user"
POSTGRES_DATABASE="dbname"
```

**Additional env vars to configure:**
```bash
# Calendly
CALENDLY_BOOKING_URL="https://calendly.com/yourteam/onboarding"

# Session expiry (optional, recommended)
SESSION_EXPIRY_DAYS="30"
```

**Local Development Setup:**
1. Create local PostgreSQL database OR use Vercel Postgres in development
2. Copy Vercel Postgres connection string to `.env.local` (or use local Postgres URL)
3. Run migrations: `drizzle-kit push:pg` (uses `POSTGRES_URL_NON_POOLING` for schema changes)
4. Add `CALENDLY_BOOKING_URL` to `.env.local`

**Vercel Deployment Setup:**
1. Link project to Vercel: `vercel link` (or via Vercel dashboard)
2. Create Vercel Postgres database: `vercel postgres create` (CLI) or dashboard UI
3. Vercel automatically sets `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING`, etc.
4. Add `CALENDLY_BOOKING_URL` in Vercel project settings → Environment Variables
5. Run migrations on deploy (add build script: `drizzle-kit push:pg`)

**Connection pooling:**
- Vercel Postgres handles pooling automatically
- Use `POSTGRES_URL` for API routes (pooled connection)
- Use `POSTGRES_URL_NON_POOLING` for migrations only (direct connection)

---

## File Structure (New Files)

```
src/
  app/
    signup/
      page.tsx              # Server component wrapping client form
      signup-form.tsx       # Client component (form + validation)
    onboarding-choice/
      page.tsx              # Server component (checks session, renders choice UI)
      choice-actions.tsx    # Client component (handle button clicks, Calendly embed)
    api/
      auth/
        signup/
          route.ts          # POST handler (validates, hashes, creates user + session)
      onboarding/
        choice/
          route.ts          # POST handler (stores choice)
  lib/
    db/
      client.ts             # Drizzle client setup (uses @vercel/postgres)
      schema.ts             # Drizzle schema definitions (users, sessions, onboarding_choice)
  middleware.ts             # Session validation + rate limiting (optional for MVP)

drizzle/
  migrations/               # Auto-generated by drizzle-kit push
  0001_initial.sql          # Create users, sessions, onboarding_choice tables + indexes

.env.local                  # Local dev: POSTGRES_URL, CALENDLY_BOOKING_URL
.env.example                # Template for required vars
drizzle.config.ts           # Drizzle configuration (points to @vercel/postgres)
```

**Drizzle setup file example:**
```typescript
// src/lib/db/client.ts
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';

export const db = drizzle(sql);
```

**Schema file structure:**
```typescript
// src/lib/db/schema.ts
import { serial, varchar, date, timestamp, pgTable, uniqueIndex } from 'drizzle-orm/pg-core';

export const users = pgTable('users', { ... }, (table) => ({
  emailIdx: uniqueIndex('idx_users_email').on(table.email),
}));
// ... sessions, onboarding_choice tables with indexes
```

---

## Vercel Deployment Best Practices

### Serverless Optimization

**Query Performance:**
- All queries must complete within serverless timeout (Vercel: 10-60s depending on plan)
- Indexes on `email`, `user_id`, `expires_at` ensure sub-5ms database lookups
- Never do N+1 queries; batch operations where possible
- Example: Fetch user + session in one query, not two

**Cold Start Mitigation:**
- Drizzle ORM is lightweight (minimal bundle size impact)
- `@vercel/postgres` has pre-warmed connections (no connection overhead)
- API route handlers are bundled separately (smaller cold starts)

**Connection Pooling:**
- Vercel Postgres provides managed pooling (no PgBouncer needed)
- Each serverless function gets a pooled connection from Vercel
- No persistent connections held (can't use transactions across requests)
- **Important:** Avoid long-running transactions; each request must be atomic

**Caching Strategy:**
- Use Vercel's `revalidateTag()` for ISR (Incremental Static Regeneration)
- Cache authenticated pages only after session validation
- Don't cache user-specific data (email, DOB) at edge

### Middleware & Edge Runtime

**Rate Limiting Middleware:**
- Implement in Next.js Middleware (runs at Vercel edge, not in serverless)
- Faster than checking in API route handler
- Use Vercel KV for distributed rate limit state (if needed for multiple regions)
- For MVP: Simple in-memory rate limiter in API handler is fine

**Session Middleware:**
- Validate session in Middleware before routing to protected pages
- Redirect unauthenticated users early (before server component renders)
- Reduces wasted computational cost

### Production Checklist

- ✅ Indexes created on all lookup columns (`email`, `user_id`, `expires_at`, `choice`)
- ✅ Using `@vercel/postgres` with connection pooling
- ✅ Migrations use `POSTGRES_URL_NON_POOLING` (non-pooled for DDL)
- ✅ API routes use `POSTGRES_URL` (pooled for queries)
- ✅ No N+1 queries in signup/choice flows
- ✅ Rate limiting on signup endpoint (Middleware or API handler)
- ✅ Session validation in Middleware (optional but recommended)
- ✅ All sensitive data in environment variables (never hardcoded)
- ✅ Passwords hashed with bcrypt before storage
- ✅ httpOnly session cookies only (no localStorage)
- ✅ HTTPS enforced (Vercel default)

---

## Testing

### Unit Tests
- Password hashing + validation (bcryptjs correctness)
- Age calculation from DOB (user 18+)
- Email format validation
- Password strength validation

### Integration Tests
- Signup flow: create user, verify password hash, verify session created
- Session validation: logged-in user can access `/onboarding-choice`
- Logged-out user redirected to `/signup`
- Duplicate email signup rejected

### Manual Testing
- Sign up with all fields, verify redirect to `/onboarding-choice`
- Sign up with weak password, verify error
- Sign up with duplicate email, verify error
- Sign up with age < 18, verify error
- Book Calendly call, verify choice stored in DB
- Choose self-service, verify redirect to `/onboarding`

---

## Calendly Integration Details

**Setup:**
1. Create free Calendly account
2. Create a "Onboarding Call" event (30 min, recurring weekly availability)
3. Set Calendly timezone to match patient timezone (or auto-detect in embed)
4. Generate Calendly embed/booking link

**Implementation (two options):**

**Option A: Embedded Calendly Widget**
```jsx
// In choice-actions.tsx
<CalendlyEmbed url="https://calendly.com/yourteam/onboarding" />
```
- Pros: Inline, seamless UX
- Cons: Requires Calendly embed script, may conflict with security headers

**Option B: Button linking to Calendly**
```jsx
<a href="https://calendly.com/yourteam/onboarding" target="_blank">
  Schedule a Call
</a>
```
- Pros: Simple, no script injection
- Cons: Opens new tab, user returns manually

**Recommendation for MVP:** Option B (simpler, safer). Upgrade to Option A later if needed.

**Tracking Calendly bookings:**
- After booking, user returns to your app manually (or you can ask Calendly to redirect)
- Optionally: User submits form on choice page with Calendly event ID (if captured in URL param)
- Store in `onboarding_choice.calendly_event_id` for reference

---

## Future Enhancements (Out of Scope)

1. **Email verification** — Send verification link, require confirmation before login
2. **Password reset flow** — `/forgot-password`, email link to reset
3. **Multiple sessions** — Allow user logged in on multiple devices simultaneously
4. **Social signup** — Add OAuth signup (Google, Apple) alongside password signup
5. **Two-factor authentication** — TOTP or SMS-based 2FA
6. **Account recovery** — Security questions or backup codes
7. **Calendly webhook** — Automatically track when user actually books call

---

## Success Metrics

- ✅ Users can sign up and see `/onboarding-choice` page
- ✅ Email/password stored securely in PostgreSQL
- ✅ Sessions work (user can navigate authenticated pages without re-login)
- ✅ Both onboarding paths work (self-service → `/onboarding`, phone → Calendly)
- ✅ Data persists across sessions
- ✅ No plaintext passwords in database
- ✅ 13+ existing tests still pass (no regressions)

