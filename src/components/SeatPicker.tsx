"use client";
// Sơ đồ quán bấm được: khách chạm vào ghế để chọn chỗ ngồi; ghế đã có người giữ quanh giờ đã chọn thì khoá.
import Image from "next/image";
import { useState } from "react";
import type { Lang } from "@/lib/content";
import { DICT, fill } from "@/lib/i18n";
import { capOf, FLOORS } from "@/lib/tables";

type Props = { lang: Lang; guests: number; taken: string[]; selected: string[]; onChange: (v: string[]) => void };

export default function SeatPicker({ lang, guests, taken, selected, onChange }: Props) {
  const t = DICT[lang];
  const [floor, setFloor] = useState<"f1" | "f2">("f1");
  const { w, h, seats } = FLOORS[floor];
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
      <div className="relative mt-3 border border-line" style={{ aspectRatio: `${w} / ${h}` }}>
        <Image src={`/images/maps/${floor}-${lang}.webp`} alt={label} fill sizes="(min-width:1024px) 700px, 100vw" className="object-contain" />
        <svg viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 w-full h-full" aria-label={label}>
          {seats.map((s) => {
            const isTaken = taken.includes(s.id);
            const isSel = selected.includes(s.id);
            const press = {
              role: "button" as const, tabIndex: isTaken ? -1 : 0, "aria-pressed": isSel, "aria-disabled": isTaken,
              "aria-label": `${s.id}${isTaken ? ` – ${t.seatTaken}` : ""}`,
              onClick: () => toggle(s.id),
              onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(s.id); } },
            };
            return (
              <g key={s.id} className={`seat${isTaken ? " tk" : ""}${isSel ? " sel" : ""}`} {...press}>
                {s.kind === "circle"
                  ? <circle className="s" cx={s.cx} cy={s.cy} r={s.r! + 4} strokeWidth={6} />
                  : <rect className="s" x={s.x! - 4} y={s.y! - 4} width={s.w! + 8} height={s.h! + 8} rx={12} strokeWidth={6} />}
              </g>
            );
          })}
        </svg>
      </div>
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
