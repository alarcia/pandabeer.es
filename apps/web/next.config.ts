import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a self-contained server bundle (.next/standalone with server.js + a minimal
  // node_modules) so the Docker runtime stage stays tiny. See apps/web/Dockerfile.
  output: "standalone",
};

export default nextConfig;
