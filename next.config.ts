import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost:3000", "192.168.100.19:3000", "192.168.100.19"],
};

export default nextConfig;
