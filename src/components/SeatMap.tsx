"use client";
// Sơ đồ chỗ ngồi của quán: khách xem để chọn khu vực, bấm vào ảnh để mở bản lớn.
import Image from "next/image";
import { useState } from "react";
import type { Lang } from "@/lib/content";
import { DICT } from "@/lib/i18n";

const SIZE = { f1: [1445, 1088], f2: [1426, 1103] } as const;

export default function SeatMap({ lang }: { lang: Lang }) {
  const t = DICT[lang];
  const [floor, setFloor] = useState<"f1" | "f2">("f1");
  const [w, h] = SIZE[floor];
  const src = `/images/maps/${floor}-${lang}.webp`;
  const label = floor === "f1" ? t.floors[0] : t.floors[1];
  return (
    <div>
      <div className="mt-4 flex gap-2" role="tablist">
        {(["f1", "f2"] as const).map((f, i) => (
          <button key={f} type="button" role="tab" aria-selected={floor === f} onClick={() => setFloor(f)}
            className={`px-4 py-1.5 text-sm border ${floor === f ? "bg-fg text-[#111] border-fg" : "border-line hover:border-fg/70"}`}>{t.floors[i]}</button>
        ))}
      </div>
      <a href={src} target="_blank" rel="noopener noreferrer" className="block mt-3 border border-line" aria-label={label}>
        <Image src={src} alt={label} width={w} height={h} sizes="(min-width:1024px) 700px, 100vw" className="w-full h-auto" />
      </a>
      <p className="text-xs text-fg/70 mt-2">{t.mapTap}</p>
    </div>
  );
}
