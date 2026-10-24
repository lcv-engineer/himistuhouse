import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "reservations.json");

export type Reservation = {
  id: string; createdAt: string; name: string; phone: string;
  date: string; time: string; guests: number; note: string; status: "new" | "confirmed" | "cancelled";
  table?: string; // mã bàn, nhiều bàn cách nhau bằng dấu phẩy (vd "B1, B2")
};

export function readAll(): Reservation[] {
  try { return JSON.parse(fs.readFileSync(FILE, "utf8")); } catch { return []; }
}
export function writeAll(rows: Reservation[]) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(rows, null, 2));
}
