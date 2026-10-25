"use client";
import { useEffect, useState } from "react";
import { CloseIcon, MinusIcon, PlusIcon } from "./Icons";
import type { Lang } from "@/lib/content";
import { DICT, fill } from "@/lib/i18n";
import { downloadIcs } from "@/lib/ics";
import { fmt12, fmtDate } from "@/lib/time";

type Ev = { id: string; title: string; date: string; start: string; end: string };

/** Nút "Save a seat" + hộp thoại giữ chỗ cho một sự kiện. */
export default function EventRsvp({ ev, lang, phone, handle, instagram, address, className = "btn btn-solid !py-2.5 !px-4" }: {
  ev: Ev; lang: Lang; phone: string; handle: string; instagram: string; address: string; className?: string;
}) {
  const t = DICT[lang];
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", phone: "", guests: 2, agree: false });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [code, setCode] = useState("");
  const when = `${fmtDate(ev.date, lang)} · ${fmt12(ev.start)}`;

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name.trim() || f.phone.replace(/\D/g, "").length < 8) return setErr(t.errFields);
    if (!f.agree) return setErr(t.errAgree);
    setBusy(true); setErr("");
    try {
      const r = await fetch("/api/reservations", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...f, event: ev.id, lang }) });
      const j = await r.json();
      if (!r.ok) throw new Error();
      setCode(j.code);
    } catch { setErr(t.err); } finally { setBusy(false); }
  }

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>{t.saveSeat}</button>
      {open && (
        <div className="modal-back" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="modal relative" role="dialog" aria-modal="true" aria-labelledby={`rsvp-${ev.id}`}>
            <button type="button" className="absolute right-6 top-6 hover:opacity-70" aria-label={t.close} onClick={() => setOpen(false)}><CloseIcon /></button>
            {code ? (
              <>
                <h2 id={`rsvp-${ev.id}`} className="serif text-3xl">{t.seatSaved}</h2>
                <p className="text-sm text-fg/80 mt-1">{ev.title} · {when}</p>
                <span className="seal-red kanji w-14 h-14 text-2xl mt-6">秘</span>
                <p className="text-lg font-medium mt-6">{fill(t.seeYouAt, { e: ev.title, d: when })}</p>
                <button type="button" className="btn btn-ghost mt-6" onClick={() => downloadIcs({ uid: code, title: `${ev.title} – Himitsu`, date: ev.date, start: ev.start, end: ev.end, location: address })}>{t.addCal}</button>
                <p className="mt-6"><a href={instagram} target="_blank" rel="noopener noreferrer" className="link text-sm">{fill(t.followNext, { h: handle })} →</a></p>
              </>
            ) : (
              <form onSubmit={submit} noValidate>
                <h2 id={`rsvp-${ev.id}`} className="serif text-3xl pr-8">{t.saveSeat}</h2>
                <p className="text-sm text-fg/80 mt-1">{ev.title} · {when}</p>
                <label className="label mt-6" htmlFor={`n-${ev.id}`}>{t.yourName}</label>
                <input id={`n-${ev.id}`} className="field" autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoFocus />
                <label className="label mt-5" htmlFor={`p-${ev.id}`}>{t.phone}</label>
                <input id={`p-${ev.id}`} className="field" type="tel" autoComplete="tel" placeholder="+84" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
                <p className="text-xs text-muted mt-2">{fill(t.phoneShort, { p: phone })}</p>
                <p className="label mt-5">{t.guests}</p>
                <Stepper value={f.guests} onChange={(g) => setF({ ...f, guests: g })} lang={lang} />
                <label className="flex items-center gap-3 mt-6 text-sm font-medium cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 accent-white" checked={f.agree} onChange={(e) => setF({ ...f, agree: e.target.checked })} />
                  {t.agreeShort}
                </label>
                {err && <p className="text-sm text-[#e36b6f] mt-4" role="alert">{err}</p>}
                <button className="btn btn-solid w-full mt-6" disabled={busy}>{busy ? t.sending : t.saveMySeat}</button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export function Stepper({ value, onChange, lang, max = 20 }: { value: number; onChange: (n: number) => void; lang: Lang; max?: number }) {
  const t = DICT[lang];
  return (
    <div className="inline-flex items-center border border-line bg-bg2">
      <button type="button" className="p-3.5 hover:bg-white/5 disabled:opacity-30" aria-label="−" disabled={value <= 1} onClick={() => onChange(value - 1)}><MinusIcon className="w-4 h-4" /></button>
      <span className="w-24 text-center font-medium" aria-live="polite">{value === 1 ? t.guest1 : fill(t.guestsN, { n: value })}</span>
      <button type="button" className="p-3.5 hover:bg-white/5 disabled:opacity-30" aria-label="+" disabled={value >= max} onClick={() => onChange(value + 1)}><PlusIcon className="w-4 h-4" /></button>
    </div>
  );
}
