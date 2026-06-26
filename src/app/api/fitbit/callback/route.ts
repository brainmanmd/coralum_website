import { NextResponse } from "next/server";
import { validateAndClearOAuthState, storeTokens } from "@/lib/oauth/state";

// Fitbit uses standard Authorization Code flow — callback arrives as GET with query params.
// Token exchange requires HTTP Basic auth (base64 of clientId:clientSecret).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const onboardingUrl = (status: string, reason?: string) => {
    const url = new URL("/onboarding", origin);
    url.searchParams.set(status === "connected" ? "connected" : "error", "fitbit");
    if (reason) url.searchParams.set("reason", reason);
    return url.toString();
  };

  if (error) {
    return NextResponse.redirect(onboardingUrl("error", error));
  }

  if (!code) {
    return NextResponse.redirect(onboardingUrl("error", "missing_code"));
  }

  const stateValid = await validateAndClearOAuthState("fitbit", state);
  if (!stateValid) {
    return NextResponse.redirect(onboardingUrl("error", "invalid_state"));
  }

  const clientId = process.env.FITBIT_CLIENT_ID;
  const clientSecret = process.env.FITBIT_CLIENT_SECRET;
  const redirectUri = process.env.FITBIT_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.redirect(onboardingUrl("error", "credentials_missing"));
  }

  const tokenResponse = await fetch("https://api.fitbit.com/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      code,
      grant_type: "authorization_code",
      client_id: clientId,
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = (await tokenResponse.json()) as {
    access_token?: string;
    refresh_token?: string;
    errors?: Array<{ errorType: string; message: string }>;
  };

  if (!tokenResponse.ok || !tokenData.access_token) {
    const reason = tokenData.errors?.[0]?.errorType ?? "token_exchange_failed";
    return NextResponse.redirect(onboardingUrl("error", reason));
  }

  await storeTokens("fitbit", tokenData.access_token, tokenData.refresh_token);
  return NextResponse.redirect(onboardingUrl("connected"));
}
