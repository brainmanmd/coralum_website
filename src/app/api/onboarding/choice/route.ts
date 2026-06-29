import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db/client';
import { onboardingChoice } from '@/lib/db/schema';

const VALID_CHOICES = ['self_service', 'phone_call'] as const;
type Choice = typeof VALID_CHOICES[number];

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

    if (!choice || !VALID_CHOICES.includes(choice as Choice)) {
      return NextResponse.json(
        { error: 'Invalid choice' },
        { status: 400 }
      );
    }

    const existing = await db
      .select()
      .from(onboardingChoice)
      .where(eq(onboardingChoice.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(onboardingChoice)
        .set({
          choice,
          calendlyEventId: calendly_event_id ?? null,
        })
        .where(eq(onboardingChoice.userId, userId));
    } else {
      await db.insert(onboardingChoice).values({
        userId,
        choice,
        calendlyEventId: calendly_event_id ?? null,
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Choice error:', error);
    return NextResponse.json(
      { error: 'Failed to record choice' },
      { status: 500 }
    );
  }
}
