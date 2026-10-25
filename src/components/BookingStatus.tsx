"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Lang, Texts } from "@/lib/content";

type Booking = { name: string; date: string; time: string; guests: number; table: string; status: "new" | "confirmed" | "cancelled"; note: string };

const label12 = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const ap = h >= 12 && h < 24 ? "PM" : "AM";
  return `${h % 12 === 0 ? 12 : h % 12}${m ? `:${String(m).padStart(2, "0")}` : ""}${ap}`;
};

export default function BookingStatus({ id, lang, r, x, zalo, hotline, tel }: { id: string; lang: Lang; r: Texts["reservation"]; x: Record<string, string>; zalo: string; hotline: string; tel: string }) {
  const [b, setB] = useState<Booking | null | "missing">(null);
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/booking?id=${id}`, { cache: "no-store" });
    setB(res.ok ? await res.json() : "missing");
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    try { setMsg(sessionStorage.getItem(`bk-${id}`) ?? ""); } catch { /* không có sessionStorage */ }
  }, [id, load]);

  async function cancel() {
    if (!confirm(x.bkCancelAsk)) return;
    await fetch("/api/booking", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, action: "cancel" }) });
    load();
  }
  async function copy() {
    try { await navigator.clipboard.writeText(msg); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard unavailable */ }
  }

  if (b === null) return <p className="text-muted font-sans">{x.bkLoading}</p>;
  if (b === "missing") return <p className="text-muted font-sans">{x.bkNotFound}</p>;

  const [holdBefore, holdAfter = ""] = r.holdNote.split("{hotline}");
  const steps = [
    { on: true, text: x.bkReceived },
    { on: b.status === "confirmed", text: x.bkConfirmed },
  ];
  const row = "flex justify-between gap-6 py-2 border-b border-white/10 text-sm";
  return (
    <div className="max-w-lg font-sans space-y-6">
      {b.status === "cancelled" ? (
        <p className="text-red-400">● {x.bkCancelled}</p>
      ) : (
        <ul className="space-y-2">
          {steps.map((s) => (
            <li key={s.text} className={s.on ? "text-fg" : "text-muted/60"}><span className={s.on ? "text-green-400" : ""}>●</span> {s.text}</li>
          ))}
        </ul>
      )}

      <div>
        <div className={row}><span className="text-muted">{x.bkWhen}</span><span>{b.date} · {label12(b.time)}</span></div>
        <div className={row}><span className="text-muted">{x.bkGuests}</span><span>{b.guests}</span></div>
        <div className={row}><span className="text-muted">{x.bkName}</span><span>{b.name}</span></div>
        <div className={row}><span className="text-muted">{x.bkSeat}</span><span>{b.table || x.bkSeatAny}</span></div>
      </div>

      {b.status !== "cancelled" && (
        <>
          <p className="text-sm text-muted">{holdBefore}<a href={tel} className="text-fg underline">{hotline}</a>{holdAfter}</p>
          {msg && (
            <div className="border border-gold/40 bg-card p-4 space-y-3">
              <p className="text-sm text-muted">{r.zaloHint}</p>
              <p className="text-sm whitespace-pre-wrap border border-white/10 p-3">{msg}</p>
              <div className="flex flex-wrap gap-3">
                <a href={zalo} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 text-white" style={{ background: "#0068FF" }}>{r.zaloCta}</a>
                <button type="button" onClick={copy} className="border border-gold text-gold px-5 py-2.5">{copied ? r.copied : r.copy}</button>
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" onClick={cancel} className="border border-red-400/70 text-red-300 px-5 py-2.5 uppercase tracking-widest text-xs hover:bg-red-400/10">{x.bkCancel}</button>
            <span className="text-sm text-muted">{lang === "vi" ? "hoặc gọi" : "or call"} <a href={tel} className="text-fg underline">{hotline}</a></span>
          </div>
        </>
      )}
      <Link href={`/${lang}/reservation`} className="inline-block text-sm underline text-muted hover:text-fg">{x.bkNewBooking}</Link>
    </div>
  );
}
