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

export const findByCode = (rows: Reservation[], code: string) => {
  const c = code.trim().toUpperCase();
  return rows.find((r) => r.code === c || r.id === code.trim());
};
