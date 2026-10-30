import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { CONTENT_FILE, readContentFile } from "@/lib/content-server";
import { DEFAULTS } from "@/lib/content";

const deny = () => NextResponse.json({ error: "unauthorized" }, { status: 401 });

export async function GET() {
  if (!(await isAdmin())) return deny();
  return NextResponse.json(readContentFile());
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return deny();
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || !body.site || !Array.isArray(body.menu) || !Array.isArray(body.events)) {
    return NextResponse.json({ error: "invalid content" }, { status: 400 });
  }
  fs.mkdirSync(path.dirname(CONTENT_FILE), { recursive: true });
  // Giữ lại bản trước đó phòng khi lỡ tay xoá nhầm (chỉ một bản, bản mới ghi đè bản cũ).
  try { fs.copyFileSync(CONTENT_FILE, CONTENT_FILE.replace(/\.json$/, ".bak.json")); } catch { /* chưa có file */ }
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(body, null, 2));
  return NextResponse.json({ ok: true });
}

// Khôi phục nội dung mặc định
export async function DELETE() {
  if (!(await isAdmin())) return deny();
  try { fs.unlinkSync(CONTENT_FILE); } catch { /* không có file */ }
  return NextResponse.json(DEFAULTS);
}
