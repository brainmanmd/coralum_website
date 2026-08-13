import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { waitlistSignups } from '@/lib/db/schema';
import {
  validateEmail,
  validateFullName,
  validateZipCode,
  validateWaitlistDateOfBirth,
  validateJoiningAs,
  validateParkinsonsDuration,
} from '@/lib/waitlist/validation';

// Node.js runtime: the Postgres client needs a full Node.js runtime,
// which isn't available on the Edge runtime.
export const runtime = 'nodejs';
// Mutating route — never cache or statically optimize this handler.
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      joining_as,
      patient_name,
      caregiver_name,
      email,
      date_of_birth,
      zip_code,
      insurance_provider,
      parkinsons_duration,
      uses_wearable,
      wearable_device,
      contact_consent,
      beta_consent,
    } = body;

    if (!joining_as || !patient_name || !email || !date_of_birth || !zip_code || !parkinsons_duration) {
      return NextResponse.json(
        {
          error:
            "Role, patient name, email, date of birth, ZIP code, and Parkinson's duration are required",
        },
        { status: 400 }
      );
    }

    if (!validateJoiningAs(joining_as)) {
      return NextResponse.json(
        { error: 'Invalid role selection' },
        { status: 400 }
      );
    }

    if (!validateFullName(patient_name)) {
      return NextResponse.json(
        { error: 'Patient name must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (joining_as === 'caregiver' && !validateFullName(caregiver_name || '')) {
      return NextResponse.json(
        { error: 'Your name must be at least 2 characters' },
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

    if (!validateParkinsonsDuration(parkinsons_duration)) {
      return NextResponse.json(
        { error: 'Invalid Parkinson\'s duration selection' },
        { status: 400 }
      );
    }

    if (uses_wearable !== true && uses_wearable !== false) {
      return NextResponse.json(
        { error: 'Please answer the wearable/smartwatch question' },
        { status: 400 }
      );
    }

    if (uses_wearable === true && !wearable_device) {
      return NextResponse.json(
        { error: 'Please tell us which device you use' },
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
      joiningAs: joining_as,
      patientName: patient_name,
      caregiverName: joining_as === 'caregiver' ? caregiver_name : null,
      email: normalizedEmail,
      dateOfBirth: date_of_birth,
      zipCode: zip_code,
      insuranceProvider: insurance_provider || null,
      parkinsonsDuration: parkinsons_duration,
      usesWearable: uses_wearable,
      wearableDevice: uses_wearable ? wearable_device : null,
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
