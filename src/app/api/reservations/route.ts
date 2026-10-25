import { NextResponse } from "next/server";
import { readAll, writeAll, Reservation } from "@/lib/store";
import { notifyAll, reservationText } from "@/lib/telegram";
import { SLOT_MINUTES, parseTables, toMinutes, validTables } from "@/lib/tables";

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b || !b.name || !b.phone || !b.date || !b.time) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  const date = String(b.date).slice(0, 10);
  const time = String(b.time).slice(0, 5);
  const wanted = validTables(parseTables(String(b.table ?? "")));

  const existing = readAll();
  // Chỗ khách chọn không được trùng đặt bàn khác cùng khung giờ.
  const busy = new Set<string>();
  for (const r of existing) {
    if (r.date !== date || r.status === "cancelled" || !r.table) continue;
    if (Math.abs(toMinutes(r.time) - toMinutes(time)) < SLOT_MINUTES) parseTables(r.table).forEach((t) => busy.add(t));
  }
  const clash = wanted.filter((t) => busy.has(t));
  if (clash.length) return NextResponse.json({ error: "taken", taken: clash }, { status: 409 });

  const row: Reservation = {
    id: crypto.randomUUID(), createdAt: new Date().toISOString(),
    name: String(b.name).slice(0, 100), phone: String(b.phone).slice(0, 30),
    date, time,
    guests: Math.max(1, Math.min(100, Number(b.guests) || 2)), note: String(b.note || "").slice(0, 500), status: "new",
    ...(wanted.length ? { table: wanted.join(", ") } : {}),
  };
  writeAll([row, ...existing]);
  // Báo về Telegram / WhatsApp; lỗi thông báo không làm hỏng việc đặt bàn.
  await notifyAll(reservationText(row));
  return NextResponse.json({ ok: true, id: row.id });
}
