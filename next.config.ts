import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bản thử production build sang thư mục riêng (NEXT_DIST_DIR=.next-preview) để không đè lên bản đang chạy.
  distDir: process.env.NEXT_DIST_DIR || ".next",
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
