import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  allowedDevOrigins: process.env.PLATFORM_DOMAIN ? [process.env.PLATFORM_DOMAIN] : ["localhost:3000"],
  // outputFileTracingRoot: path.join(__dirname, "../"),
  reactStrictMode: false,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/v3/api-docs/:path*",
        destination: `${process.env.BACKEND_INTERNAL_URL || "http://127.0.0.1:8080"}/v3/api-docs/:path*`,
      },
    ];
  },
};

export default nextConfig;