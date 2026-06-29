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

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
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

  const session = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (!session || session.length === 0) {
    return { userId: null, sessionId: null };
  }

  const sessionRecord = session[0];

  if (new Date() > sessionRecord.expiresAt) {
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
