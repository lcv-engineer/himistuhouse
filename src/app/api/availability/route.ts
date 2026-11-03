import { NextResponse } from "next/server";
import { readAll } from "@/lib/store";
import { busyTables } from "@/lib/tables";

// Công khai: chỉ trả về mã chỗ đã có người giữ, không có thông tin khách.
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const date = q.get("date") ?? "";
  const time = q.get("time") ?? "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return NextResponse.json({ taken: [] });
  return NextResponse.json({ taken: [...busyTables(readAll(), date, time)] }, { headers: { "cache-control": "no-store" } });
}
