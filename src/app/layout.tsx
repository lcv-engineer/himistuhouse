import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

// Chữ dùng Arial theo phông của logo (khai báo trong globals.css), không tải font ngoài.
export const metadata: Metadata = {
  title: "Himitsu – house of cocktail",
  description: "Himitsu house of cocktail – a hidden cocktail bar in Tan Dinh, Saigon.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  );
}
