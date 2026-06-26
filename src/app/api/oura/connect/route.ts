import { NextResponse } from "next/server";
import { generateState, storeOAuthState } from "@/lib/oauth/state";

export async function GET() {
  const clientId = process.env.OURA_CLIENT_ID;
  const redirectUri = process.env.OURA_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "Oura credentials not configured. Set OURA_CLIENT_ID and OURA_REDIRECT_URI." },
      { status: 500 },
    );
  }

  const state = generateState();
  await storeOAuthState("oura", state);

  const authorizationUrl = new URL("https://cloud.ouraring.com/oauth/authorize");
  authorizationUrl.searchParams.set("client_id", clientId);
  authorizationUrl.searchParams.set("redirect_uri", redirectUri);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("scope", "daily heartrate personal");
  authorizationUrl.searchParams.set("state", state);

  return NextResponse.json({ authorizationUrl: authorizationUrl.toString() });
}
