"use client";
import { useEffect, useState } from "react";

type X = Record<string, string>;

export default function PrivateHire({ x }: { x: X }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "ok" | "err">("idle");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending");
    try {
      const res = await fetch("/api/private-hire", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      if (!res.ok) throw new Error("failed");
      setState("ok");
      form.reset();
    } catch {
      setState("err");
    }
  }

  const input = "mt-1 w-full bg-card border border-white/15 px-3 py-2 focus:border-gold outline-none";
  const label = "block text-sm text-muted";
  return (
    <>
      <div className="card p-6 max-w-xl">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-gold mb-3">{x.phTag}</p>
        <h2 className="text-2xl mb-3">{x.phTitle}</h2>
        <p className="font-sans text-sm text-muted mb-5">{x.phBody}</p>
        <button type="button" onClick={() => { setState("idle"); setOpen(true); }} className="border border-gold text-gold px-6 py-2.5 uppercase tracking-widest text-xs font-sans hover:bg-gold hover:text-bg transition-colors">
          {x.phCta}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div role="dialog" aria-modal="true" aria-label={x.phTitle} className="bg-bg border border-white/15 w-full max-w-lg max-h-[92vh] overflow-y-auto p-6 font-sans" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h3 className="text-xl text-fg">{x.phTitle}</h3>
              <button type="button" onClick={() => setOpen(false)} aria-label={x.phClose} className="text-2xl leading-none text-muted hover:text-fg">×</button>
            </div>
            {state === "ok" ? (
              <div className="space-y-4">
                <p className="text-green-400">{x.phOk}</p>
                <button type="button" onClick={() => setOpen(false)} className="border border-gold text-gold px-5 py-2">{x.phClose}</button>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-3">
                <label className={label}>{x.phName}<input name="name" required autoComplete="name" className={input} /></label>
                <label className={label}>{x.phPhone}<input name="phone" type="tel" inputMode="tel" required autoComplete="tel" className={input} /></label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={label}>{x.phDate}<input name="date" type="date" className={input} /></label>
                  <label className={label}>{x.phGuests}<input name="guests" type="number" min={1} defaultValue={10} className={input} /></label>
                </div>
                <label className={label}>{x.phType}<input name="type" className={input} /></label>
                <label className={label}>{x.phNote}<textarea name="note" rows={3} className={input} /></label>
                <button disabled={state === "sending"} className="bg-gold text-bg py-3 uppercase tracking-widest text-sm disabled:opacity-60">{x.phSubmit}</button>
                {state === "err" && <p role="alert" className="text-red-400">{x.phErr}</p>}
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
