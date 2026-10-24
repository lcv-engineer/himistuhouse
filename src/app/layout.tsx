import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({ subsets: ["latin", "vietnamese"], weight: ["400", "500", "600"], variable: "--font-display", display: "swap" });
const sans = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Himitsu – house of cocktail",
  description: "Himitsu house of cocktail – a hidden cocktail bar in Saigon.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
