import { NextResponse } from "next/server";
import { readAll, writeAll } from "@/lib/store";
import { notifyAll } from "@/lib/telegram";

const UUID = /^[0-9a-f-]{36}$/i;

// Công khai theo mã đặt bàn (UUID khó đoán). Không trả về số điện thoại.
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!UUID.test(id)) return NextResponse.json({ error: "not found" }, { status: 404 });
  const r = readAll().find((x) => x.id === id);
  if (!r) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ name: r.name, date: r.date, time: r.time, guests: r.guests, table: r.table ?? "", status: r.status, note: r.note });
}

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  const id = String(b?.id ?? "");
  if (!UUID.test(id) || b?.action !== "cancel") return NextResponse.json({ error: "bad request" }, { status: 400 });
  const rows = readAll();
  const r = rows.find((x) => x.id === id);
  if (!r) return NextResponse.json({ error: "not found" }, { status: 404 });
  if (r.status !== "cancelled") {
    writeAll(rows.map((x) => (x.id === id ? { ...x, status: "cancelled" as const } : x)));
    await notifyAll(`❌ Khách huỷ đặt bàn\nKhách: ${r.name}\nSĐT/Zalo: ${r.phone}\nNgày giờ: ${r.date} ${r.time}\nSố khách: ${r.guests}${r.table ? `\nChỗ: ${r.table}` : ""}`);
  }
  return NextResponse.json({ ok: true });
}
