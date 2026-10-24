"use client";
import { useState } from "react";
import { Lang, T } from "@/lib/content";

export default function ReservationForm({ lang }: { lang: Lang }) {
  const r = T[lang].reservation;
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending");
    const body = Object.fromEntries(new FormData(form));
    const res = await fetch("/api/reservations", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { setState("ok"); form.reset(); } else setState("err");
  }

  const input = "w-full bg-card border border-white/15 px-3 py-2 focus:border-gold outline-none";
  return (
    <form onSubmit={submit} className="grid gap-4 max-w-xl">
      <label>{r.name}<input name="name" required className={input} /></label>
      <label>{r.phone}<input name="phone" required className={input} /></label>
      <label>{r.email}<input name="email" type="email" className={input} /></label>
      <div className="grid grid-cols-3 gap-3">
        <label>{r.date}<input name="date" type="date" required className={input} /></label>
        <label>{r.time}<input name="time" type="time" required className={input} /></label>
        <label>{r.guests}<input name="guests" type="number" min={1} defaultValue={2} className={input} /></label>
      </div>
      <label>{r.note}<textarea name="note" rows={3} className={input} /></label>
      <button disabled={state === "sending"} className="bg-gold text-bg py-2.5 uppercase tracking-widest disabled:opacity-60">{r.submit}</button>
      {state === "ok" && <p className="text-green-400">{r.ok}</p>}
      {state === "err" && <p className="text-red-400">{r.err}</p>}
    </form>
  );
}
