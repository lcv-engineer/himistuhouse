"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PublicSeatMap from "./PublicSeatMap";
import { toMinutes } from "@/lib/tables";
import type { Lang, Texts } from "@/lib/content";

const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const label12 = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const ap = h >= 12 && h < 24 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}${m ? `:${pad(m)}` : ""}${ap}`;
};
// 5:00PM → 12:30AM, mỗi 30 phút
const SLOTS = Array.from({ length: 16 }, (_, i) => {
  const mins = 17 * 60 + i * 30;
  return `${pad(Math.floor(mins / 60) % 24)}:${pad(mins % 60)}`;
});
const HH_END = 20 * 60; // Happy Hour 5PM–8PM

type Props = {
  lang: Lang; r: Texts["reservation"]; x: Record<string, string>; zalo: string; hotline: string; tel: string;
  lastOrder: string; holidays: { date: string; label: string }[];
};

export default function ReservationForm({ lang, r, x, hotline, tel, lastOrder, holidays }: Props) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "sending" | "err" | "taken" | "pick">("idle");
  const [days, setDays] = useState<{ v: string; wd: string; d: number; m: string }[]>([]);
  const [today, setToday] = useState("");
  const [nowMin, setNowMin] = useState(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [taken, setTaken] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const [holdBefore, holdAfter = ""] = r.holdNote.split("{hotline}");
  const hold = (
    <p className="text-sm text-muted">
      {holdBefore}<a href={tel} className="text-fg underline">{hotline}</a>{holdAfter}
    </p>
  );

  // Ngày giờ lấy ở client (sau khi mount) để tránh lệch múi giờ giữa server và trình duyệt.
  useEffect(() => {
    const loc = lang === "vi" ? "vi-VN" : "en-GB";
    const now = new Date();
    const list = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      return { v: ymd(d), wd: d.toLocaleDateString(loc, { weekday: "short" }), d: d.getDate(), m: d.toLocaleDateString(loc, { month: "short" }) };
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDays(list); setToday(ymd(now)); setNowMin(now.getHours() * 60 + now.getMinutes());
    setDate((cur) => cur || ymd(now));
  }, [lang]);

  // Khi chọn ngày + giờ, hỏi server chỗ nào đã có khách và bỏ chọn các chỗ vừa bị chiếm.
  useEffect(() => {
    if (!date || !time) return;
    let cancelled = false;
    fetch(`/api/availability?date=${date}&time=${time}`)
      .then((res) => res.json())
      .then((j: { taken: string[] }) => {
        if (cancelled) return;
        setTaken(j.taken);
        setSelected((cur) => cur.filter((t) => !j.taken.includes(t)));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [date, time]);

  const holiday = useMemo(() => holidays.find((h) => h.date === date), [holidays, date]);
  const isPast = (slot: string) => date === today && toMinutes(slot) < 1440 && toMinutes(slot) <= nowMin;
  const isLO = (slot: string) => toMinutes(slot) >= toMinutes(lastOrder);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!date || !time) { setState("pick"); return; }
    const form = e.currentTarget;
    setState("sending");
    const body = Object.fromEntries(new FormData(form)) as Record<string, string>;
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: body.name, phone: body.phone, note: body.note, date, time, guests, table: selected.join(", ") }),
      });
      if (res.status === 409) {
        const j = await res.json();
        setTaken((cur) => Array.from(new Set([...cur, ...(j.taken ?? [])])));
        setSelected((cur) => cur.filter((t) => !(j.taken ?? []).includes(t)));
        setState("taken");
        return;
      }
      if (!res.ok) throw new Error("failed");
      const { id } = (await res.json()) as { id: string };
      const note = body.note ? r.noteTpl.replace("{note}", body.note) : "";
      const seats = selected.length ? ` (${selected.join(", ")})` : "";
      const msg =
        r.msgTpl.replace("{name}", body.name).replace("{phone}", body.phone).replace("{guests}", String(guests))
          .replace("{time}", label12(time)).replace("{date}", date).replace("{note}", note) + seats;
      try { sessionStorage.setItem(`bk-${id}`, msg); } catch { /* bỏ qua nếu không lưu được */ }
      router.push(`/${lang}/booking/${id}`);
    } catch {
      setState("err");
    }
  }

  const input = "mt-1 w-full bg-card border border-white/15 px-3 py-2 focus:border-gold outline-none";
  const label = "block text-sm font-sans text-muted";
  const h3 = "text-xs uppercase tracking-[0.25em] text-gold mb-3";
  return (
    <div className="max-w-3xl font-sans">
      <form onSubmit={submit} className="grid gap-8">
        <div className="grid gap-4 max-w-xl">
          <label className={label}>{r.name}<input name="name" required autoComplete="name" className={input} /></label>
          <label className={label}>{r.phone}<input name="phone" type="tel" inputMode="tel" required autoComplete="tel" className={input} /></label>
        </div>

        <div>
          <p className={h3}>{x.rvDateTitle}</p>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0" role="radiogroup" aria-label={x.rvDateTitle}>
            {days.map((d) => {
              const hol = holidays.find((h) => h.date === d.v);
              const on = date === d.v;
              return (
                <button key={d.v} type="button" role="radio" aria-checked={on} onClick={() => setDate(d.v)}
                  className={`relative shrink-0 w-16 py-2 border text-center transition-colors ${on ? "bg-gold text-bg border-gold" : "border-white/20 hover:border-gold"}`}>
                  <span className="block text-[0.65rem] uppercase tracking-widest opacity-80">{d.wd}</span>
                  <span className="block text-xl leading-tight">{d.d}</span>
                  <span className="block text-[0.65rem] opacity-70">{d.m}</span>
                  {hol && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-400" title={hol.label} aria-label={`${x.rvHoliday}: ${hol.label}`} />}
                </button>
              );
            })}
          </div>
          <label className="inline-flex items-center gap-2 mt-2 text-sm text-muted underline cursor-pointer">
            {x.rvPickAnother}
            <input type="date" value={date} min={today || undefined} onChange={(e) => setDate(e.target.value)} className="bg-transparent border border-white/20 px-2 py-1 text-fg no-underline" />
          </label>
          {holiday && <p className="mt-2 text-sm text-red-300">★ {x.rvHoliday}: {holiday.label}</p>}
        </div>

        <div>
          <p className={h3}>{r.guests}</p>
          <div className="inline-flex items-center border border-white/20">
            <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="−" className="w-11 h-11 text-xl hover:bg-white/5">−</button>
            <span className="w-24 text-center" aria-live="polite">{guests} {lang === "vi" ? "khách" : guests === 1 ? "guest" : "guests"}</span>
            <button type="button" onClick={() => setGuests((g) => Math.min(30, g + 1))} aria-label="+" className="w-11 h-11 text-xl hover:bg-white/5">+</button>
          </div>
        </div>

        <div>
          <p className={h3}>{x.rvTimeTitle}</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-w-xl" role="radiogroup" aria-label={x.rvTimeTitle}>
            {SLOTS.map((s) => {
              const on = time === s;
              const hh = toMinutes(s) < HH_END;
              const lo = isLO(s);
              const past = isPast(s);
              return (
                <button key={s} type="button" role="radio" aria-checked={on} disabled={past} onClick={() => setTime(s)}
                  className={`relative py-2.5 border text-sm transition-colors ${on ? "bg-gold text-bg border-gold" : "border-white/20 hover:border-gold"} ${past ? "opacity-30 cursor-not-allowed" : ""}`}>
                  {label12(s)}
                  {hh && <sup className="absolute top-0.5 right-1 text-[0.55rem] text-red-400">HH</sup>}
                  {lo && <sup className="absolute top-0.5 right-1 text-[0.55rem] text-red-400">L.O</sup>}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-muted">{x.rvLegendHH} · {x.rvLegendLO}</p>
        </div>

        <PublicSeatMap lang={lang} r={r} taken={taken} selected={selected} onChange={setSelected} />

        <div className="grid gap-4 max-w-xl">
          <label className={label}>{r.note}<textarea name="note" rows={3} className={input} /></label>
          {hold}
          <button disabled={state === "sending"} className="bg-gold text-bg py-3 uppercase tracking-widest text-sm hover:brightness-110 transition disabled:opacity-60">
            {r.submit}
          </button>
          {state === "pick" && <p role="alert" className="text-red-400">{x.rvPickTime}</p>}
          {state === "err" && <p role="alert" className="text-red-400">{r.err}</p>}
          {state === "taken" && <p role="alert" className="text-red-400">{r.mapTakenErr}</p>}
        </div>
      </form>
    </div>
  );
}
