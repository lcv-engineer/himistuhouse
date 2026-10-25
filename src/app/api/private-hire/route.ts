import { NextResponse } from "next/server";
import { PrivateHire, readPrivate, writePrivate } from "@/lib/store";
import { notifyAll } from "@/lib/telegram";

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b || !b.name || !b.phone) return NextResponse.json({ error: "missing fields" }, { status: 400 });
  const row: PrivateHire = {
    id: crypto.randomUUID(), createdAt: new Date().toISOString(),
    name: String(b.name).slice(0, 100), phone: String(b.phone).slice(0, 30),
    date: String(b.date ?? "").slice(0, 10), guests: Math.max(1, Math.min(500, Number(b.guests) || 10)),
    type: String(b.type ?? "").slice(0, 100), note: String(b.note ?? "").slice(0, 800), status: "new",
  };
  writePrivate([row, ...readPrivate()]);
  await notifyAll(
    [
      "🥂 Yêu cầu thuê riêng – Himitsu",
      `Khách: ${row.name}`,
      `SĐT/Zalo: ${row.phone}`,
      row.date ? `Ngày dự kiến: ${row.date}` : "",
      `Số khách: ${row.guests}`,
      row.type ? `Loại sự kiện: ${row.type}` : "",
      row.note ? `Ghi chú: ${row.note}` : "",
    ].filter(Boolean).join("\n"),
  );
  return NextResponse.json({ ok: true });
}
