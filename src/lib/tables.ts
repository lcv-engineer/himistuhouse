// Mã bàn hợp lệ trên sơ đồ (tầng 1: B1–B13, W1–W2, O1–O2; tầng 2: U1–U4). Dùng chung cho client và server.
export const TABLE_IDS = [
  ...Array.from({ length: 13 }, (_, i) => `B${i + 1}`),
  "W1", "W2", "O1", "O2", "U1", "U2", "U3", "U4",
];

export const parseTables = (s?: string) =>
  Array.from(new Set((s ?? "").split(/[,\s]+/).map((x) => x.trim().toUpperCase()).filter(Boolean)));

export const validTables = (list: string[]) => list.filter((t) => TABLE_IDS.includes(t));

// Một bàn coi là đang bận nếu có đặt bàn khác cùng ngày, lệch giờ dưới 3 tiếng.
export const SLOT_MINUTES = 180;
export const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};
