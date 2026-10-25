import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { readPrivate, writePrivate } from "@/lib/store";

const deny = () => NextResponse.json({ error: "unauthorized" }, { status: 401 });

export async function GET() {
  if (!(await isAdmin())) return deny();
  return NextResponse.json(readPrivate());
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return deny();
  const { id, status } = await req.json();
  writePrivate(readPrivate().map((r) => (r.id === id && (status === "new" || status === "done") ? { ...r, status } : r)));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return deny();
  const { id } = await req.json();
  writePrivate(readPrivate().filter((r) => r.id !== id));
  return NextResponse.json({ ok: true });
}
