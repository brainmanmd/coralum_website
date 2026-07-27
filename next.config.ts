import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the Cloud Run container image
  output: "standalone",

  // Don't advertise the framework in response headers
  poweredByHeader: false,

  // Optimize images and third-party scripts
  images: {
    unoptimized: false,
    formats: ["image/webp", "image/avif"],
  },

  // Enable headers for security and caching
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
      // Note: /_next/static/:path* is NOT overridden here — Next.js already
      // sets immutable, far-future Cache-Control on hashed build assets, and
      // a custom override breaks dev-mode behavior (warned at build time).
    ];
  },

  // Redirect old paths if needed
  async redirects() {
    return [];
  },

  // Rewrite internal routes if needed
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },

  // TypeScript strict mode is recommended
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },

  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: ["@testing-library/react"],
  },
};

export default nextConfig;
