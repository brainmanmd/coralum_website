import { NextResponse } from "next/server";
import { generateState, storeOAuthState } from "@/lib/oauth/state";

export async function GET() {
  const clientId = process.env.SAMSUNG_CLIENT_ID;
  const redirectUri = process.env.SAMSUNG_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "Samsung Health credentials not configured. Set SAMSUNG_CLIENT_ID and SAMSUNG_REDIRECT_URI." },
      { status: 500 },
    );
  }

  const state = generateState();
  await storeOAuthState("samsung", state);

  const authorizationUrl = new URL("https://accounts.samsung.com/account/oauth2/authorize");
  authorizationUrl.searchParams.set("client_id", clientId);
  authorizationUrl.searchParams.set("redirect_uri", redirectUri);
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("scope", "health.read");
  authorizationUrl.searchParams.set("state", state);

  return NextResponse.json({ authorizationUrl: authorizationUrl.toString() });
}
