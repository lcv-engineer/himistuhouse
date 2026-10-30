import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { readAll, readPrivate } from "@/lib/store";
import { nightDate } from "@/lib/time";

// Số liệu nhỏ cho các huy hiệu trên thanh điều hướng admin.
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const date = nightDate();
  const tonight = readAll().filter((r) => r.date === date && r.status !== "cancelled");
  return NextResponse.json({
    tonight: { bookings: tonight.length, guests: tonight.reduce((s, r) => s + r.guests, 0) },
    privateNew: readPrivate().filter((r) => r.status === "new").length,
  });
}
