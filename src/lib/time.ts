// Giờ giấc theo múi giờ Việt Nam. Dùng chung cho client và server.
import type { Hours, Lang } from "./content";

const TZ = "Asia/Ho_Chi_Minh";

/** "17:30" -> phút; giờ trước 5h sáng coi là cùng "đêm" nên cộng 24h. */
export const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const v = (h || 0) * 60 + (m || 0);
  return (h || 0) < 5 ? v + 1440 : v;
};
const fromMin = (v: number) => `${String(Math.floor(v / 60) % 24).padStart(2, "0")}:${String(v % 60).padStart(2, "0")}`;

/** "17:30" -> "5:30PM", "17:00" -> "5PM" */
export const fmt12 = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}${m ? `:${String(m).padStart(2, "0")}` : ""}${h < 12 ? "AM" : "PM"}`;
};

export function vnNow() {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
      .formatToParts(new Date()).map((x) => [x.type, x.value]),
  );
  return { date: `${p.year}-${p.month}-${p.day}`, min: Number(p.hour) * 60 + Number(p.minute) };
}

export const addDays = (d: string, n: number) => {
  const x = new Date(`${d}T12:00:00Z`);
  x.setUTCDate(x.getUTCDate() + n);
  return x.toISOString().slice(0, 10);
};
/** 0 = Thứ Hai … 6 = Chủ nhật */
export const weekday = (d: string) => (new Date(`${d}T12:00:00Z`).getUTCDay() + 6) % 7;
export const mondayOf = (d: string) => addDays(d, -weekday(d));

const LOCALE: Record<Lang, string> = { vi: "vi-VN", en: "en-US" };
export const fmtDate = (d: string, lang: Lang, opt: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" }) =>
  new Intl.DateTimeFormat(LOCALE[lang], { timeZone: "UTC", ...opt }).format(new Date(`${d}T12:00:00Z`));

/** Các khung giờ đặt bàn (mỗi 30 phút, từ giờ mở cửa tới giờ nhận khách cuối). */
export function slots(h: Hours | undefined) {
  if (!h || h.closed) return [];
  const out: string[] = [];
  for (let v = toMin(h.open); v <= toMin(h.last); v += 30) out.push(fromMin(v));
  return out;
}

export const inRange = (t: string, start: string, end: string) => toMin(t) >= toMin(start) && toMin(t) < toMin(end);

/** Trạng thái mở cửa lúc này: open=true kèm giờ đóng, hoặc giờ mở lần tới. */
export function openState(hours: Hours[]) {
  const { date, min } = vnNow();
  // Sau nửa đêm vẫn thuộc đêm hôm trước.
  const night = min < 300 ? addDays(date, -1) : date;
  const m = min < 300 ? min + 1440 : min;
  const h = hours[weekday(night)];
  if (h && !h.closed && m >= toMin(h.open) && m < toMin(h.close)) return { open: true as const, until: h.close };
  for (let i = 0; i < 8; i++) {
    const d = addDays(night, i);
    const x = hours[weekday(d)];
    if (!x || x.closed) continue;
    if (i === 0 && m >= toMin(x.open)) continue;
    return { open: false as const, at: x.open, inDays: i };
  }
  return { open: false as const, at: "", inDays: -1 };
}
