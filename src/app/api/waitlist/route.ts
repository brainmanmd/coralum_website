import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { waitlistSignups } from '@/lib/db/schema';
import { validateEmail, validateFullName } from '@/lib/auth/validation';
import { validateZipCode, validateWaitlistDateOfBirth } from '@/lib/waitlist/validation';

// Node.js runtime: drizzle-orm/vercel-postgres needs the pg connection pool,
// which isn't available on the Edge runtime.
export const runtime = 'nodejs';
// Mutating route — never cache or statically optimize this handler.
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      full_name,
      email,
      date_of_birth,
      zip_code,
      insurance_provider,
      contact_consent,
      beta_consent,
    } = body;

    if (!full_name || !email || !date_of_birth || !zip_code) {
      return NextResponse.json(
        { error: 'Full name, email, date of birth, and ZIP code are required' },
        { status: 400 }
      );
    }

    if (!validateFullName(full_name)) {
      return NextResponse.json(
        { error: 'Full name must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const dobValidation = validateWaitlistDateOfBirth(date_of_birth);
    if (!dobValidation.valid) {
      return NextResponse.json(
        { error: dobValidation.error ?? 'Invalid date of birth' },
        { status: 400 }
      );
    }

    if (!validateZipCode(zip_code)) {
      return NextResponse.json(
        { error: 'Invalid ZIP / postal code' },
        { status: 400 }
      );
    }

    if (contact_consent !== true) {
      return NextResponse.json(
        { error: 'You must consent to be contacted to join the waitlist' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    const existing = await db
      .select({ id: waitlistSignups.id })
      .from(waitlistSignups)
      .where(eq(waitlistSignups.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { success: true },
        { status: 200 }
      );
    }

    await db.insert(waitlistSignups).values({
      fullName: full_name,
      email: normalizedEmail,
      dateOfBirth: date_of_birth,
      zipCode: zip_code,
      insuranceProvider: insurance_provider || null,
      contactConsent: true,
      betaConsent: beta_consent === true,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Waitlist signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred while joining the waitlist' },
      { status: 500 }
    );
  }
}
