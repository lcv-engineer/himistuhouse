import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");
const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif", gif: "image/gif" };

export async function GET(_: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!/^[\w.-]+$/.test(file) || file.includes("..")) return new NextResponse("not found", { status: 404 });
  const type = TYPES[file.split(".").pop() ?? ""];
  try {
    const buf = fs.readFileSync(path.join(UPLOAD_DIR, file));
    return new NextResponse(buf, { headers: { "content-type": type ?? "application/octet-stream", "cache-control": "public, max-age=31536000, immutable" } });
  } catch {
    return new NextResponse("not found", { status: 404 });
  }
}
