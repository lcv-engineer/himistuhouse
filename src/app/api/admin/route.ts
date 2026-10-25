import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readAll, writeAll, STATUSES, Status } from "@/lib/store";
import { adminToken, checkLogin, isAdmin } from "@/lib/auth";
import { notifyAll, telegramEnabled, whatsappEnabled } from "@/lib/telegram";

// Đăng nhập (email + mật khẩu) hoặc đăng xuất ({ logout: true }).
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (b.logout) {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete("admin");
    res.cookies.delete("admin_email");
    return res;
  }
  if (!checkLogin(String(b.email ?? ""), String(b.password ?? ""))) return NextResponse.json({ error: "bad login" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  const opt = { httpOnly: true, sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 7 };
  res.cookies.set("admin", adminToken(), opt);
  res.cookies.set("admin_email", String(b.email ?? "").slice(0, 120), opt);
  return res;
}

export async function GET(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const q = new URL(req.url).searchParams;
  if (q.get("me")) return NextResponse.json({ email: (await cookies()).get("admin_email")?.value ?? "" });
  // ?telegram=test gửi tin thử và trả kết quả
  if (q.get("telegram") === "test") {
    const r = await notifyAll("✅ Himitsu: kết nối thông báo hoạt động.");
    const parts = [r.telegram && `Telegram: ${r.telegram.ok ? "OK" : r.telegram.error}`, r.whatsapp && `WhatsApp: ${r.whatsapp.ok ? "OK" : r.whatsapp.error}`].filter(Boolean);
    return NextResponse.json({ enabled: telegramEnabled() || whatsappEnabled(), detail: parts.length ? parts.join(" · ") : "chưa cấu hình kênh nào" });
  }
  return NextResponse.json(readAll());
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id, status } = await req.json();
  if (!STATUSES.includes(status)) return NextResponse.json({ error: "bad status" }, { status: 400 });
  writeAll(readAll().map((r) => (r.id === id ? { ...r, status: status as Status } : r)));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await req.json();
  writeAll(readAll().filter((r) => r.id !== id));
  return NextResponse.json({ ok: true });
}
