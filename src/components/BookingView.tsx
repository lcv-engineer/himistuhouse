"use client";
import { useEffect, useState } from "react";
import { tagLabel } from "./ReserveFlow";
import { tgHref, type Lang } from "@/lib/content";
import { DICT, fill } from "@/lib/i18n";
import { fmt12, fmtDate } from "@/lib/time";

type B = { code: string; name: string; date: string; time: string; guests: number; status: string; occasion: string; seating: string; table: string; taste: string[]; note: string; eventTitle: string };

export default function BookingView({ code, lang, phone, tel, telegram }: { code: string; lang: Lang; phone: string; tel: string; telegram: string }) {
  const t = DICT[lang];
  const [b, setB] = useState<B | null | "missing">(null);
  const [busy, setBusy] = useState(false);
  const [ask, setAsk] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch(`/api/booking?code=${encodeURIComponent(code)}`).then((r) => (r.ok ? r.json() : "missing")).then(setB).catch(() => setB("missing"));
  }, [code]);

  // Hỏi xác nhận ngay trên trang (không dùng confirm() của trình duyệt vì trình duyệt trong ứng dụng điện thoại hay chặn hộp thoại).
  async function cancel() {
    if (!b || b === "missing") return;
    setBusy(true); setErr("");
    try {
      const r = await fetch("/api/booking", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code, action: "cancel" }) });
      if (!r.ok) throw new Error();
      setB({ ...b, status: "cancelled" });
      setAsk(false);
    } catch { setErr(t.cancelFail); } finally { setBusy(false); }
  }

  if (b === null) return <p className="text-fg/70">{t.loading}</p>;
  if (b === "missing") return <p className="text-lg text-fg/80">{t.notFound} {t.orCall} <a href={tel} className="underline">{phone}</a>
        {telegram && <> · <a href={tgHref(telegram)} target="_blank" rel="noopener noreferrer" className="link">Telegram</a></>}</p>;

  const cancelled = b.status === "cancelled";
  const last = cancelled ? t.cancelled : b.status === "arrived" ? t.arrived : b.status === "noshow" ? t.noshow : b.status === "new" ? "" : t.confirmed;
  const steps = [t.received, last].filter(Boolean);
  const tags = [b.occasion, b.seating, ...b.taste].filter(Boolean).map((x) => tagLabel(x, lang));
  return (
    <>
      <ol className="relative mt-10 space-y-6 border-l border-fg/40 ml-1">
        {steps.map((s, i) => (
          <li key={s} className="pl-6 relative">
            <span className={`absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full ${cancelled && i === steps.length - 1 ? "bg-red" : "bg-fg"}`} />
            <span className={i === steps.length - 1 ? "text-lg font-medium" : "text-lg text-fg/75"}>{s}</span>
          </li>
        ))}
      </ol>
      <dl className="mt-14 grid grid-cols-[6rem_1fr] gap-y-3 text-[.95rem]">
        <dt className="text-fg/70">{t.whenLabel}</dt><dd className="font-medium">{fmtDate(b.date, lang)} · {fmt12(b.time)}</dd>
        <dt className="text-fg/70">{t.guestsLabel}</dt><dd className="font-medium">{b.guests === 1 ? t.guest1 : fill(t.guestsN, { n: b.guests })}</dd>
        <dt className="text-fg/70">{t.nameLabel}</dt><dd className="font-medium">{b.name}</dd>
        {b.table && <><dt className="text-fg/70">{t.seatLabel}</dt><dd className="font-medium">{b.table}</dd></>}
      </dl>
      {(tags.length > 0 || b.note || b.eventTitle) && (
        <div className="mt-12 border-l border-fg/60 pl-5">
          <p className="text-sm text-fg/80">{t.bartenderRead}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {b.eventTitle && <span className="chip font-medium">{b.eventTitle}</span>}
            {tags.map((x) => <span key={x} className="chip font-medium">{x}</span>)}
          </div>
          {b.note && <p className="text-sm mt-3 text-fg/85">“{b.note}”</p>}
        </div>
      )}
      {!cancelled && b.status !== "arrived" && (
        <>
          <p className="text-sm text-fg/80 mt-12 max-w-md">{fill(t.holdNote, { p: phone })}</p>
          {ask ? (
            <div className="mt-5 border border-line p-5 max-w-md" role="alertdialog" aria-label={t.cancelAsk}>
              <p className="font-medium">{t.cancelAsk}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" className="btn btn-danger" onClick={cancel} disabled={busy}>{busy ? t.loading : t.cancelYes}</button>
                <button type="button" className="btn btn-ghost" onClick={() => { setAsk(false); setErr(""); }} disabled={busy}>{t.cancelKeep}</button>
              </div>
            </div>
          ) : (
            <button type="button" className="btn btn-danger mt-5" onClick={() => { setErr(""); setAsk(true); }}>{t.cancelBtn}</button>
          )}
          {err && <p className="text-sm text-[#e36b6f] mt-3" role="alert">{err}</p>}
        </>
      )}
      <p className="text-sm text-fg/80 mt-6">{t.orCall} <a href={tel} className="hover:underline">{phone}</a></p>
    </>
  );
}
