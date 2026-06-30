import { NextRequest, NextResponse } from 'next/server';

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

export function proxy(request: NextRequest) {
  if (
    request.nextUrl.pathname === '/api/auth/signup' &&
    request.method === 'POST'
  ) {
    const key = getRateLimitKey(request);

    if (isRateLimited(key, 5, 60_000)) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        { status: 429 }
      );
    }
  }

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

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/auth/signup', '/api/waitlist'],
};
