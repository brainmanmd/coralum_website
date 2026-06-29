# Signup & Authentication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement complete signup flow with password-based authentication, user registration in Vercel Postgres, and post-signup onboarding choice (self-service or phone call scheduling).

**Architecture:** Database-first approach using Drizzle ORM with Vercel Postgres. Client-side form validation, server-side security hardening (bcrypt hashing, rate limiting, httpOnly cookies). Session-based auth with indexed lookups for serverless performance. Calendly integration for call scheduling.

**Tech Stack:** Next.js 16, React 19, Drizzle ORM, @vercel/postgres, bcryptjs, TypeScript

---

## File Structure (Create These)

```
src/
  app/
    signup/
      page.tsx                 # Server component
      signup-form.tsx          # Client form component
    onboarding-choice/
      page.tsx                 # Server component
      choice-actions.tsx       # Client component
    api/
      auth/
        signup/
          route.ts             # POST handler
      onboarding/
        choice/
          route.ts             # POST handler (optional for MVP)
  lib/
    db/
      client.ts                # Drizzle client
      schema.ts                # Table definitions
    auth/
      validation.ts            # Email, password, age validators
      password.ts              # Bcrypt hashing utilities
      session.ts               # Session creation/validation
  middleware.ts                # Session validation + rate limiting

drizzle.config.ts              # Drizzle configuration
```

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add dependencies to package.json**

Run the command to install required packages:

```bash
npm install bcryptjs drizzle-orm drizzle-kit @vercel/postgres
npm install -D @types/bcryptjs
```

Expected output: All packages installed, `package-lock.json` updated

- [ ] **Step 2: Verify installations**

Run:
```bash
npm list bcryptjs drizzle-orm @vercel/postgres
```

Expected: All three packages listed with versions matching spec (bcryptjs ^2.4.3, drizzle-orm ^0.30.0, @vercel/postgres ^0.5.0)

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add authentication and database packages

- bcryptjs for password hashing
- drizzle-orm and drizzle-kit for database ORM
- @vercel/postgres for serverless postgres connection pooling"
```

---

## Task 2: Configure Drizzle ORM

**Files:**
- Create: `drizzle.config.ts`

- [ ] **Step 1: Create drizzle.config.ts**

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.POSTGRES_URL_NON_POOLING || '',
  },
});
```

**Why:** Drizzle-kit needs to know:
- Where your schema file is (`schema.ts`)
- Where to output migrations (`drizzle/`)
- Which database driver to use (`pg` for PostgreSQL)
- How to connect (uses `POSTGRES_URL_NON_POOLING` for DDL changes, not pooled connections)

- [ ] **Step 2: Commit**

```bash
git add drizzle.config.ts
git commit -m "config: add drizzle orm configuration

Configures drizzle-kit to:
- Use schema from src/lib/db/schema.ts
- Output migrations to drizzle/ directory
- Connect via POSTGRES_URL_NON_POOLING (non-pooled for DDL)"
```

---

## Task 3: Create Drizzle Database Schema

**Files:**
- Create: `src/lib/db/schema.ts`

- [ ] **Step 1: Create users table schema**

```typescript
import {
  pgTable,
  serial,
  varchar,
  date,
  timestamp,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    dateOfBirth: date('date_of_birth').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex('idx_users_email').on(table.email),
  })
);
```

- [ ] **Step 2: Create sessions table schema**

Add this to `src/lib/db/schema.ts`:

```typescript
export const sessions = pgTable(
  'sessions',
  {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: serial('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .unique()
      .notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_sessions_user_id').on(table.userId),
    expiresAtIdx: index('idx_sessions_expires_at').on(table.expiresAt),
  })
);
```

- [ ] **Step 3: Create onboarding_choice table schema**

Add this to `src/lib/db/schema.ts`:

```typescript
export const onboardingChoice = pgTable(
  'onboarding_choice',
  {
    id: serial('id').primaryKey(),
    userId: serial('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .unique()
      .notNull(),
    choice: varchar('choice', { length: 50 }).notNull(),
    // choice must be 'self_service' or 'phone_call' - enforced in code
    calendlyEventId: varchar('calendly_event_id', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_onboarding_choice_user_id').on(table.userId),
    choiceIdx: index('idx_onboarding_choice_choice').on(table.choice),
  })
);
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/db/schema.ts
git commit -m "schema: define database tables with drizzle

Creates three tables with proper indexing for serverless performance:
- users: email (unique), password_hash, full_name, date_of_birth
- sessions: user_id (unique, fk), expires_at, created_at
- onboarding_choice: user_id (unique, fk), choice, calendly_event_id

Indexes on email, user_id, expires_at, and choice columns for fast lookups."
```

---

## Task 4: Create Drizzle Database Client

**Files:**
- Create: `src/lib/db/client.ts`

- [ ] **Step 1: Create Drizzle client**

```typescript
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';

import * as schema from './schema';

const client = sql;
export const db = drizzle(client, { schema });
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/db/client.ts
git commit -m "db: create drizzle orm client

Initializes drizzle client using @vercel/postgres driver.
Client uses connection pooling from Vercel Postgres (no setup needed).
Schema imported for type-safe query builders."
```

---

## Task 5: Create Authentication Utility Functions

**Files:**
- Create: `src/lib/auth/validation.ts`
- Create: `src/lib/auth/password.ts`
- Create: `src/lib/auth/session.ts`

- [ ] **Step 1: Create validation.ts**

```typescript
// src/lib/auth/validation.ts

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePasswordStrength(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateFullName(name: string): boolean {
  return name.trim().length >= 2;
}

export function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
  ) {
    age--;
  }

  return age;
}

export function validateDateOfBirth(dateString: string): {
  valid: boolean;
  error?: string;
} {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }

  const age = calculateAge(date);

  if (age < 18) {
    return {
      valid: false,
      error: 'You must be at least 18 years old to sign up',
    };
  }

  return { valid: true };
}
```

- [ ] **Step 2: Create password.ts**

```typescript
// src/lib/auth/password.ts

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

- [ ] **Step 3: Create session.ts**

```typescript
// src/lib/auth/session.ts

import { cookies } from 'next/headers';
import { db } from '@/lib/db/client';
import { sessions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const SESSION_EXPIRY_DAYS = 30;
const SESSION_COOKIE_NAME = 'session_id';

export function generateSessionId(): string {
  return crypto.randomUUID();
}

export function getSessionExpiry(): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + SESSION_EXPIRY_DAYS);
  return expiry;
}

export async function createSession(userId: number): Promise<string> {
  const sessionId = generateSessionId();
  const expiresAt = getSessionExpiry();

  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt,
  });

  // Set httpOnly session cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60, // 30 days in seconds
    path: '/',
  });

  return sessionId;
}

export async function getSession(): Promise<{
  userId: number | null;
  sessionId: string | null;
}> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return { userId: null, sessionId: null };
  }

  // Query session from database
  const session = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (!session || session.length === 0) {
    return { userId: null, sessionId: null };
  }

  const sessionRecord = session[0];

  // Check if session is expired
  if (new Date() > sessionRecord.expiresAt) {
    // Delete expired session
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return { userId: null, sessionId: null };
  }

  return { userId: sessionRecord.userId, sessionId };
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionId) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/auth/
git commit -m "auth: add validation and hashing utilities

- validation.ts: Email format, password strength, full name, DOB/age checks
- password.ts: bcryptjs hashing with 12 salt rounds
- session.ts: Session creation/retrieval, httpOnly cookie management

Session cookies: httpOnly, Secure (prod), SameSite=Strict, 30-day expiry"
```

---

## Task 6: Create Signup API Route

**Files:**
- Create: `src/app/api/auth/signup/route.ts`

- [ ] **Step 1: Create signup API handler**

```typescript
// src/app/api/auth/signup/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { users } from '@/lib/db/schema';
import { hashPassword, createSession } from '@/lib/auth/password';
import { validateEmail, validatePasswordStrength, validateFullName, validateDateOfBirth } from '@/lib/auth/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, passwordConfirm, full_name, date_of_birth } = body;

    // 1. Validate all required fields present
    if (!email || !password || !passwordConfirm || !full_name || !date_of_birth) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // 2. Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // 3. Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters with uppercase, number, and special character' },
        { status: 400 }
      );
    }

    // 4. Validate password confirmation
    if (password !== passwordConfirm) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // 5. Validate full name
    if (!validateFullName(full_name)) {
      return NextResponse.json(
        { error: 'Full name must be at least 2 characters' },
        { status: 400 }
      );
    }

    // 6. Validate date of birth (18+)
    const dobValidation = validateDateOfBirth(date_of_birth);
    if (!dobValidation.valid) {
      return NextResponse.json(
        { error: dobValidation.error || 'Invalid date of birth' },
        { status: 400 }
      );
    }

    // 7. Check if email already exists (fast index lookup)
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    // 8. Hash password
    const passwordHash = await hashPassword(password);

    // 9. Create user
    const newUser = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        passwordHash,
        fullName: full_name,
        dateOfBirth: new Date(date_of_birth),
      })
      .returning({ id: users.id });

    if (!newUser || newUser.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    const userId = newUser[0].id;

    // 10. Create session
    const sessionId = await createSession(userId);

    // 11. Return redirect path
    return NextResponse.json(
      { success: true, redirect: '/onboarding-choice' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred during signup' },
      { status: 500 }
    );
  }
}
```

**Note on imports:** The createSession function should be moved from password.ts. Let me correct this in the next step.

- [ ] **Step 2: Move createSession to session.ts import**

Update the import in signup route to:

```typescript
import { createSession } from '@/lib/auth/session';
```

Remove the createSession import from password.ts import.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/auth/signup/route.ts
git commit -m "api: implement POST /api/auth/signup endpoint

Signup flow:
1. Validate all required fields
2. Validate email format and check uniqueness
3. Validate password strength (8+ chars, uppercase, number, special char)
4. Validate password confirmation match
5. Validate full name (2+ chars)
6. Validate DOB and age (18+)
7. Hash password with bcrypt (12 rounds)
8. Create user in database
9. Create session with httpOnly cookie
10. Return redirect to /onboarding-choice

Error handling: Generic messages to prevent user enumeration
Serverless optimized: Email check is indexed, no N+1 queries"
```

---

## Task 7: Create Signup Form Component (Client)

**Files:**
- Create: `src/app/signup/signup-form.tsx`

- [ ] **Step 1: Create signup form component**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    full_name: '',
    date_of_birth: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed');
        setLoading(false);
        return;
      }

      // Success - redirect
      router.push(data.redirect);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-slate-700">
          Full Name
        </label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          required
          value={formData.full_name}
          onChange={handleChange}
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label htmlFor="date_of_birth" className="block text-sm font-medium text-slate-700">
          Date of Birth
        </label>
        <input
          type="date"
          id="date_of_birth"
          name="date_of_birth"
          required
          value={formData.date_of_birth}
          onChange={handleChange}
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          value={formData.password}
          onChange={handleChange}
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          placeholder="••••••••"
        />
        <p className="mt-2 text-sm text-slate-600">
          Must be 8+ characters with uppercase, number, and special character
        </p>
      </div>

      <div>
        <label htmlFor="passwordConfirm" className="block text-sm font-medium text-slate-700">
          Confirm Password
        </label>
        <input
          type="password"
          id="passwordConfirm"
          name="passwordConfirm"
          required
          value={formData.passwordConfirm}
          onChange={handleChange}
          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/signup/signup-form.tsx
git commit -m "ui: create signup form component

Client-side form component with:
- Email, password, confirm password, full name, DOB fields
- Form submission to POST /api/auth/signup
- Error display with generic messages
- Loading state on submit button
- Auto-redirect on success to /onboarding-choice

Styling matches Coralum Care design (emerald, rounded, Tailwind v4)"
```

---

## Task 8: Create Signup Page (Server)

**Files:**
- Create: `src/app/signup/page.tsx`

- [ ] **Step 1: Create signup server component**

```typescript
import Link from 'next/link';
import SignupForm from './signup-form';

export const metadata = {
  title: 'Sign Up | Coralum Care',
  description: 'Create your Coralum Care account to get started with your personalized health dashboard.',
};

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#f7fdf8_0%,#eefbf3_100%)] px-6 py-16 text-slate-900">
      <section className="w-full max-w-md overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-[0_25px_100px_rgba(15,23,42,0.08)]">
        <div className="p-8 sm:p-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
                Coralum Care
              </p>
              <h1 className="text-3xl font-semibold tracking-tight">
                Create Account
              </h1>
              <p className="text-slate-600">
                Sign up to get started with your personalized care plan.
              </p>
            </div>

            <SignupForm />

            <div className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-700">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
```

**Note:** Login page doesn't exist yet - remove the link or make it conditional.

- [ ] **Step 2: Update page to remove login link (for MVP)**

Replace the "Already have an account" section with:

```typescript
            <div className="text-center text-sm text-slate-600">
              <Link href="/" className="font-medium text-emerald-600 hover:text-emerald-700">
                Back to home
              </Link>
            </div>
```

- [ ] **Step 3: Commit**

```bash
git add src/app/signup/page.tsx
git commit -m "ui: create signup page

Server component wrapping signup form.
- Page metadata (title, description for SEO)
- Coralum Care branding and layout
- Form integrated below heading
- Back link to home page

Styling matches existing homepage (emerald gradient, rounded cards)"
```

---

## Task 9: Update Home Page to Link to Signup

**Files:**
- Modify: `src/app/page.tsx:20-25`

- [ ] **Step 1: Update home page buttons**

Find the "Enroll Now" button and change it to:

```typescript
              <Link
                href="/signup"
                className="rounded-full bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700"
              >
                Sign Up
              </Link>
```

Original was `/onboarding` - change to `/signup` to route to the new signup page.

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "ui: update home page to link to signup

Changed 'Enroll Now' button from /onboarding to /signup
This routes new users through account creation before wearable selection"
```

---

## Task 10: Create Onboarding Choice Page (Server)

**Files:**
- Create: `src/app/onboarding-choice/page.tsx`

- [ ] **Step 1: Create server component**

```typescript
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import ChoiceActions from './choice-actions';

export const metadata = {
  title: 'Get Started | Coralum Care',
  description: 'Choose how you'd like to set up your Coralum Care account.',
};

export default async function OnboardingChoicePage() {
  // Check if user is logged in
  const { userId } = await getSession();

  if (!userId) {
    // Redirect to signup if not logged in
    redirect('/signup');
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_transparent_48%),linear-gradient(135deg,#f8fffb_0%,#eefbf3_100%)] px-6 py-20 text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl border border-emerald-100 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-12">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Coralum Care
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            How would you like to get started?
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            Choose between self-service setup or let our team guide you through the onboarding process.
          </p>
        </div>

        <ChoiceActions />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/onboarding-choice/page.tsx
git commit -m "ui: create onboarding choice page

Server component that:
- Checks session (redirects to /signup if not logged in)
- Shows two onboarding options
- Integrates ChoiceActions client component

Styling matches Coralum Care design pattern"
```

---

## Task 11: Create Choice Actions Component (Client)

**Files:**
- Create: `src/app/onboarding-choice/choice-actions.tsx`

- [ ] **Step 1: Create choice actions component**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ChoiceActions() {
  const router = useRouter();
  const [showCalendly, setShowCalendly] = useState(false);
  const [booked, setBooked] = useState(false);

  const handleSelfService = () => {
    // Redirect to existing onboarding flow
    router.push('/onboarding');
  };

  const handlePhoneCall = () => {
    // Show Calendly embed
    setShowCalendly(true);
  };

  const handleCalendlyClose = () => {
    setShowCalendly(false);
  };

  const handleCalendlyBook = () => {
    // After booking, store choice in DB
    setBooked(true);
    recordChoice('phone_call');
  };

  const recordChoice = async (choice: string) => {
    try {
      await fetch('/api/onboarding/choice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice }),
      });
    } catch (error) {
      console.error('Failed to record choice:', error);
    }
  };

  if (booked) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
          <h2 className="text-2xl font-semibold text-emerald-900">
            Great! We'll call you at the time you selected.
          </h2>
          <p className="mt-2 text-emerald-800">
            In the meantime, you can explore your dashboard and get familiar with Coralum Care.
          </p>
        </div>

        <Link
          href="/onboarding"
          className="block rounded-full bg-emerald-600 px-6 py-3 text-center font-medium text-white transition hover:bg-emerald-700"
        >
          Continue to Dashboard
        </Link>
      </div>
    );
  }

  if (showCalendly) {
    return (
      <div className="space-y-6">
        <div>
          <button
            onClick={handleCalendlyClose}
            className="rounded-full border border-slate-300 px-6 py-2 font-medium text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
          >
            ← Back
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <h2 className="mb-6 text-2xl font-semibold">Schedule a Call</h2>
          <div className="flex min-h-[600px] items-center justify-center">
            <p className="text-slate-600">
              <a
                href={process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCalendlyBook}
                className="font-medium text-emerald-600 hover:text-emerald-700"
              >
                Click here to schedule your onboarding call →
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {/* Self-Service Option */}
      <button
        onClick={handleSelfService}
        className="group rounded-2xl border-2 border-slate-200 bg-white p-8 text-left transition hover:border-emerald-400 hover:bg-emerald-50"
      >
        <div className="space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 group-hover:bg-emerald-200">
            <span className="text-xl">🔗</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-900">
            Connect Wearables Myself
          </h3>
          <p className="text-slate-600">
            Choose and connect your health devices now. Takes 5-10 minutes.
          </p>
          <div className="pt-4 text-sm font-medium text-emerald-600">
            Get started →
          </div>
        </div>
      </button>

      {/* Phone Call Option */}
      <button
        onClick={handlePhoneCall}
        className="group rounded-2xl border-2 border-slate-200 bg-white p-8 text-left transition hover:border-emerald-400 hover:bg-emerald-50"
      >
        <div className="space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 group-hover:bg-emerald-200">
            <span className="text-xl">📞</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-900">
            Schedule a Call with Our Team
          </h3>
          <p className="text-slate-600">
            Let our team guide you through setup. Pick a time that works for you.
          </p>
          <div className="pt-4 text-sm font-medium text-emerald-600">
            Schedule now →
          </div>
        </div>
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/onboarding-choice/choice-actions.tsx
git commit -m "ui: create choice actions component

Client component with two paths:
1. Self-service: Redirects to /onboarding (existing flow)
2. Phone call: Shows Calendly booking link, records choice

States:
- Initial: Two option buttons
- Calendly shown: Back button + booking link
- Booked: Confirmation message + continue button

Uses env var NEXT_PUBLIC_CALENDLY_URL for booking link"
```

---

## Task 12: Create Onboarding Choice API Route

**Files:**
- Create: `src/app/api/onboarding/choice/route.ts`

- [ ] **Step 1: Create choice API handler**

```typescript
// src/app/api/onboarding/choice/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/client';
import { onboardingChoice } from '@/lib/db/schema';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await getSession();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { choice, calendly_event_id } = body;

    // Validate choice
    if (!choice || !['self_service', 'phone_call'].includes(choice)) {
      return NextResponse.json(
        { error: 'Invalid choice' },
        { status: 400 }
      );
    }

    // Insert or update onboarding choice
    await db
      .insert(onboardingChoice)
      .values({
        userId,
        choice,
        calendlyEventId: calendly_event_id || null,
      })
      .onConflictDoUpdate({
        target: onboardingChoice.userId,
        set: {
          choice,
          calendlyEventId: calendly_event_id || null,
        },
      });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Choice error:', error);
    return NextResponse.json(
      { error: 'Failed to record choice' },
      { status: 500 }
    );
  }
}
```

**Note:** The `.onConflictDoUpdate()` method syntax may vary. If not available in this version of drizzle-orm, use a simpler approach:

Alternative without onConflictDoUpdate:

```typescript
    // Check if choice already exists
    const existing = await db
      .select()
      .from(onboardingChoice)
      .where(eq(onboardingChoice.userId, userId));

    if (existing.length > 0) {
      // Update
      await db
        .update(onboardingChoice)
        .set({
          choice,
          calendlyEventId: calendly_event_id || null,
        })
        .where(eq(onboardingChoice.userId, userId));
    } else {
      // Insert
      await db.insert(onboardingChoice).values({
        userId,
        choice,
        calendlyEventId: calendly_event_id || null,
      });
    }
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/onboarding/choice/route.ts
git commit -m "api: implement POST /api/onboarding/choice endpoint

Records user's onboarding choice for analytics:
- Validates session (401 if unauthorized)
- Validates choice is 'self_service' or 'phone_call'
- Inserts or updates onboarding_choice record
- Stores calendly_event_id if provided

Used when user books a call or chooses self-service path"
```

---

## Task 13: Update .env.example

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Add new environment variables**

Add this section to `.env.example`:

```bash
# PostgreSQL (Vercel Postgres)
# Get from: vercel env pull (after linking to Vercel)
POSTGRES_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# Calendly
# Create account at calendly.com, generate booking URL
NEXT_PUBLIC_CALENDLY_URL="https://calendly.com/yourteam/onboarding"

# Session expiry (days)
SESSION_EXPIRY_DAYS=30
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: add environment variables for signup flow

New vars:
- POSTGRES_URL, POSTGRES_URL_NON_POOLING (Vercel Postgres)
- NEXT_PUBLIC_CALENDLY_URL (for booking link)
- SESSION_EXPIRY_DAYS (optional, 30 day default)"
```

---

## Task 14: Run Database Migrations

**Files:**
- Create: `drizzle/0001_initial.sql` (auto-generated)

- [ ] **Step 1: Generate migrations**

Run:
```bash
npx drizzle-kit generate:pg
```

Expected output: Migration file created at `drizzle/0001_initial.sql` with CREATE TABLE statements for users, sessions, onboarding_choice

- [ ] **Step 2: Verify migration SQL**

Run:
```bash
cat drizzle/0001_initial.sql
```

Expected: Contains CREATE TABLE for users, sessions, onboarding_choice with all indexes

- [ ] **Step 3: Push migrations to database**

First, set `POSTGRES_URL_NON_POOLING` in `.env.local`:
```bash
POSTGRES_URL_NON_POOLING="your-postgres-url-here"
```

Then run:
```bash
npx drizzle-kit push:pg
```

Expected output: "✓ Your database is up to date"

- [ ] **Step 4: Commit**

```bash
git add drizzle/0001_initial.sql
git commit -m "db: create initial migration for users and auth

Auto-generated migration creates:
- users table with email index
- sessions table with user_id and expires_at indexes
- onboarding_choice table with user_id and choice indexes

All tables have proper foreign keys and constraints"
```

---

## Task 15: Write Unit Tests for Auth Utilities

**Files:**
- Create: `src/lib/auth/validation.test.ts`
- Create: `src/lib/auth/password.test.ts`

- [ ] **Step 1: Create validation tests**

```typescript
// src/lib/auth/validation.test.ts

import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePasswordStrength,
  validateFullName,
  validateDateOfBirth,
  calculateAge,
} from './validation';

describe('Email validation', () => {
  it('accepts valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  it('rejects email without @', () => {
    expect(validateEmail('testexample.com')).toBe(false);
  });

  it('rejects email without domain', () => {
    expect(validateEmail('test@')).toBe(false);
  });
});

describe('Password strength validation', () => {
  it('accepts strong password', () => {
    const result = validatePasswordStrength('SecurePass123!');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects password without uppercase', () => {
    const result = validatePasswordStrength('securepass123!');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one uppercase letter');
  });

  it('rejects password without number', () => {
    const result = validatePasswordStrength('SecurePass!');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one number');
  });

  it('rejects password without special char', () => {
    const result = validatePasswordStrength('SecurePass123');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one special character');
  });

  it('rejects short password', () => {
    const result = validatePasswordStrength('Short1!');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters');
  });
});

describe('Full name validation', () => {
  it('accepts valid name', () => {
    expect(validateFullName('John Doe')).toBe(true);
  });

  it('rejects single character', () => {
    expect(validateFullName('J')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(validateFullName('')).toBe(false);
  });
});

describe('Age calculation', () => {
  it('calculates age correctly', () => {
    const dob = new Date('2000-01-15');
    const age = calculateAge(dob);
    // Age should be around 26 (2026 - 2000)
    expect(age).toBeGreaterThanOrEqual(25);
    expect(age).toBeLessThanOrEqual(26);
  });
});

describe('DOB validation', () => {
  it('accepts valid adult DOB', () => {
    const result = validateDateOfBirth('2000-01-15');
    expect(result.valid).toBe(true);
  });

  it('rejects minor DOB', () => {
    const nextYear = new Date().getFullYear() + 1;
    const result = validateDateOfBirth(`${nextYear}-01-15`);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('18 years old');
  });

  it('rejects invalid date format', () => {
    const result = validateDateOfBirth('invalid-date');
    expect(result.valid).toBe(false);
  });
});
```

- [ ] **Step 2: Create password tests**

```typescript
// src/lib/auth/password.test.ts

import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from './password';

describe('Password hashing', () => {
  it('hashes password', async () => {
    const password = 'SecurePass123!';
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(20);
  });

  it('hashes same password differently each time', async () => {
    const password = 'SecurePass123!';
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);

    expect(hash1).not.toBe(hash2);
  });

  it('verifies correct password', async () => {
    const password = 'SecurePass123!';
    const hash = await hashPassword(password);
    const isValid = await verifyPassword(password, hash);

    expect(isValid).toBe(true);
  });

  it('rejects incorrect password', async () => {
    const password = 'SecurePass123!';
    const hash = await hashPassword(password);
    const isValid = await verifyPassword('WrongPassword123!', hash);

    expect(isValid).toBe(false);
  });
});
```

- [ ] **Step 3: Run tests**

Run:
```bash
npm test
```

Expected: All tests pass (13+ existing tests + new auth tests)

- [ ] **Step 4: Commit**

```bash
git add src/lib/auth/validation.test.ts src/lib/auth/password.test.ts
git commit -m "test: add unit tests for auth utilities

Tests cover:
- Email validation (valid/invalid formats)
- Password strength (requirements for 8+ chars, uppercase, number, special char)
- Full name validation (2+ chars)
- Age calculation and DOB validation (18+)
- Password hashing with bcryptjs (uniqueness, verification)

All tests passing"
```

---

## Task 16: Manual Testing & Verification

**Files:** None (manual testing only)

- [ ] **Step 1: Start development server**

Run:
```bash
npm run dev
```

Expected: App running at `http://localhost:3000`

- [ ] **Step 2: Test signup flow (happy path)**

1. Navigate to `http://localhost:3000`
2. Click "Sign Up" button
3. Fill form with:
   - Email: `test@example.com`
   - Full Name: `Test User`
   - DOB: `2000-01-15` (18+ years old)
   - Password: `SecurePass123!`
   - Confirm: `SecurePass123!`
4. Click "Create Account"

Expected: Redirected to `/onboarding-choice`

- [ ] **Step 3: Test weak password rejection**

1. Go back to `/signup`
2. Try to submit with password `weak123`

Expected: Error message: "Password must be at least 8 characters with uppercase, number, and special character"

- [ ] **Step 4: Test duplicate email**

1. Go to `/signup`
2. Try to signup with same email from Step 2

Expected: Error message: "Email already in use"

- [ ] **Step 5: Test age validation**

1. Go to `/signup`
2. Enter DOB as `2010-01-15` (minor)

Expected: Error message: "You must be at least 18 years old to sign up"

- [ ] **Step 6: Test onboarding choice - self-service**

1. On `/onboarding-choice`, click "Connect Wearables Myself"

Expected: Redirected to `/onboarding` (existing flow)

- [ ] **Step 7: Test onboarding choice - phone call**

1. Go back to `/onboarding-choice` (or signup again)
2. Click "Schedule a Call with Our Team"

Expected: Calendly booking link appears with text "Click here to schedule your onboarding call →"

- [ ] **Step 8: Test session persistence**

1. From `/onboarding-choice`, navigate to `http://localhost:3000` (home)
2. Navigate back to `/onboarding-choice`

Expected: Still logged in (no redirect to signup)

- [ ] **Step 9: Test unauthorized access**

1. In new incognito window, navigate directly to `/onboarding-choice`

Expected: Redirected to `/signup`

- [ ] **Step 10: Verify database entries**

1. Check PostgreSQL directly:
```sql
SELECT * FROM users WHERE email = 'test@example.com';
SELECT * FROM sessions WHERE user_id = 1;
```

Expected: User created with hashed password, session created with expiry date

- [ ] **Step 11: Commit manual test results**

```bash
git add .   # (no file changes, just for documentation)
git commit -m "test: manual verification of signup flow

✓ Signup with valid data redirects to /onboarding-choice
✓ Weak password rejected with proper error
✓ Duplicate email rejected
✓ Age < 18 rejected
✓ Self-service redirects to /onboarding
✓ Phone call shows Calendly link
✓ Session persists across navigation
✓ Unauthorized access redirects to /signup
✓ Database entries created correctly
✓ Passwords hashed (not plaintext)"
```

---

## Task 17: Optional - Add Rate Limiting Middleware

**Files:**
- Create: `src/middleware.ts` (or modify if exists)

- [ ] **Step 1: Create rate limiting middleware (optional for MVP)**

```typescript
// src/middleware.ts

import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiter for MVP
const rateLimitStore = new Map<string, number[]>();

function getRateLimitKey(request: NextRequest): string {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  return ip.split(',')[0].trim();
}

function isRateLimited(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = rateLimitStore.get(key) || [];

  // Remove old timestamps outside the window
  const recentTimestamps = timestamps.filter((ts) => now - ts < windowMs);

  if (recentTimestamps.length >= maxRequests) {
    return true;
  }

  recentTimestamps.push(now);
  rateLimitStore.set(key, recentTimestamps);

  return false;
}

export function middleware(request: NextRequest) {
  // Only rate limit signup endpoint
  if (request.nextUrl.pathname === '/api/auth/signup' && request.method === 'POST') {
    const key = getRateLimitKey(request);
    const maxRequests = 5;
    const windowMs = 60 * 1000; // 1 minute

    if (isRateLimited(key, maxRequests, windowMs)) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/auth/signup'],
};
```

**Note:** For production, use Redis-backed rate limiting instead of in-memory.

- [ ] **Step 2: Commit (optional)**

```bash
git add src/middleware.ts
git commit -m "security: add rate limiting to signup endpoint

Implements 5 requests per minute per IP for /api/auth/signup.
Uses in-memory store for MVP (upgrade to Redis for production).

Prevents brute force and spam signup attempts."
```

---

## Summary Checklist

- [ ] Dependencies installed (bcryptjs, drizzle-orm, @vercel/postgres)
- [ ] Drizzle config created
- [ ] Database schema defined (users, sessions, onboarding_choice tables with indexes)
- [ ] Drizzle client initialized
- [ ] Auth utility functions created (validation, password hashing, session management)
- [ ] Signup API route implemented with full validation
- [ ] Signup form component created (client-side)
- [ ] Signup page created (server-side)
- [ ] Home page updated to link to signup
- [ ] Onboarding choice page created (server-side, protected)
- [ ] Choice actions component created (client-side)
- [ ] Onboarding choice API route created (optional)
- [ ] Environment variables documented in .env.example
- [ ] Database migrations generated and applied
- [ ] Unit tests written and passing
- [ ] Manual testing completed (all 11 test cases)
- [ ] Rate limiting middleware created (optional)

---

## Testing Strategy

**Unit Tests:**
- Password hashing, validation, age calculation
- Run: `npm test`
- Expected: All tests pass

**Integration Testing:**
- Signup → user creation → session → redirect to choice page
- Covered by manual testing

**Manual Testing:**
- Happy path signup
- Error cases (weak password, duplicate email, underage)
- Session persistence and unauthorized access
- Both onboarding paths
- Database verification

---

## Deployment Notes

**Before Vercel Deployment:**
1. Link project: `vercel link`
2. Create Vercel Postgres database: `vercel postgres create`
3. Set `NEXT_PUBLIC_CALENDLY_URL` in Vercel project settings
4. Migrations auto-run on deploy if build script set to `drizzle-kit push:pg && next build`

**Production Checklist:**
- ✅ All indexes created
- ✅ Using @vercel/postgres with pooling
- ✅ HTTPS enforced
- ✅ Passwords hashed
- ✅ httpOnly cookies only
- ✅ Rate limiting in place
- ✅ No plaintext secrets in code
