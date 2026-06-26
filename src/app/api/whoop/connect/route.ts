import { NextResponse } from "next/server";
import { generateState, storeOAuthState } from "@/lib/oauth/state";

export async function GET() {
  const clientId = process.env.WHOOP_CLIENT_ID;
  const redirectUri = process.env.WHOOP_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "WHOOP credentials not configured. Set WHOOP_CLIENT_ID and WHOOP_REDIRECT_URI." },
      { status: 500 },
    );
  }

  const state = generateState();
  await storeOAuthState("whoop", state);

  // WHOOP uses Hydra for OAuth. Authorization endpoint is on api.prod.whoop.com.
  const authorizationUrl = new URL("https://api.prod.whoop.com/oauth/oauth2/auth");
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("client_id", clientId);
  authorizationUrl.searchParams.set("redirect_uri", redirectUri);
  // offline scope required for refresh tokens; read:cycles is the correct scope for strain/HRV data
  authorizationUrl.searchParams.set(
    "scope",
    "offline read:profile read:recovery read:cycles read:sleep read:workout read:body_measurement",
  );
  authorizationUrl.searchParams.set("state", state);

  return NextResponse.json({ authorizationUrl: authorizationUrl.toString() });
}
