"use client";
import Image from "next/image";
import { useState } from "react";
import { FLOORS } from "./SeatingMap";
import type { Lang, Texts } from "@/lib/content";

const SIZE = { f1: { w: 2000, h: 1507 }, f2: { w: 2000, h: 1545 } } as const;

export default function PublicSeatMap({
  lang, r, taken, selected, onChange,
}: { lang: Lang; r: Texts["reservation"]; taken: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const [floor, setFloor] = useState<"f1" | "f2">("f1");
  const { w, h } = SIZE[floor];

  const toggle = (id: string) => {
    if (taken.includes(id)) return;
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  };

  return (
    <div>
      <p className="text-sm text-fg mb-1">{r.mapTitle}</p>
      <p className="text-sm text-muted mb-3">{r.mapHint}</p>

      <div className="flex gap-2 mb-3" role="tablist">
        {(["f1", "f2"] as const).map((f) => (
          <button
            key={f} type="button" role="tab" aria-selected={floor === f}
            onClick={() => setFloor(f)}
            className={`px-4 py-1.5 text-sm border ${floor === f ? "bg-gold text-bg border-gold" : "border-white/20 text-fg hover:border-gold"}`}
          >
            {f === "f1" ? r.floor1 : r.floor2}
          </button>
        ))}
      </div>

      <div className="relative w-full border border-white/10" style={{ aspectRatio: `${w} / ${h}` }}>
        <Image
          src={`/images/maps/${floor}-${lang}.webp`} alt={floor === "f1" ? r.floor1 : r.floor2}
          width={w} height={h} sizes="(min-width:768px) 760px, 100vw" className="w-full h-full" priority={floor === "f1"}
        />
        <svg viewBox={`0 0 ${w} ${h}`} className="absolute inset-0 w-full h-full" aria-label={r.mapTitle}>
          {FLOORS[floor].seats.map((s) => {
            const isTaken = taken.includes(s.id);
            const isSel = selected.includes(s.id);
            const cls = `seat ${isTaken ? "tk" : ""} ${isSel ? "sel" : ""}`;
            const press = {
              role: "button" as const, tabIndex: isTaken ? -1 : 0, "aria-pressed": isSel, "aria-disabled": isTaken,
              "aria-label": `${s.id}${isTaken ? ` – ${r.mapTaken}` : ""}`,
              onClick: () => toggle(s.id),
              onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(s.id); } },
            };
            return s.kind === "circle" ? (
              <g key={s.id} className={cls} {...press}><circle className="s" cx={s.cx} cy={s.cy} r={s.r! + 4} strokeWidth={6} /></g>
            ) : (
              <g key={s.id} className={cls} {...press}><rect className="s" x={s.x! - 4} y={s.y! - 4} width={s.w! + 8} height={s.h! + 8} rx={12} strokeWidth={6} /></g>
            );
          })}
        </svg>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-xs text-muted">
        <span><i className="inline-block w-3 h-3 mr-1 align-middle border border-white/40" />{r.mapLegendFree}</span>
        <span><i className="inline-block w-3 h-3 mr-1 align-middle" style={{ background: "rgba(201,161,91,.7)" }} />{r.mapLegendPick}</span>
        <span><i className="inline-block w-3 h-3 mr-1 align-middle" style={{ background: "rgba(220,70,70,.7)" }} />{r.mapLegendTaken}</span>
      </div>

      <div className="mt-3 text-sm flex flex-wrap items-center gap-3">
        {selected.length ? (
          <>
            <span>{r.mapSelected}: <b className="text-gold">{selected.join(", ")}</b></span>
            <button type="button" onClick={() => onChange([])} className="underline text-muted hover:text-fg">{r.mapClear}</button>
          </>
        ) : <span className="text-muted">{r.mapNone}</span>}
      </div>
    </div>
  );
}
