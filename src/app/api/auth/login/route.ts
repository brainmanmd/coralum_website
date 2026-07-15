import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { clinicians } from '@/lib/db/schema';
import { verifyPassword } from '@/lib/auth/password';
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from '@/lib/auth/session';

// bcryptjs + the drizzle/postgres client both need Node APIs, unavailable on Edge.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const rows = await db.select().from(clinicians).where(eq(clinicians.email, normalizedEmail)).limit(1);
    const clinician = rows[0];

    const passwordValid = clinician ? await verifyPassword(password, clinician.passwordHash) : false;
    if (!clinician || !passwordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = await createSessionToken({ clinicianId: clinician.id, email: clinician.email });
    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'An error occurred while signing in' }, { status: 500 });
  }
}
