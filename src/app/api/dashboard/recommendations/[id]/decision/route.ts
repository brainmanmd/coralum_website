import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { medicationRecommendations } from '@/lib/db/schema';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Action = 'approved' | 'deferred' | 'declined' | 'undo';

const DEFAULT_NOTES: Record<'approved' | 'deferred' | 'declined', string> = {
  approved: 'Order Sent to Pharmacy and Patient Notified',
  deferred: 'Deferred — more information requested',
  declined: 'Recommendation declined',
};

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const recommendationId = Number(id);
  if (!Number.isInteger(recommendationId)) {
    return NextResponse.json({ error: 'Invalid recommendation id' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const action = body.action as Action;

    if (!['approved', 'deferred', 'declined', 'undo'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const rows = await db
      .select()
      .from(medicationRecommendations)
      .where(eq(medicationRecommendations.id, recommendationId))
      .limit(1);
    const recommendation = rows[0];

    if (!recommendation) {
      return NextResponse.json({ error: 'Recommendation not found' }, { status: 404 });
    }

    if (action === 'undo') {
      if (recommendation.status === 'pending') {
        return NextResponse.json({ error: 'Recommendation has no decision to undo' }, { status: 400 });
      }
      await db
        .update(medicationRecommendations)
        .set({
          status: 'pending',
          decidedAt: null,
          decidedByClinicianId: null,
          decisionNote: null,
          deferredUntil: null,
        })
        .where(eq(medicationRecommendations.id, recommendationId));
      return NextResponse.json({ success: true, status: 'pending' });
    }

    if (recommendation.status !== 'pending') {
      return NextResponse.json({ error: 'Recommendation already decided' }, { status: 409 });
    }

    const note: string = typeof body.note === 'string' && body.note.trim() ? body.note : DEFAULT_NOTES[action];

    const updates: Partial<typeof recommendation> = {
      status: action,
      decidedAt: new Date(),
      decidedByClinicianId: session.clinicianId,
      decisionNote: note,
    };

    if (action === 'approved' && body.dose) {
      const { cd, ld, freq } = body.dose;
      if (typeof cd !== 'string' || typeof ld !== 'string' || typeof freq !== 'string') {
        return NextResponse.json({ error: 'Invalid dose override' }, { status: 400 });
      }
      updates.recommendedCarbidopaMg = cd;
      updates.recommendedLevodopaMg = ld;
      updates.recommendedFreq = freq;
    }

    if (action === 'deferred' && typeof body.deferredUntil === 'string') {
      updates.deferredUntil = body.deferredUntil;
    }

    await db
      .update(medicationRecommendations)
      .set(updates)
      .where(eq(medicationRecommendations.id, recommendationId));

    return NextResponse.json({ success: true, status: action, note });
  } catch (error) {
    console.error('Decision update error:', error);
    return NextResponse.json({ error: 'An error occurred while recording the decision' }, { status: 500 });
  }
}
