// Tạo và tải file lịch .ics (giờ Việt Nam = UTC+7, không đổi giờ theo mùa).
import { toMin } from "./time";

const utc = (date: string, time: string, plusMin = 0) => {
  const [y, m, d] = date.split("-").map(Number);
  const ms = Date.UTC(y, m - 1, d) + (toMin(time) - 420 + plusMin) * 60_000;
  return new Date(ms).toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
};
const esc = (s: string) => s.replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");

export function downloadIcs(o: { uid: string; title: string; date: string; start: string; end?: string; location: string; description?: string }) {
  const dur = o.end ? toMin(o.end) - toMin(o.start) : 120;
  const body = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Himitsu House//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${o.uid}@himitsubar.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
    `DTSTART:${utc(o.date, o.start)}`,
    `DTEND:${utc(o.date, o.start, dur > 0 ? dur : 120)}`,
    `SUMMARY:${esc(o.title)}`,
    `LOCATION:${esc(o.location)}`,
    o.description ? `DESCRIPTION:${esc(o.description)}` : "",
    "END:VEVENT", "END:VCALENDAR",
  ].filter(Boolean).join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([body], { type: "text/calendar;charset=utf-8" }));
  a.download = `himitsu-${o.uid}.ics`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
