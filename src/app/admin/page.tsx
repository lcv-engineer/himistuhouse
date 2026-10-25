import type { Metadata } from "next";
import AdminApp from "@/components/admin/AdminApp";

export const metadata: Metadata = { title: "Quản trị Himitsu", robots: { index: false } };

export default function Admin() {
  return <AdminApp />;
}
