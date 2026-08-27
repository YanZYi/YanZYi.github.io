import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出，用于 GitHub Pages 部署
  output: "export",
  // 静态导出不支持 next/image 优化
  images: { unoptimized: true },
  // 生成 /path/index.html，兼容 GitHub Pages
  trailingSlash: true,
};

export default nextConfig;
