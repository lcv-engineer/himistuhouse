import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bản thử production build sang thư mục riêng (NEXT_DIST_DIR=.next-preview) để không đè lên bản đang chạy.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Tên miền chính là himitsubar.com; tên miền cũ (đặt nhầm tên) và www chuyển hướng vĩnh viễn sang đó, giữ nguyên đường dẫn.
  async redirects() {
    return ["himistuhousebar.com", "www.himistuhousebar.com", "www.himitsubar.com"].map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host }],
      destination: "https://himitsubar.com/:path*",
      permanent: true,
    }));
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
