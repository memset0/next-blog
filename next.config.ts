import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出
  output: "export",
  distDir: "dist",
  trailingSlash: true, // Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`

  reactStrictMode: true,
};

export default nextConfig;
