// Sơ đồ chỗ ngồi dùng chung cho khách (chọn chỗ khi đặt bàn), server (chống đặt trùng) và admin.
// Vị trí vẽ trên ảnh sơ đồ nằm ở seatgeo.ts (mỗi ảnh một toạ độ riêng).
import type { Reservation } from "./store";
import { toMin } from "./time"; // giờ sau nửa đêm (00:00–04:59) tính là cùng đêm nên cộng 24h

export type Seat = { id: string; cap: number };

const s = (id: string, cap: number): Seat => ({ id, cap });

export const FLOORS = {
  f1: { seats: [...Array.from({ length: 13 }, (_, i) => s(`B${i + 1}`, 1)), s("W1", 2), s("W2", 2), s("O1", 2), s("O2", 2)] },
  f2: { seats: [s("U2", 4), s("U3", 4), s("U4", 2), s("U1", 8)] },
} as const;

export const SEATS: Seat[] = [...FLOORS.f1.seats, ...FLOORS.f2.seats];
export const TABLE_IDS = SEATS.map((s) => s.id);
export const capOf = (ids: string[]) => ids.reduce((n, id) => n + (SEATS.find((s) => s.id === id)?.cap ?? 0), 0);

export const parseTables = (s?: string) =>
  Array.from(new Set((s ?? "").split(/[,\s]+/).map((x) => x.trim().toUpperCase()).filter(Boolean)));
export const validTables = (list: string[]) => list.filter((t) => TABLE_IDS.includes(t));

// Chỗ coi là đang giữ trong 2 tiếng kể từ giờ đặt: hai đặt bàn cùng chỗ cách nhau dưới 2 tiếng thì trùng.
export const HOLD_MINUTES = 120;

/** Các chỗ đã có người giữ quanh giờ này (bỏ qua đặt bàn đã huỷ và đặt bàn `exceptId`). */
export function busyTables(rows: Reservation[], date: string, time: string, exceptId?: string) {
  const busy = new Set<string>();
  for (const r of rows) {
    if (r.id === exceptId || r.date !== date || r.status === "cancelled" || !r.table) continue;
    if (Math.abs(toMin(r.time) - toMin(time)) < HOLD_MINUTES) parseTables(r.table).forEach((t) => busy.add(t));
  }
  return busy;
}
