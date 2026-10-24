import { NextResponse } from "next/server";
import { readAll, writeAll, Reservation } from "@/lib/store";

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b || !b.name || !b.phone || !b.date || !b.time) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  const row: Reservation = {
    id: crypto.randomUUID(), createdAt: new Date().toISOString(),
    name: String(b.name).slice(0, 100), phone: String(b.phone).slice(0, 30),
    date: String(b.date), time: String(b.time),
    guests: Math.max(1, Math.min(100, Number(b.guests) || 2)), note: String(b.note || "").slice(0, 500), status: "new",
  };
  writeAll([row, ...readAll()]);
  return NextResponse.json({ ok: true });
}
