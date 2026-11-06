"use client";
// Sơ đồ quán bấm được: khách chạm vào ghế để chọn chỗ ngồi; ghế đã có người giữ quanh giờ đã chọn thì khoá.
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/content";
import { DICT, fill } from "@/lib/i18n";
import { GEO } from "@/lib/seatgeo";
import { capOf, FLOORS } from "@/lib/tables";

type Props = { lang: Lang; guests: number; taken: string[]; selected: string[]; onChange: (v: string[]) => void };

export default function SeatPicker({ lang, guests, taken, selected, onChange }: Props) {
  const t = DICT[lang];
  const [floor, setFloor] = useState<"f1" | "f2">("f1");
  // Trên điện thoại sơ đồ phóng to ~2,2 lần, kéo ngang để xem hết; bấm nút để thu về vừa màn hình.
  const [zoom, setZoom] = useState(true);
  const pan = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = pan.current;
    if (el) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
  }, [floor, zoom]);
  const { w, h, shapes } = GEO[`${floor}-${lang}`];
  const ids = FLOORS[floor].seats.map((s) => s.id);
  const label = floor === "f1" ? t.floors[0] : t.floors[1];
  const cap = capOf(selected);

  const toggle = (id: string) => {
    if (taken.includes(id)) return;
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  };

  return (
    <div>
      <div className="mt-4 flex gap-2" role="tablist">
        {(["f1", "f2"] as const).map((f, i) => (
          <button key={f} type="button" role="tab" aria-selected={floor === f} onClick={() => setFloor(f)}
            className={`px-4 py-1.5 text-sm border ${floor === f ? "bg-fg text-[#111] border-fg" : "border-line hover:border-fg/70"}`}>
            {t.floors[i]}
            {selected.some((id) => FLOORS[f].seats.some((s) => s.id === id)) && <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-red align-middle" />}
          </button>
        ))}
      </div>
      <button type="button" className="link text-sm mt-3 md:hidden" onClick={() => setZoom(!zoom)}>{zoom ? t.seatFit : t.seatZoom}</button>
      <div ref={pan} className="mt-3 border border-line overflow-x-auto md:overflow-visible">
      <div className={`relative ${zoom ? "w-[220%] md:w-full" : "w-full"}`} style={{ aspectRatio: `${w} / ${h}` }}>
        <Image src={`/images/maps/${floor}-${lang}.webp`} alt={label} fill sizes="(min-width:1024px) 700px, 100vw" className="object-contain" />
        <svg viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 w-full h-full" aria-label={label}>
          {ids.map((id) => {
            const isTaken = taken.includes(id);
            const isSel = selected.includes(id);
            const press = {
              role: "button" as const, tabIndex: isTaken ? -1 : 0, "aria-pressed": isSel, "aria-disabled": isTaken,
              "aria-label": `${id}${isTaken ? ` – ${t.seatTaken}` : ""}`,
              onClick: () => toggle(id),
              onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(id); } },
            };
            return (
              <g key={id} className={`seat${isTaken ? " tk" : ""}${isSel ? " sel" : ""}`} {...press}>
                {shapes.filter((s) => s.id === id).map((s, i) => s.kind === "circle"
                  ? <circle key={i} className="s" cx={s.cx} cy={s.cy} r={s.r + 5} strokeWidth={4} />
                  : <rect key={i} className="s" x={s.x - 6} y={s.y - 6} width={s.w + 12} height={s.h + 12} rx={10} strokeWidth={4} />)}
              </g>
            );
          })}
        </svg>
      </div>
      </div>
      {zoom && <p className="text-xs text-fg/70 mt-2 md:hidden">{t.seatPan}</p>}
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-fg/75">
        <span><i className="inline-block w-3 h-3 mr-1.5 align-middle border border-fg/50" />{t.seatFree}</span>
        <span><i className="inline-block w-3 h-3 mr-1.5 align-middle bg-fg/60" />{t.seatPick}</span>
        <span><i className="inline-block w-3 h-3 mr-1.5 align-middle bg-red/60" />{t.seatTaken}</span>
      </div>
      <p className="text-xs text-fg/70 mt-2">{t.seatHint}</p>
      <div className="mt-3 text-sm flex flex-wrap items-center gap-x-3 gap-y-1">
        {selected.length ? (
          <>
            <span>{t.seatLabel}: <b>{selected.join(", ")}</b></span>
            <button type="button" className="link" onClick={() => onChange([])}>{t.seatClear}</button>
          </>
        ) : <span className="text-fg/70">{t.seatNone}</span>}
      </div>
      {selected.length > 0 && cap < guests && <p className="text-xs text-fg/80 mt-2">{fill(t.seatFits, { c: cap, n: guests })}</p>}
    </div>
  );
}
