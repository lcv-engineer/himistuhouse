import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { cleanEdit, readAll, writeAll, STATUSES, Status } from "@/lib/store";
import { adminToken, checkLogin, clientIp, isAdmin, loginBlocked, loginFailed, loginOk } from "@/lib/auth";
import { notifyAll, telegramEnabled } from "@/lib/telegram";

// Đăng nhập (email + mật khẩu) hoặc đăng xuất ({ logout: true }).
export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (b.logout) {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete("admin");
    res.cookies.delete("admin_email");
    return res;
  }
  const ip = clientIp(req);
  if (loginBlocked(ip)) return NextResponse.json({ error: "too many attempts" }, { status: 429 });
  if (!checkLogin(String(b.email ?? ""), String(b.password ?? ""))) {
    loginFailed(ip);
    return NextResponse.json({ error: "bad login" }, { status: 401 });
  }
  loginOk(ip);
  const res = NextResponse.json({ ok: true });
  const secure = req.headers.get("x-forwarded-proto") === "https";
  const opt = { httpOnly: true, sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 7, secure };
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
    const parts = [r.telegram && `Telegram: ${r.telegram.ok ? "OK" : r.telegram.error}`].filter(Boolean);
    return NextResponse.json({ enabled: telegramEnabled(), detail: parts.length ? parts.join(" · ") : "chưa cấu hình kênh nào" });
  }
  return NextResponse.json(readAll());
}

// Đổi trạng thái và/hoặc sửa thông tin: { id, status?, patch? }
export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id, status, patch } = await req.json().catch(() => ({}));
  if (status !== undefined && !STATUSES.includes(status)) return NextResponse.json({ error: "bad status" }, { status: 400 });
  const rows = readAll();
  const cur = rows.find((r) => r.id === id);
  if (!cur) return NextResponse.json({ error: "not found" }, { status: 404 });
  const row = { ...cur, ...cleanEdit(patch), ...(status ? { status: status as Status } : {}) };
  writeAll(rows.map((r) => (r.id === id ? row : r)));
  return NextResponse.json({ ok: true, row });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await req.json().catch(() => ({}));
  writeAll(readAll().filter((r) => r.id !== id));
  return NextResponse.json({ ok: true });
}
