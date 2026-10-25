"use client";
import { useEffect, useState } from "react";
import PublicSeatMap from "./PublicSeatMap";
import type { Lang, Texts } from "@/lib/content";

export default function ReservationForm({ lang, r, zalo, hotline, tel }: { lang: Lang; r: Texts["reservation"]; zalo: string; hotline: string; tel: string }) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err" | "taken">("idle");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [taken, setTaken] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const [holdBefore, holdAfter = ""] = r.holdNote.split("{hotline}");
  const hold = (
    <p className="text-sm text-muted">
      {holdBefore}<a href={tel} className="text-fg underline">{hotline}</a>{holdAfter}
    </p>
  );

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

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending");
    const body = Object.fromEntries(new FormData(form)) as Record<string, string>;
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...body, table: selected.join(", ") }),
      });
      if (res.status === 409) {
        const j = await res.json();
        setTaken((cur) => Array.from(new Set([...cur, ...(j.taken ?? [])])));
        setSelected((cur) => cur.filter((t) => !(j.taken ?? []).includes(t)));
        setState("taken");
        return;
      }
      if (!res.ok) throw new Error("failed");
      const note = body.note ? r.noteTpl.replace("{note}", body.note) : "";
      const seats = selected.length ? ` (${selected.join(", ")})` : "";
      setMessage(
        r.msgTpl
          .replace("{name}", body.name).replace("{phone}", body.phone).replace("{guests}", String(Number(body.guests) || 2))
          .replace("{time}", body.time).replace("{date}", body.date).replace("{note}", note) + seats,
      );
      setState("ok");
      form.reset();
      setDate(""); setTime(""); setTaken([]); setSelected([]);
    } catch {
      setState("err");
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  const input = "mt-1 w-full bg-card border border-white/15 px-3 py-2 focus:border-gold outline-none";
  const label = "block text-sm font-sans text-muted";
  return (
    <div className="max-w-3xl font-sans">
      <form onSubmit={submit} className="grid gap-4">
        <label className={label}>{r.name}<input name="name" required autoComplete="name" className={`${input} max-w-xl`} /></label>
        <label className={label}>{r.phone}<input name="phone" type="tel" inputMode="tel" required autoComplete="tel" className={`${input} max-w-xl`} /></label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl">
          <label className={label}>{r.date}<input name="date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={input} /></label>
          <label className={label}>{r.time}<input name="time" type="time" required value={time} onChange={(e) => setTime(e.target.value)} className={input} /></label>
          <label className={label}>{r.guests}<input name="guests" type="number" min={1} defaultValue={2} className={input} /></label>
        </div>

        <PublicSeatMap lang={lang} r={r} taken={taken} selected={selected} onChange={setSelected} />

        <label className={label}>{r.note}<textarea name="note" rows={3} className={`${input} max-w-xl`} /></label>
        {hold}
        <button disabled={state === "sending"} className="bg-gold text-bg py-3 uppercase tracking-widest text-sm hover:brightness-110 transition disabled:opacity-60 max-w-xl">
          {r.submit}
        </button>
        {state === "err" && <p role="alert" className="text-red-400">{r.err}</p>}
        {state === "taken" && <p role="alert" className="text-red-400">{r.mapTakenErr}</p>}
      </form>
      {state === "ok" && (
        <div role="status" className="mt-6 border border-gold/40 bg-card p-4 space-y-3 max-w-xl">
          <p className="text-green-400">{r.ok}</p>
          {hold}
          <p className="text-sm text-muted">{r.zaloHint}</p>
          <p className="text-sm whitespace-pre-wrap border border-white/10 p-3">{message}</p>
          <div className="flex flex-wrap gap-3">
            <a href={zalo} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 text-white" style={{ background: "#0068FF" }}>
              {r.zaloCta}
            </a>
            <button type="button" onClick={copy} className="border border-gold text-gold px-5 py-2.5">
              {copied ? r.copied : r.copy}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
