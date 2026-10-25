"use client";
import { useState } from "react";
import { Texts } from "@/lib/content";

export default function ReservationForm({ r, zalo, hotline, tel }: { r: Texts["reservation"]; zalo: string; hotline: string; tel: string }) {
  const [holdBefore, holdAfter = ""] = r.holdNote.split("{hotline}");
  const hold = (
    <p className="text-sm text-muted">
      {holdBefore}<a href={tel} className="text-fg underline">{hotline}</a>{holdAfter}
    </p>
  );
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending");
    const body = Object.fromEntries(new FormData(form)) as Record<string, string>;
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("failed");
      const note = body.note ? r.noteTpl.replace("{note}", body.note) : "";
      setMessage(
        r.msgTpl
          .replace("{name}", body.name).replace("{phone}", body.phone).replace("{guests}", String(Number(body.guests) || 2))
          .replace("{time}", body.time).replace("{date}", body.date).replace("{note}", note),
      );
      setState("ok");
      form.reset();
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
    <div className="max-w-xl font-sans">
      <form onSubmit={submit} className="grid gap-4">
        <label className={label}>{r.name}<input name="name" required autoComplete="name" className={input} /></label>
        <label className={label}>{r.phone}<input name="phone" type="tel" inputMode="tel" required autoComplete="tel" className={input} /></label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className={label}>{r.date}<input name="date" type="date" required className={input} /></label>
          <label className={label}>{r.time}<input name="time" type="time" required className={input} /></label>
          <label className={label}>{r.guests}<input name="guests" type="number" min={1} defaultValue={2} className={input} /></label>
        </div>
        <label className={label}>{r.note}<textarea name="note" rows={3} className={input} /></label>
        {hold}
        <button disabled={state === "sending"} className="bg-gold text-bg py-3 uppercase tracking-widest text-sm hover:brightness-110 transition disabled:opacity-60">
          {r.submit}
        </button>
        {state === "err" && <p role="alert" className="text-red-400">{r.err}</p>}
      </form>
      {state === "ok" && (
        <div role="status" className="mt-6 border border-gold/40 bg-card p-4 space-y-3">
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
