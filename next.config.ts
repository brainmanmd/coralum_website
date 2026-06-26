import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      // Cache static assets aggressively
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
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
