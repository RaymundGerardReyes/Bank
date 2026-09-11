import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/api/onboard",
        destination: "/api",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
