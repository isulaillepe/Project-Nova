import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Allow cross-origin requests for HMR and assets when accessing via IP
  allowedDevOrigins: ["192.168.80.173", "172.20.10.2", "localhost", "127.0.0.1"],
  // Ensure proper asset prefixes
  assetPrefix: "",
};

export default nextConfig;