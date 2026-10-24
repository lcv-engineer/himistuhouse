"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { GalleryImage, Lang } from "@/lib/content";

const PLACEHOLDERS = ["#3b2a1e", "#5a3a2a", "#2a2f3b", "#4a2f3b", "#2f3b2a", "#3b3a2a"];

export default function GalleryGrid({ lang, gallery }: { lang: Lang; gallery: GalleryImage[] }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % gallery.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + gallery.length) % gallery.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, gallery.length]);

  if (gallery.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {PLACEHOLDERS.map((c, i) => (
          <div key={i} className="aspect-square" style={{ background: `linear-gradient(135deg, ${c}, #0d0a08)` }} aria-hidden="true" />
        ))}
      </div>
    );
  }
  const cur = open === null ? null : gallery[open];
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {gallery.map((g, i) => (
          <button key={g.src + i} onClick={() => setOpen(i)} className="relative aspect-square overflow-hidden group" aria-label={g.alt[lang]}>
            <Image
              src={g.src}
              alt={g.alt[lang]}
              fill
              sizes="(min-width:768px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </button>
        ))}
      </div>
      {cur && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={cur.alt[lang]}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setOpen(null)}
        >
          <Image src={cur.src} alt={cur.alt[lang]} width={cur.w || 1200} height={cur.h || 800} sizes="100vw" className="max-h-[90vh] w-auto h-auto object-contain" />
          <button className="absolute top-4 right-4 text-3xl text-white p-2" aria-label="Close" onClick={() => setOpen(null)}>
            ×
          </button>
        </div>
      )}
    </>
  );
}
