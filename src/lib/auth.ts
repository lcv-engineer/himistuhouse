import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const adminPassword = () => process.env.ADMIN_PASSWORD || "himitsu-admin";
// Nếu đặt ADMIN_EMAIL trong .env.local thì email đăng nhập phải khớp; không đặt thì chỉ cần đúng mật khẩu.
export const adminEmail = () => (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
export const adminToken = () => createHash("sha256").update("himitsu:" + adminPassword()).digest("hex");

const digest = (s: string) => createHash("sha256").update(s).digest();
const same = (a: string, b: string) => timingSafeEqual(digest(a), digest(b));

export function checkLogin(email: string, password: string) {
  const want = adminEmail();
  const okPass = same(password, adminPassword());
  const okMail = !want || same(email.trim().toLowerCase(), want);
  return okPass && okMail;
}

// Giới hạn thử sai: quá MAX lần trong WINDOW thì khoá IP đó tới khi hết cửa sổ. Lưu trong bộ nhớ, khởi động lại là xoá.
const WINDOW = 15 * 60_000;
const MAX = 8;
const fails = new Map<string, { n: number; at: number }>();
export const loginBlocked = (ip: string) => {
  const f = fails.get(ip);
  return !!f && Date.now() - f.at < WINDOW && f.n >= MAX;
};
export const loginFailed = (ip: string) => {
  const now = Date.now();
  const f = fails.get(ip);
  fails.set(ip, f && now - f.at < WINDOW ? { n: f.n + 1, at: now } : { n: 1, at: now });
};
export const loginOk = (ip: string) => void fails.delete(ip);
export const clientIp = (req: Request) =>
  req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";

export async function isAdmin() {
  return (await cookies()).get("admin")?.value === adminToken();
}
