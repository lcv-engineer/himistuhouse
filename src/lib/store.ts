import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "reservations.json");

export type Status = "new" | "confirmed" | "cancelled" | "arrived" | "noshow";
export const STATUSES: Status[] = ["new", "confirmed", "cancelled", "arrived", "noshow"];

export type Reservation = {
  id: string; createdAt: string; name: string; phone: string;
  date: string; time: string; guests: number; note: string; status: Status;
  code?: string; // mã đặt bàn khách dùng để xem/huỷ (bản cũ chỉ có id)
  email?: string;
  occasion?: string; seating?: string; taste?: string[];
  event?: string; // id sự kiện nếu khách giữ chỗ cho sự kiện
  eventTitle?: string;
  lang?: string;
  source?: "admin"; // đặt bàn do nhân viên nhập tay (khách gọi điện, walk-in)
  table?: string; // dữ liệu cũ từ sơ đồ chỗ ngồi
};

export function readAll(): Reservation[] {
  try { return JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { return []; }
}
export function writeAll(rows: Reservation[]) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(rows, null, 2));
}

// Mã 10 ký tự, bỏ các ký tự dễ nhầm (0/O, 1/I).
const ABC = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function newCode(taken: Set<string>) {
  for (;;) {
    const bytes = crypto.getRandomValues(new Uint8Array(10));
    const c = Array.from(bytes, (b) => ABC[b % ABC.length]).join("");
    if (!taken.has(c)) return c;
  }
}

const str = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);

/** Lọc các trường nhân viên được phép nhập/sửa; trường nào thiếu hoặc sai thì bỏ qua. */
export function cleanEdit(b: Record<string, unknown> | null | undefined): Partial<Reservation> {
  const out: Partial<Reservation> = {};
  if (!b) return out;
  if (b.name !== undefined && str(b.name, 100)) out.name = str(b.name, 100);
  if (b.phone !== undefined) out.phone = str(b.phone, 30);
  if (b.email !== undefined) out.email = str(b.email, 120) || undefined;
  if (typeof b.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(b.date)) out.date = b.date;
  if (typeof b.time === "string" && /^\d{2}:\d{2}$/.test(b.time)) out.time = b.time;
  if (b.guests !== undefined) out.guests = Math.max(1, Math.min(60, Math.round(Number(b.guests)) || 1));
  if (b.note !== undefined) out.note = str(b.note, 280);
  if (b.seating !== undefined) out.seating = str(b.seating, 60) || undefined;
  if (b.occasion !== undefined) out.occasion = str(b.occasion, 60) || undefined;
  return out;
}

export const findByCode =(rows: Reservation[], code: string) => {
  const c = code.trim().toUpperCase();
  return rows.find((r) => r.code === c || r.id === code.trim());
};

// Yêu cầu thuê riêng (popup ở trang Liên hệ).
const PH_FILE = path.join(process.cwd(), "data", "private-hire.json");
export type PrivateHire = {
  id: string; createdAt: string; name: string; phone: string;
  date: string; guests: number; type: string; note: string; status: "new" | "done";
};
export function readPrivate(): PrivateHire[] {
  try { return JSON.parse(fs.readFileSync(PH_FILE, "utf8")); } catch { return []; }
}
export function writePrivate(rows: PrivateHire[]) {
  fs.mkdirSync(path.dirname(PH_FILE), { recursive: true });
  fs.writeFileSync(PH_FILE, JSON.stringify(rows, null, 2));
}
