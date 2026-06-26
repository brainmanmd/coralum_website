import { cookies } from "next/headers";

const STATE_COOKIE_MAX_AGE = 10 * 60; // 10 minutes

export function generateState(): string {
  return crypto.randomUUID();
}

export async function storeOAuthState(provider: string, state: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(`oauth_state_${provider}`, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: STATE_COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function validateAndClearOAuthState(provider: string, returnedState: string | null): Promise<boolean> {
  if (!returnedState) return false;
  const cookieStore = await cookies();
  const stored = cookieStore.get(`oauth_state_${provider}`)?.value;
  cookieStore.delete(`oauth_state_${provider}`);
  return stored !== undefined && stored === returnedState;
}

export async function storeTokens(
  provider: string,
  accessToken: string,
  refreshToken: string | undefined,
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(`${provider}_access_token`, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60, // 1 hour
    path: "/",
  });
  if (refreshToken) {
    cookieStore.set(`${provider}_refresh_token`, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
  }
}
