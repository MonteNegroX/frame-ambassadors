import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: ["192.168.2.122", "localhost:3000", "localhost"],
  experimental: {
    serverActions: {
      allowedOrigins: ["waitlist.frameonx.xyz", "localhost:3000", "192.168.2.122:3000"],
    },
  },
};

export default nextConfig;
