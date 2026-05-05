import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["waitlist.frameonx.xyz", "localhost:3000"],
    },
  },
};

export default nextConfig;
