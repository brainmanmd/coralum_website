import { createSign } from "node:crypto";

/**
 * Apple Sign In with Apple requires a client_secret that is a signed JWT, not a static string.
 *
 * Required environment variables:
 *   APPLE_TEAM_ID       — 10-character Team ID from Apple Developer portal
 *   APPLE_KEY_ID        — Key ID of the ES256 private key
 *   APPLE_PRIVATE_KEY   — PEM-encoded ES256 private key (replace literal \n with newlines)
 *   APPLE_CLIENT_ID     — Service ID (reverse-domain, e.g. "com.yourapp.service")
 *
 * The JWT is valid for up to 6 months; we generate a fresh one per request so the
 * deployment never silently holds an expired secret.
 */
export function generateAppleClientSecret(): string {
  const teamId = process.env.APPLE_TEAM_ID;
  const keyId = process.env.APPLE_KEY_ID;
  const privateKey = process.env.APPLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const clientId = process.env.APPLE_CLIENT_ID;

  if (!teamId || !keyId || !privateKey || !clientId) {
    throw new Error(
      "Apple JWT secret requires APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY, and APPLE_CLIENT_ID.",
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "ES256", kid: keyId })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      iss: teamId,
      iat: now,
      exp: now + 60 * 60 * 24 * 180, // 180 days (Apple's maximum)
      aud: "https://appleid.apple.com",
      sub: clientId,
    }),
  ).toString("base64url");

  const signingInput = `${header}.${payload}`;
  const sign = createSign("SHA256");
  sign.update(signingInput);
  const signature = sign.sign({ key: privateKey, dsaEncoding: "ieee-p1363" }, "base64url");

  return `${signingInput}.${signature}`;
}
