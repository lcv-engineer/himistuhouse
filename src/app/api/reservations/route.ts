import { NextResponse } from "next/server";
import { newCode, readAll, writeAll, Reservation } from "@/lib/store";
import { notifyAll, reservationText } from "@/lib/telegram";
import { readContentFile } from "@/lib/content-server";

const str = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  const name = str(b?.name, 100);
  const phone = str(b?.phone, 30);
  if (!name || phone.replace(/\D/g, "").length < 8) return NextResponse.json({ error: "missing fields" }, { status: 400 });

  let date = str(b?.date, 10);
  let time = str(b?.time, 5);
  let event: Reservation["event"];
  let eventTitle: string | undefined;
  // Giữ chỗ sự kiện: ngày giờ lấy từ chính sự kiện, không tin dữ liệu khách gửi.
  if (b?.event) {
    const ev = readContentFile().events.find((e) => e.id === b.event && e.published && e.rsvp);
    if (!ev) return NextResponse.json({ error: "event not found" }, { status: 404 });
    ({ date, start: time } = ev);
    event = ev.id;
    eventTitle = ev.title.vi;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return NextResponse.json({ error: "bad date" }, { status: 400 });

  const rows = readAll();
  const row: Reservation = {
    id: crypto.randomUUID(), code: newCode(new Set(rows.map((r) => r.code ?? ""))), createdAt: new Date().toISOString(),
    name, phone, email: str(b?.email, 120) || undefined,
    date, time, guests: Math.max(1, Math.min(30, Number(b?.guests) || 2)),
    occasion: str(b?.occasion, 60) || undefined, seating: str(b?.seating, 60) || undefined,
    taste: Array.isArray(b?.taste) ? b.taste.slice(0, 6).map((x: unknown) => str(x, 40)).filter(Boolean) : undefined,
    note: str(b?.note, 280), status: "confirmed", event, eventTitle, lang: b?.lang === "vi" ? "vi" : "en",
  };
  writeAll([row, ...rows]);
  // Báo về Telegram; lỗi thông báo không làm hỏng việc đặt bàn.
  await notifyAll(reservationText(row));
  return NextResponse.json({ ok: true, code: row.code });
}
