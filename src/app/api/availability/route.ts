import { NextResponse } from "next/server";
import { readAll } from "@/lib/store";
import { SLOT_MINUTES, parseTables, toMinutes } from "@/lib/tables";

// Công khai: chỉ trả về mã bàn đã bận, không có thông tin khách.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const date = url.searchParams.get("date") ?? "";
  const time = url.searchParams.get("time") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return NextResponse.json({ taken: [] });
  const t0 = toMinutes(time);
  const taken = new Set<string>();
  for (const r of readAll()) {
    if (r.date !== date || r.status === "cancelled" || !r.table) continue;
    if (Math.abs(toMinutes(r.time) - t0) < SLOT_MINUTES) parseTables(r.table).forEach((t) => taken.add(t));
  }
  return NextResponse.json({ taken: [...taken] });
}
