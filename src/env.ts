/**
 * Type-safe environment variable access.
 * Ensures all required OAuth provider credentials are present at compile time.
 */

const requiredEnvVars = {
  // Oura
  OURA_CLIENT_ID: process.env.OURA_CLIENT_ID,
  OURA_CLIENT_SECRET: process.env.OURA_CLIENT_SECRET,
  OURA_REDIRECT_URI: process.env.OURA_REDIRECT_URI,

  // Whoop
  WHOOP_CLIENT_ID: process.env.WHOOP_CLIENT_ID,
  WHOOP_CLIENT_SECRET: process.env.WHOOP_CLIENT_SECRET,
  WHOOP_REDIRECT_URI: process.env.WHOOP_REDIRECT_URI,

  // Fitbit
  FITBIT_CLIENT_ID: process.env.FITBIT_CLIENT_ID,
  FITBIT_CLIENT_SECRET: process.env.FITBIT_CLIENT_SECRET,
  FITBIT_REDIRECT_URI: process.env.FITBIT_REDIRECT_URI,

  // Google
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,

  // Apple
  APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
  APPLE_CLIENT_SECRET: process.env.APPLE_CLIENT_SECRET,
  APPLE_REDIRECT_URI: process.env.APPLE_REDIRECT_URI,
  APPLE_TEAM_ID: process.env.APPLE_TEAM_ID,
  APPLE_KEY_ID: process.env.APPLE_KEY_ID,
  APPLE_PRIVATE_KEY: process.env.APPLE_PRIVATE_KEY,

  // Samsung
  SAMSUNG_CLIENT_ID: process.env.SAMSUNG_CLIENT_ID,
  SAMSUNG_CLIENT_SECRET: process.env.SAMSUNG_CLIENT_SECRET,
  SAMSUNG_REDIRECT_URI: process.env.SAMSUNG_REDIRECT_URI,
} as const;

export type Env = typeof requiredEnvVars;

/**
 * Validates that a specific environment variable is present.
 * Used in API routes that may not need all providers to be configured.
 */
export function getEnv<K extends keyof Env>(key: K): Env[K] {
  const value = requiredEnvVars[key];
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export default requiredEnvVars;
