"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "./Icons";
import type { Lang } from "@/lib/content";
import { DICT } from "@/lib/i18n";

/** Khối "Thuê riêng" ở trang Liên hệ; nút mở popup để khách điền thông tin. */
export default function PrivateHire({ lang, image }: { lang: Lang; image: string }) {
  const t = DICT[lang];
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
      const r = await fetch("/api/private-hire", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      if (!r.ok) throw new Error();
      setState("ok");
      form.reset();
    } catch { setState("err"); }
  }

  return (
    <>
      <div className="relative overflow-hidden border border-line">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {image && <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
        <div className="relative px-6 py-14 md:px-14 md:py-24 max-w-2xl">
          <p className="eyebrow">{t.phTag}</p>
          <h2 className="serif text-4xl md:text-5xl mt-5 leading-tight">{t.phTitle}</h2>
          <p className="text-lg text-fg/85 mt-6 leading-relaxed">{t.phBody}</p>
          <button type="button" className="btn btn-solid mt-10" onClick={() => { setState("idle"); setOpen(true); }}>{t.phCta}</button>
        </div>
      </div>

      {/* Gắn popup vào <body>: <main> có hiệu ứng transform nên position: fixed bên trong sẽ bị lệch. */}
      {open && createPortal(
        <div className="modal-back" onClick={() => setOpen(false)}>
          <div role="dialog" aria-modal="true" aria-label={t.phTitle} className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 mb-6">
              <h3 className="serif text-3xl leading-tight">{t.phTitle}</h3>
              <button type="button" onClick={() => setOpen(false)} aria-label={t.close} className="p-1 -mr-1 hover:opacity-70"><CloseIcon /></button>
            </div>
            {state === "ok" ? (
              <>
                <p className="text-lg">{t.phOk}</p>
                <button type="button" className="btn btn-ghost mt-8" onClick={() => setOpen(false)}>{t.close}</button>
              </>
            ) : (
              <form onSubmit={submit} className="grid gap-5">
                <div><label className="label" htmlFor="ph-name">{t.phName}</label><input id="ph-name" name="name" required autoComplete="name" className="field" /></div>
                <div><label className="label" htmlFor="ph-phone">{t.phPhone}</label><input id="ph-phone" name="phone" type="tel" required autoComplete="tel" className="field" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="label" htmlFor="ph-date">{t.phDate}</label><input id="ph-date" name="date" type="date" className="field" /></div>
                  <div><label className="label" htmlFor="ph-guests">{t.phGuests}</label><input id="ph-guests" name="guests" type="number" min={1} defaultValue={10} className="field" /></div>
                </div>
                <div><label className="label" htmlFor="ph-type">{t.phType}</label><input id="ph-type" name="type" className="field" /></div>
                <div><label className="label" htmlFor="ph-note">{t.phNote}</label><textarea id="ph-note" name="note" rows={3} className="field" /></div>
                {state === "err" && <p role="alert" className="text-sm text-[#e36b6f]">{t.phErr}</p>}
                <button className="btn btn-solid" disabled={state === "sending"}>{state === "sending" ? t.sending : t.phSubmit}</button>
              </form>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
