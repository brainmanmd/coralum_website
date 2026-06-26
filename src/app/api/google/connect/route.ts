import { NextResponse } from "next/server";
import { generateState, storeOAuthState } from "@/lib/oauth/state";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "Google credentials not configured. Set GOOGLE_CLIENT_ID and GOOGLE_REDIRECT_URI." },
      { status: 500 },
    );
  }

  const state = generateState();
  await storeOAuthState("google", state);

  const scopes = [
    "openid",
    "email",
    "profile",
    "https://www.googleapis.com/auth/fitness.activity.read",
    "https://www.googleapis.com/auth/fitness.heart_rate.read",
    "https://www.googleapis.com/auth/fitness.sleep.read",
  ].join(" ");

  const authorizationUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authorizationUrl.searchParams.set("client_id", clientId);
  authorizationUrl.searchParams.set("redirect_uri", redirectUri);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("scope", scopes);
  authorizationUrl.searchParams.set("access_type", "offline");
  authorizationUrl.searchParams.set("prompt", "consent");
  authorizationUrl.searchParams.set("state", state);

  return NextResponse.json({ authorizationUrl: authorizationUrl.toString() });
}
