import { NextResponse } from "next/server";
import { generateState, storeOAuthState } from "@/lib/oauth/state";

export async function GET() {
  const clientId = process.env.APPLE_CLIENT_ID;
  const redirectUri = process.env.APPLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: "Apple credentials not configured. Set APPLE_CLIENT_ID and APPLE_REDIRECT_URI." },
      { status: 500 },
    );
  }

  const state = generateState();
  await storeOAuthState("apple", state);

  // Apple requires response_mode=form_post, which means the callback arrives as a POST.
  const authorizationUrl = new URL("https://appleid.apple.com/auth/authorize");
  authorizationUrl.searchParams.set("response_type", "code");
  authorizationUrl.searchParams.set("client_id", clientId);
  authorizationUrl.searchParams.set("redirect_uri", redirectUri);
  authorizationUrl.searchParams.set("scope", "name email");
  authorizationUrl.searchParams.set("response_mode", "form_post");
  authorizationUrl.searchParams.set("state", state);

  return NextResponse.json({ authorizationUrl: authorizationUrl.toString() });
}
