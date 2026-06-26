import { NextResponse } from "next/server";
import { generateState, storeOAuthState } from "@/lib/oauth/state";

export async function GET() {
  const clientId = process.env.FITBIT_CLIENT_ID;
  const redirectUri = process.env.FITBIT_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "Fitbit credentials not configured. Set FITBIT_CLIENT_ID and FITBIT_REDIRECT_URI." },
      { status: 500 },
    );
  }

  const state = generateState();
  await storeOAuthState("fitbit", state);

  const authorizationUrl = new URL("https://www.fitbit.com/oauth2/authorize");
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("client_id", clientId);
  authorizationUrl.searchParams.set("redirect_uri", redirectUri);
  authorizationUrl.searchParams.set("scope", "activity heartrate sleep profile");
  authorizationUrl.searchParams.set("state", state);

  return NextResponse.json({ authorizationUrl: authorizationUrl.toString() });
}
