import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { waitlistSignups } from '@/lib/db/schema';
import { validateEmail, validateFullName, validateState } from '@/lib/waitlist/validation';

// Node.js runtime: the Postgres client needs a full Node.js runtime,
// which isn't available on the Edge runtime.
export const runtime = 'nodejs';
// Mutating route — never cache or statically optimize this handler.
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, email, state, contact_consent, testing_interest, source } = body;

    if (!full_name || !email || !state) {
      return NextResponse.json(
        { error: 'Name, email, and state are required' },
        { status: 400 }
      );
    }

    if (!validateFullName(full_name)) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!validateState(state)) {
      return NextResponse.json(
        { error: 'Please select a state' },
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
      return NextResponse.json({ success: true }, { status: 200 });
    }

    await db.insert(waitlistSignups).values({
      fullName: full_name,
      email: normalizedEmail,
      state,
      contactConsent: true,
      testingInterest: testing_interest === true,
      source: typeof source === 'string' ? source.slice(0, 500) : null,
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
