import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readAll, writeAll } from "@/lib/store";

const PASS = () => process.env.ADMIN_PASSWORD || "himitsu-admin";

async function authed() {
  return (await cookies()).get("admin")?.value === PASS();
}

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  if (b.password !== PASS()) return NextResponse.json({ error: "bad password" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin", PASS(), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
}

export async function GET() {
  if (!(await authed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(readAll());
}

export async function PATCH(req: Request) {
  if (!(await authed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id, status } = await req.json();
  writeAll(readAll().map((r) => (r.id === id ? { ...r, status } : r)));
  return NextResponse.json({ ok: true });
}
