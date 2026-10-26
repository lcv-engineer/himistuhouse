import type { Metadata } from "next";
import AdminApp from "@/components/admin/AdminApp";

export const metadata: Metadata = { title: "Quản trị Himitsu", robots: { index: false } };

export function generateStaticParams() {
  return ["login", "events", "menu", "promotions", "secrets", "pages", "private", "gallery", "settings"].map((tab) => ({ tab }));
}

// Mục cụ thể được AdminApp đọc từ đường dẫn.
export default function AdminTab() {
  return <AdminApp />;
}
