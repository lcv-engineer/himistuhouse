import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { cleanEdit, newCode, readAll, writeAll, Reservation } from "@/lib/store";

// Nhân viên nhập đặt bàn tay (khách gọi điện, walk-in). Không báo Telegram vì chính nhân viên vừa nhập.
export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const e = cleanEdit(await req.json().catch(() => null));
  if (!e.name || !e.date || !e.time) return NextResponse.json({ error: "missing fields" }, { status: 400 });
  const rows = readAll();
  const row: Reservation = {
    id: crypto.randomUUID(), code: newCode(new Set(rows.map((r) => r.code ?? ""))), createdAt: new Date().toISOString(),
    name: e.name, phone: e.phone ?? "", email: e.email, date: e.date, time: e.time, guests: e.guests ?? 2,
    seating: e.seating, occasion: e.occasion, note: e.note ?? "", status: "confirmed", source: "admin",
  };
  writeAll([row, ...rows]);
  return NextResponse.json({ ok: true, row });
}
