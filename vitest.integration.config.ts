import path from "node:path";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

// Loads .env.local (and friends) into process.env for the test process —
// `npx vitest run --config vitest.integration.config.ts` does NOT pick up
// .env.local on its own, unlike `next dev`/`next build`. Without this, a
// missing POSTGRES_URL fails with a confusing ECONNREFUSED to localhost
// instead of a clear "env var not set" error.
Object.assign(process.env, loadEnv("development", process.cwd(), ""));

if (!process.env.POSTGRES_URL) {
  throw new Error(
    "POSTGRES_URL is not set. Populate .env.local or your shell environment " +
      "with POSTGRES_URL before running the integration suite: npm run test:integration"
  );
}

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.integration.test.ts"],
    setupFiles: ["./vitest.setup.ts"],
  },
});
