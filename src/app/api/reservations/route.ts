import { NextResponse } from "next/server";
import { readAll, writeAll, Reservation } from "@/lib/store";
import { notifyAll, reservationText } from "@/lib/telegram";

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b || !b.name || !b.phone || !b.date || !b.time) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  const row: Reservation = {
    id: crypto.randomUUID(), createdAt: new Date().toISOString(),
    name: String(b.name).slice(0, 100), phone: String(b.phone).slice(0, 30),
    date: String(b.date).slice(0, 10), time: String(b.time).slice(0, 5),
    guests: Math.max(1, Math.min(100, Number(b.guests) || 2)), note: String(b.note || "").slice(0, 500), status: "new",
  };
  writeAll([row, ...readAll()]);
  // Báo về Telegram / WhatsApp; lỗi thông báo không làm hỏng việc đặt bàn.
  await notifyAll(reservationText(row));
  return NextResponse.json({ ok: true });
}
