import { createHash } from "crypto";
import { cookies } from "next/headers";

export const adminPassword = () => process.env.ADMIN_PASSWORD || "himitsu-admin";
// Nếu đặt ADMIN_EMAIL trong .env.local thì email đăng nhập phải khớp; không đặt thì chỉ cần đúng mật khẩu.
export const adminEmail = () => (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
export const adminToken = () => createHash("sha256").update("himitsu:" + adminPassword()).digest("hex");

export function checkLogin(email: string, password: string) {
  const want = adminEmail();
  return password === adminPassword() && (!want || email.trim().toLowerCase() === want);
}

export async function isAdmin() {
  return (await cookies()).get("admin")?.value === adminToken();
}
