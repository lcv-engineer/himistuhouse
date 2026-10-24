import { NextResponse } from "next/server";
import { readAll, writeAll } from "@/lib/store";
import { adminPassword, adminToken, isAdmin } from "@/lib/auth";
import { sendTelegram, telegramEnabled } from "@/lib/telegram";

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (b.password !== adminPassword()) return NextResponse.json({ error: "bad password" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin", adminToken(), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
}

export async function GET(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  // ?telegram=test gửi tin thử và trả kết quả
  if (new URL(req.url).searchParams.get("telegram") === "test") {
    const r = await sendTelegram("✅ Himitsu: kết nối Telegram hoạt động.");
    return NextResponse.json({ enabled: telegramEnabled(), ...r });
  }
  return NextResponse.json(readAll());
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id, status, table } = await req.json();
  writeAll(readAll().map((r) => {
    if (r.id !== id) return r;
    const next = { ...r };
    if (status === "new" || status === "confirmed" || status === "cancelled") next.status = status;
    if (typeof table === "string") next.table = table.slice(0, 60);
    return next;
  }));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await req.json();
  writeAll(readAll().filter((r) => r.id !== id));
  return NextResponse.json({ ok: true });
}
