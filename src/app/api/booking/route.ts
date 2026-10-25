import { NextResponse } from "next/server";
import { findByCode, readAll, writeAll } from "@/lib/store";
import { notifyAll } from "@/lib/telegram";

// Công khai theo mã đặt bàn. Không trả về số điện thoại hay email.
export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("code") ?? "";
  const r = code ? findByCode(readAll(), code) : undefined;
  if (!r) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({
    code: r.code ?? "", name: r.name, date: r.date, time: r.time, guests: r.guests, status: r.status,
    occasion: r.occasion ?? "", seating: r.seating ?? "", taste: r.taste ?? [], note: r.note, eventTitle: r.eventTitle ?? "",
  });
}

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (b?.action !== "cancel" || !b?.code) return NextResponse.json({ error: "bad request" }, { status: 400 });
  const rows = readAll();
  const r = findByCode(rows, String(b.code));
  if (!r) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (r.status !== "cancelled") {
    writeAll(rows.map((x) => (x.id === r.id ? { ...x, status: "cancelled" as const } : x)));
    await notifyAll(`❌ Khách huỷ đặt bàn${r.code ? ` ${r.code}` : ""}\nKhách: ${r.name}\nSĐT/Zalo: ${r.phone}\nNgày giờ: ${r.date} ${r.time}\nSố khách: ${r.guests}`);
  }
  return NextResponse.json({ ok: true });
}
