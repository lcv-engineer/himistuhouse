import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");
const OK = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif", "image/gif": "gif" };

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File) || !OK.has(file.type)) return NextResponse.json({ error: "chỉ nhận ảnh jpg/png/webp/avif/gif" }, { status: 400 });
  if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: "ảnh quá lớn (tối đa 10MB)" }, { status: 400 });
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  const name = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${EXT[file.type]}`;
  fs.writeFileSync(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ src: `/api/media/${name}` });
}
