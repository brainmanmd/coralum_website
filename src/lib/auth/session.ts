// Web Crypto (not Node's `crypto` module) so this works unmodified in both
// the Node.js runtime (route handlers) and the Edge runtime (middleware).

export const SESSION_COOKIE = 'coralum_clinician_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours
export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;

export interface SessionPayload {
  clinicianId: number;
  email: string;
  exp: number;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET is not set');
  return secret;
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

export async function createSessionToken(payload: Omit<SessionPayload, 'exp'>): Promise<string> {
  const full: SessionPayload = { ...payload, exp: Date.now() + SESSION_TTL_MS };
  const body = bytesToBase64Url(encoder.encode(JSON.stringify(full)));
  const key = await getKey();
  const sigBuf = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const sig = bytesToBase64Url(new Uint8Array(sigBuf));
  return `${body}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;

  const key = await getKey();
  const valid = await crypto.subtle.verify('HMAC', key, base64UrlToBytes(sig) as BufferSource, encoder.encode(body));
  if (!valid) return null;

  try {
    const payload: SessionPayload = JSON.parse(decoder.decode(base64UrlToBytes(body)));
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
