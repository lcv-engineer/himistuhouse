"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { GalleryImage, Lang } from "@/lib/content";

type Section = { title: { vi: string; en: string }; images: GalleryImage[] };

// Trang Moment: mỗi phần là một hàng ảnh lướt ngang (khoảng 6 ảnh), bấm để xem lớn.
export default function GalleryGrid({ lang, sections }: { lang: Lang; sections: Section[] }) {
  const [open, setOpen] = useState<{ s: number; i: number } | null>(null);
  const cur = open ? sections[open.s]?.images[open.i] : null;

  useEffect(() => {
    if (!open) return;
    const len = sections[open.s]?.images.length ?? 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o ? { s: o.s, i: (o.i + 1) % len } : o));
      if (e.key === "ArrowLeft") setOpen((o) => (o ? { s: o.s, i: (o.i - 1 + len) % len } : o));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, sections]);

  return (
    <>
      <div className="space-y-12">
        {sections.map((sec, s) => (
          <div key={s}>
            <h2 className="text-gold uppercase tracking-[0.25em] text-xs font-sans mb-4">{sec.title[lang]}</h2>
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4 md:mx-0 md:px-0" style={{ scrollbarWidth: "thin" }}>
              {sec.images.map((g, i) => (
                <button key={g.src + i} onClick={() => setOpen({ s, i })} aria-label={g.alt[lang]} className="relative shrink-0 snap-start overflow-hidden group h-64 md:h-80 aspect-[4/5]">
                  <Image src={g.src} alt={g.alt[lang]} fill sizes="(min-width:768px) 320px, 220px" className="object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {cur && (
        <div role="dialog" aria-modal="true" aria-label={cur.alt[lang]} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setOpen(null)}>
          <Image src={cur.src} alt={cur.alt[lang]} width={cur.w || 1200} height={cur.h || 800} sizes="100vw" className="max-h-[90vh] w-auto h-auto object-contain" />
          <button className="absolute top-4 right-4 text-3xl text-white p-2" aria-label="Close" onClick={() => setOpen(null)}>×</button>
        </div>
      )}
    </>
  );
}
