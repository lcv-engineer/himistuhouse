import { NextResponse } from "next/server";
import { PrivateHire, readPrivate, writePrivate } from "@/lib/store";
import { notifyAll } from "@/lib/telegram";

const str = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  const name = str(b?.name, 100);
  const phone = str(b?.phone, 30);
  if (!name || phone.replace(/\D/g, "").length < 8) return NextResponse.json({ error: "missing fields" }, { status: 400 });
  const date = str(b?.date, 10);
  const row: PrivateHire = {
    id: crypto.randomUUID(), createdAt: new Date().toISOString(), name, phone,
    date: /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "", guests: Math.max(1, Math.min(500, Number(b?.guests) || 10)),
    type: str(b?.type, 100), note: str(b?.note, 800), status: "new",
  };
  writePrivate([row, ...readPrivate()]);
  // Báo về Telegram; lỗi thông báo không làm hỏng yêu cầu.
  await notifyAll(
    [
      "🥂 Yêu cầu thuê riêng – Himitsu",
      `Khách: ${row.name}`,
      `SĐT/Zalo: ${row.phone}`,
      row.date ? `Ngày dự kiến: ${row.date}` : "",
      `Số khách: ${row.guests}`,
      row.type ? `Dịp: ${row.type}` : "",
      row.note ? `Ghi chú: ${row.note}` : "",
    ].filter(Boolean).join("\n"),
  );
  return NextResponse.json({ ok: true });
}
