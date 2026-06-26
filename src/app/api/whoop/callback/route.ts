import { NextResponse } from "next/server";
import { validateAndClearOAuthState, storeTokens } from "@/lib/oauth/state";

// WHOOP uses standard Authorization Code flow — callback arrives as GET with query params.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const onboardingUrl = (status: string, reason?: string) => {
    const url = new URL("/onboarding", origin);
    url.searchParams.set(status === "connected" ? "connected" : "error", "whoop");
    if (reason) url.searchParams.set("reason", reason);
    return url.toString();
  };

  if (error) {
    return NextResponse.redirect(onboardingUrl("error", error));
  }

  if (!code) {
    return NextResponse.redirect(onboardingUrl("error", "missing_code"));
  }

  const stateValid = await validateAndClearOAuthState("whoop", state);
  if (!stateValid) {
    return NextResponse.redirect(onboardingUrl("error", "invalid_state"));
  }

  const clientId = process.env.WHOOP_CLIENT_ID;
  const clientSecret = process.env.WHOOP_CLIENT_SECRET;
  const redirectUri = process.env.WHOOP_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.redirect(onboardingUrl("error", "credentials_missing"));
  }

  const tokenResponse = await fetch("https://api.prod.whoop.com/oauth/oauth2/token", {
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

  await storeTokens("whoop", tokenData.access_token, tokenData.refresh_token);
  return NextResponse.redirect(onboardingUrl("connected"));
}
