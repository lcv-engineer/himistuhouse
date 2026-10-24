import { NextResponse } from "next/server";
import { readAll, writeAll } from "@/lib/store";
import { adminPassword, adminToken, isAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (b.password !== adminPassword()) return NextResponse.json({ error: "bad password" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin", adminToken(), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(readAll());
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id, status } = await req.json();
  writeAll(readAll().map((r) => (r.id === id ? { ...r, status } : r)));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await req.json();
  writeAll(readAll().filter((r) => r.id !== id));
  return NextResponse.json({ ok: true });
}
