import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { users } from '@/lib/db/schema';
import { hashPassword } from '@/lib/auth/password';
import { createSession } from '@/lib/auth/session';
import {
  validateEmail,
  validatePasswordStrength,
  validateFullName,
  validateDateOfBirth,
} from '@/lib/auth/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, passwordConfirm, full_name, date_of_birth } = body;

    if (!email || !password || !passwordConfirm || !full_name || !date_of_birth) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters with uppercase, number, and special character' },
        { status: 400 }
      );
    }

    if (password !== passwordConfirm) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (!validateFullName(full_name)) {
      return NextResponse.json(
        { error: 'Full name must be at least 2 characters' },
        { status: 400 }
      );
    }

    const dobValidation = validateDateOfBirth(date_of_birth);
    if (!dobValidation.valid) {
      return NextResponse.json(
        { error: dobValidation.error ?? 'Invalid date of birth' },
        { status: 400 }
      );
    }

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

    const passwordHash = await hashPassword(password);

    const newUser = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        passwordHash,
        fullName: full_name,
        dateOfBirth: date_of_birth,
      })
      .returning({ id: users.id });

    if (!newUser || newUser.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    const userId = newUser[0].id;
    await createSession(userId);

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
