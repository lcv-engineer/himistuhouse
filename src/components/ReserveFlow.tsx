"use client";
import Link from "next/link";
import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Stepper } from "./EventRsvp";
import { CalendarIcon, PinIcon } from "./Icons";
import type { Hours, Lang } from "@/lib/content";
import { DICT, fill } from "@/lib/i18n";
import { downloadIcs } from "@/lib/ics";
import { addDays, fmt12, fmtDate, inRange, slots, toMin, vnNow, weekday } from "@/lib/time";

type Props = {
  lang: Lang; hours: Hours[]; happyHour: { start: string; end: string } | null;
  holidays: { date: string; label: string }[]; phone: string; address: string; mapsUrl: string;
};

const noop = () => () => {};

// Nhãn lưu theo tiếng Việt để admin đọc thống nhất; hiển thị cho khách theo ngôn ngữ đang xem.
const VI = DICT.vi;
export const tagLabel = (v: string, lang: Lang) => {
  for (const k of ["occasions", "seatings", "tastes"] as const) {
    const i = VI[k].indexOf(v);
    if (i >= 0) return DICT[lang][k][i];
  }
  return v;
};

export default function ReserveFlow({ lang, hours, happyHour, holidays, phone, address, mapsUrl }: Props) {
  const t = DICT[lang];
  // Ngày giờ chỉ tính ở trình duyệt (server render khung trống) để không lệch giờ giữa hai bên.
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const today = useMemo(() => (mounted ? vnNow() : null), [mounted]);
  // Mặc định: ngày gần nhất còn khung giờ đặt bàn.
  const firstOpen = useMemo(() => {
    if (!today) return "";
    let d = today.date;
    for (let i = 0; i < 14; i++) {
      if (slots(hours[weekday(d)]).some((x) => d !== today.date || toMin(x) > today.min + 15)) return d;
      d = addDays(d, 1);
    }
    return today.date;
  }, [today, hours]);
  const [picked, setDate] = useState("");
  const date = picked || firstOpen;
  const [guests, setGuests] = useState(2);
  const [chosen, setTime] = useState("");
  const [f, setF] = useState({ name: "", phone: "", email: "", note: "", occasion: -1, seating: -1, taste: [] as number[], agree: false });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState<{ code: string } | null>(null);
  const step1 = useRef<HTMLDivElement>(null);
  const step2 = useRef<HTMLDivElement>(null);
  const picker = useRef<HTMLInputElement>(null);

  const strip = useMemo(() => {
    if (!today) return [];
    const start = date && date > addDays(today.date, 12) ? date : today.date;
    return Array.from({ length: 13 }, (_, i) => addDays(start, i));
  }, [today, date]);

  const daySlots = useMemo(() => {
    if (!date || !today) return [];
    return slots(hours[weekday(date)]).filter((x) => date !== today.date || toMin(x) > today.min + 15);
  }, [date, today, hours]);
  const dayClosed = date ? !!hours[weekday(date)]?.closed : false;
  const holiday = holidays.find((h) => h.date === date);

  // Đổi ngày mà giờ đã chọn không còn thì coi như chưa chọn giờ.
  const time = daySlots.includes(chosen) ? chosen : "";

  const pickTime = (x: string) => {
    setTime(x);
    setTimeout(() => step2.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };
  const toggleTaste = (i: number) => setF((s) => ({ ...s, taste: s.taste.includes(i) ? s.taste.filter((x) => x !== i) : [...s.taste, i] }));

  const summary = date && time ? `${fmtDate(date, lang)} · ${guests === 1 ? t.guest1 : fill(t.guestsN, { n: guests })} · ${fmt12(time)}` : "";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name.trim() || f.phone.replace(/\D/g, "").length < 8) return setErr(t.errFields);
    if (!f.agree) return setErr(t.errAgree);
    setBusy(true); setErr("");
    try {
      const r = await fetch("/api/reservations", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: f.name, phone: f.phone, email: f.email, note: f.note, date, time, guests, lang,
          occasion: VI.occasions[f.occasion] ?? "", seating: VI.seatings[f.seating] ?? "", taste: f.taste.map((i) => VI.tastes[i]),
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error();
      setDone({ code: j.code });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch { setErr(t.err); } finally { setBusy(false); }
  }

  if (done) {
    const tags = [t.occasions[f.occasion], t.seatings[f.seating], ...f.taste.map((i) => t.tastes[i])].filter(Boolean);
    return (
      <div className="fx-up">
        <span className="seal-red kanji w-[72px] h-[72px] text-3xl">秘</span>
        <h2 className="serif text-4xl md:text-5xl mt-8 leading-tight">
          {fill(t.seeYou, { d: fmtDate(date, lang, { weekday: "long" }), t: fmt12(time) })}<br />{t.saved}
        </h2>
        <div className="mt-10 bg-card border border-line p-6">
          <p className="eyebrow text-fg/80">{t.code}</p>
          <p className="serif text-5xl md:text-6xl mt-3 tracking-wide break-all">{done.code}</p>
          <p className="text-sm text-fg/80 mt-3">{t.codeHint}</p>
        </div>
        <dl className="mt-12 grid grid-cols-[6rem_1fr] gap-y-3 text-[.95rem]">
          <dt className="text-fg/70">{t.whenLabel}</dt><dd className="font-medium">{fmtDate(date, lang)} · {fmt12(time)}</dd>
          <dt className="text-fg/70">{t.guestsLabel}</dt><dd className="font-medium">{guests === 1 ? t.guest1 : fill(t.guestsN, { n: guests })}</dd>
          <dt className="text-fg/70">{t.nameLabel}</dt><dd className="font-medium">{f.name}</dd>
        </dl>
        {(tags.length > 0 || f.note) && (
          <div className="mt-10 border-l border-fg/60 pl-5">
            <p className="text-sm text-fg/80">{t.bartenderRead}</p>
            <div className="flex flex-wrap gap-2 mt-3">{tags.map((x) => <span key={x} className="chip font-medium">{x}</span>)}</div>
            {f.note && <p className="text-sm mt-3 text-fg/85">“{f.note}”</p>}
          </div>
        )}
        <div className="mt-10 flex flex-wrap gap-3">
          <button type="button" className="btn btn-solid" onClick={() => downloadIcs({ uid: done.code, title: "Himitsu – reservation", date, start: time, location: address, description: `${t.code}: ${done.code}` })}>{t.addCal}</button>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost"><PinIcon className="w-4 h-4" />{t.directions}</a>
        </div>
        <Link href={`/${lang}/booking/${done.code}`} className="btn btn-ghost mt-3">{t.viewCancel}</Link>
        <p className="mt-10"><button type="button" className="link" onClick={() => { setDone(null); setTime(""); setF({ ...f, note: "", agree: false }); }}>{t.another}</button></p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      {/* 01 – Khi nào */}
      <div ref={step1} className="scroll-mt-28">
        <h2 className="flex items-baseline gap-3"><span className="text-xs font-semibold tracking-[.2em]">01</span><span className="serif text-3xl">{t.when}</span></h2>
        <p className="label mt-8">{t.date}</p>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 [scrollbar-width:none]" role="radiogroup" aria-label={t.date}>
          {strip.map((d) => {
            const closed = !!hours[weekday(d)]?.closed;
            const sel = d === date;
            const hol = holidays.find((h) => h.date === d);
            return (
              <button key={d} type="button" role="radio" aria-checked={sel} disabled={closed} title={hol?.label}
                onClick={() => setDate(d)}
                className={`relative shrink-0 w-[3.6rem] py-2.5 border text-center ${sel ? "bg-fg text-[#111] border-fg" : "border-line hover:border-fg/70"} disabled:opacity-30 disabled:cursor-not-allowed`}>
                <span className="block text-[.7rem] font-semibold uppercase">{fmtDate(d, lang, { weekday: "short" }).replace(".", "")}</span>
                <span className="block serif text-2xl leading-tight">{Number(d.slice(8))}</span>
                {hol && <span className="absolute right-1 top-1 w-1.5 h-1.5 rounded-full bg-red" />}
              </button>
            );
          })}
        </div>
        <div className="mt-4 relative inline-flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" />
          <button type="button" className="link text-sm" onClick={() => { const p = picker.current; if (p) { try { p.showPicker(); } catch { p.focus(); } } }}>{t.pickAnother}</button>
          <input ref={picker} type="date" aria-label={t.pickAnother} className="absolute inset-0 opacity-0 pointer-events-none" min={today?.date} value={date}
            onChange={(e) => e.target.value && setDate(e.target.value)} />
        </div>
        {holiday && <p className="text-sm text-[#e36b6f] mt-3">● {holiday.label}</p>}

        <p className="label mt-10">{t.guests}</p>
        <Stepper value={guests} onChange={setGuests} lang={lang} />

        <div className="mt-10 flex items-baseline justify-between gap-4">
          <p className="label">{t.time}</p>
          {happyHour && <p className="text-xs text-fg/75">{t.hhLegend}</p>}
        </div>
        {dayClosed ? <p className="text-fg/80">{t.closedDay}</p> : !daySlots.length && today ? <p className="text-fg/80">{t.noSlots}</p> : (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2" role="radiogroup" aria-label={t.time}>
            {daySlots.map((x) => {
              const sel = x === time;
              return (
                <button key={x} type="button" role="radio" aria-checked={sel} onClick={() => pickTime(x)}
                  className={`relative py-3.5 border font-medium text-sm ${sel ? "bg-fg text-[#111] border-fg" : "border-line hover:border-fg/70"}`}>
                  {fmt12(x)}
                  {happyHour && inRange(x, happyHour.start, happyHour.end) && <span className="absolute right-1.5 top-1 text-[.55rem] font-bold text-red">HH</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 02 – Ai sẽ đến */}
      {time && (
        <div ref={step2} className="mt-20 scroll-mt-28 fx-up">
          <div className="sticky top-[5.5rem] z-10 bg-card border border-line px-4 py-4 flex items-center justify-between gap-4 mb-10">
            <span className="font-medium text-[.95rem]">{summary}</span>
            <button type="button" className="link text-sm" onClick={() => step1.current?.scrollIntoView({ behavior: "smooth" })}>{t.edit}</button>
          </div>
          <h2 className="flex items-baseline gap-3"><span className="text-xs font-semibold tracking-[.2em]">02</span><span className="serif text-3xl">{t.who}</span></h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="rv-name">{t.name}</label>
              <input id="rv-name" className="field" autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="rv-phone">{t.phone}</label>
              <input id="rv-phone" className="field" type="tel" autoComplete="tel" placeholder="+84" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
              <p className="text-xs text-fg/75 mt-2">{fill(t.phoneHint, { p: phone })}</p>
            </div>
          </div>
          <label className="label mt-6" htmlFor="rv-email">{t.email}</label>
          <input id="rv-email" className="field" type="email" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />

          <fieldset className="mt-10 border border-line px-5 pb-6 pt-2">
            <legend className="px-2 font-semibold">{t.bartender}</legend>
            <Pills label={t.occasion} items={t.occasions} isOn={(i) => f.occasion === i} onToggle={(i) => setF({ ...f, occasion: f.occasion === i ? -1 : i })} />
            <Pills label={t.seating} items={t.seatings} isOn={(i) => f.seating === i} onToggle={(i) => setF({ ...f, seating: f.seating === i ? -1 : i })} />
            <Pills label={t.taste} items={t.tastes} isOn={(i) => f.taste.includes(i)} onToggle={toggleTaste} />
            <div className="mt-6 flex justify-between">
              <label className="label" htmlFor="rv-note">{t.note}</label>
              <span className="text-xs text-fg/70">{f.note.length}/280</span>
            </div>
            <textarea id="rv-note" className="field min-h-28" maxLength={280} placeholder={t.notePh} value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} />
          </fieldset>

          <label className="flex items-center gap-3 mt-8 text-sm font-medium cursor-pointer">
            <input type="checkbox" className="w-5 h-5 accent-white" checked={f.agree} onChange={(e) => setF({ ...f, agree: e.target.checked })} />
            <span>{t.agree} <Link href={`/${lang}/policies`} target="_blank" className="underline underline-offset-4">{t.policy}</Link></span>
          </label>
          {err && <p className="text-sm text-[#e36b6f] mt-4" role="alert">{err}</p>}
          <button className="btn btn-solid mt-6 px-12" disabled={busy}>{busy ? t.sending : t.confirm}</button>
        </div>
      )}
    </form>
  );
}

function Pills({ label, items, isOn, onToggle }: { label: string; items: string[]; isOn: (i: number) => boolean; onToggle: (i: number) => void }) {
  return (
    <div className="mt-5">
      <p className="text-sm text-fg/75 mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((x, i) => <button key={x} type="button" className="pill" aria-pressed={isOn(i)} onClick={() => onToggle(i)}>{x}</button>)}
      </div>
    </div>
  );
}
