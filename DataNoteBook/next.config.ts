import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://20.215.236.82/api/:path*",
      },
    ];
  },
};

export default nextConfig;

