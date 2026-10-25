import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "reservations.json");
const PRIVATE_FILE = path.join(process.cwd(), "data", "private-hire.json");

export type Reservation = {
  id: string; createdAt: string; name: string; phone: string;
  date: string; time: string; guests: number; note: string; status: "new" | "confirmed" | "cancelled";
  table?: string; // mã bàn, nhiều bàn cách nhau bằng dấu phẩy (vd "B1, B2")
};

export type PrivateHire = {
  id: string; createdAt: string; name: string; phone: string; date: string; guests: number; type: string; note: string; status: "new" | "done";
};

function read<T>(file: string): T[] {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return []; }
}
function write<T>(file: string, rows: T[]) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(rows, null, 2));
}

export const readAll = () => read<Reservation>(FILE);
export const writeAll = (rows: Reservation[]) => write(FILE, rows);
export const readPrivate = () => read<PrivateHire>(PRIVATE_FILE);
export const writePrivate = (rows: PrivateHire[]) => write(PRIVATE_FILE, rows);
