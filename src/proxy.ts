import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth/session';

const rateLimitStore = new Map<string, number[]>();

function getRateLimitKey(request: NextRequest): string {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  return ip.split(',')[0].trim();
}

function isRateLimited(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = rateLimitStore.get(key) ?? [];
  const recentTimestamps = timestamps.filter((ts) => now - ts < windowMs);

  if (recentTimestamps.length >= maxRequests) {
    return true;
  }

  recentTimestamps.push(now);
  rateLimitStore.set(key, recentTimestamps);
  return false;
}

export async function proxy(request: NextRequest) {
  if (
    request.nextUrl.pathname === '/api/waitlist' &&
    request.method === 'POST'
  ) {
    const key = getRateLimitKey(request);

    if (isRateLimited(key, 5, 60_000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
  }

  if (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/api/dashboard')
  ) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = await verifySessionToken(token);

    if (!session) {
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/waitlist', '/dashboard/:path*', '/api/dashboard/:path*'],
};
