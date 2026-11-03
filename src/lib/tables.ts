// Sơ đồ chỗ ngồi dùng chung cho khách (chọn chỗ khi đặt bàn), server (chống đặt trùng) và admin.
// Toạ độ theo ảnh sơ đồ public/images/maps (f1: 2000×1507, f2: 2000×1545).
import type { Reservation } from "./store";

export type Seat = { id: string; kind: "circle" | "rect"; cx?: number; cy?: number; r?: number; x?: number; y?: number; w?: number; h?: number; cap: number };

const stool = (id: string, cx: number, cy: number): Seat => ({ id, kind: "circle", cx, cy, r: 40, cap: 1 });
const box = (id: string, x: number, y: number, w: number, h: number, cap: number): Seat => ({ id, kind: "rect", x, y, w, h, cap });

export const FLOORS = {
  f1: {
    w: 2000, h: 1507,
    seats: [
      stool("B1", 1223, 653), stool("B2", 1127, 653), stool("B3", 1030, 653), stool("B4", 933, 653), stool("B5", 837, 653),
      stool("B6", 743, 740), stool("B7", 743, 834), stool("B8", 743, 929), stool("B9", 743, 1024), stool("B10", 743, 1119),
      stool("B11", 1179, 1193), stool("B12", 1288, 1193), stool("B13", 1396, 1193),
      box("W1", 481, 678, 137, 104, 2), box("W2", 481, 1063, 137, 103, 2),
      box("O1", 319, 734, 82, 81, 2), box("O2", 319, 903, 82, 82, 2),
    ] as Seat[],
  },
  f2: {
    w: 2000, h: 1545,
    seats: [
      box("U2", 422, 542, 242, 112, 4), box("U3", 770, 542, 243, 112, 4), box("U4", 367, 773, 112, 299, 2),
      box("U1", 1217, 983, 145, 234, 8),
    ] as Seat[],
  },
} as const;

export const SEATS: Seat[] = [...FLOORS.f1.seats, ...FLOORS.f2.seats];
export const TABLE_IDS = SEATS.map((s) => s.id);
export const capOf = (ids: string[]) => ids.reduce((n, id) => n + (SEATS.find((s) => s.id === id)?.cap ?? 0), 0);

export const parseTables = (s?: string) =>
  Array.from(new Set((s ?? "").split(/[,\s]+/).map((x) => x.trim().toUpperCase()).filter(Boolean)));
export const validTables = (list: string[]) => list.filter((t) => TABLE_IDS.includes(t));

// Chỗ coi là đang giữ trong 2 tiếng kể từ giờ đặt: hai đặt bàn cùng chỗ cách nhau dưới 2 tiếng thì trùng.
export const HOLD_MINUTES = 120;
const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return (h || 0) * 60 + (m || 0); };

/** Các chỗ đã có người giữ quanh giờ này (bỏ qua đặt bàn đã huỷ và đặt bàn `exceptId`). */
export function busyTables(rows: Reservation[], date: string, time: string, exceptId?: string) {
  const busy = new Set<string>();
  for (const r of rows) {
    if (r.id === exceptId || r.date !== date || r.status === "cancelled" || !r.table) continue;
    if (Math.abs(toMin(r.time) - toMin(time)) < HOLD_MINUTES) parseTables(r.table).forEach((t) => busy.add(t));
  }
  return busy;
}
