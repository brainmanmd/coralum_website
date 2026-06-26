import { NextResponse } from "next/server";
import { validateAndClearOAuthState, storeTokens } from "@/lib/oauth/state";
import { generateAppleClientSecret } from "@/lib/oauth/apple";

// Apple uses response_mode=form_post — the callback arrives as a POST with a form body.
export async function POST(request: Request) {
  const { origin } = new URL(request.url);
  const formData = await request.formData();
  const code = formData.get("code")?.toString();
  const state = formData.get("state")?.toString() ?? null;
  const error = formData.get("error")?.toString();

  const onboardingUrl = (status: string, reason?: string) => {
    const url = new URL("/onboarding", origin);
    url.searchParams.set(status === "connected" ? "connected" : "error", "apple-watch");
    if (reason) url.searchParams.set("reason", reason);
    return url.toString();
  };

  if (error) {
    return NextResponse.redirect(onboardingUrl("error", error));
  }

  if (!code) {
    return NextResponse.redirect(onboardingUrl("error", "missing_code"));
  }

  const stateValid = await validateAndClearOAuthState("apple", state);
  if (!stateValid) {
    return NextResponse.redirect(onboardingUrl("error", "invalid_state"));
  }

  const clientId = process.env.APPLE_CLIENT_ID;
  const redirectUri = process.env.APPLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.redirect(onboardingUrl("error", "credentials_missing"));
  }

  let clientSecret: string;
  try {
    clientSecret = generateAppleClientSecret();
  } catch {
    return NextResponse.redirect(onboardingUrl("error", "apple_jwt_config_missing"));
  }

  const tokenResponse = await fetch("https://appleid.apple.com/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = (await tokenResponse.json()) as {
    access_token?: string;
    refresh_token?: string;
    error?: string;
  };

  if (!tokenResponse.ok || !tokenData.access_token) {
    return NextResponse.redirect(onboardingUrl("error", tokenData.error ?? "token_exchange_failed"));
  }

  await storeTokens("apple", tokenData.access_token, tokenData.refresh_token);
  return NextResponse.redirect(onboardingUrl("connected"));
}
