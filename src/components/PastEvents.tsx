"use client";
// Sự kiện đã qua: một ảnh lớn, hai mũi tên (và vuốt trên điện thoại) để lướt qua từng ảnh; tên, ngày, giờ của sự kiện hiện bên dưới ảnh.
import Image from "next/image";
import { useRef, useState } from "react";

export type PastSlide = { img: string; title: string; day: string; month: string; time: string; price: string; ended: string };

const Arrow = ({ dir }: { dir: "prev" | "next" }) => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
  </svg>
);

export default function PastEvents({ slides }: { slides: PastSlide[] }) {
  const [cur, setCur] = useState(0);
  const x0 = useRef<number | null>(null);
  const n = slides.length;
  if (!n) return null;
  const i = Math.min(cur, n - 1);
  const s = slides[i];
  const go = (d: number) => setCur((c) => (Math.min(c, n - 1) + d + n) % n);
  const btn = "absolute top-1/2 -translate-y-1/2 z-10 w-11 h-11 grid place-items-center rounded-full bg-black/55 text-white hover:bg-black/80 focus-visible:outline outline-2 outline-white";
  return (
    <div className="max-w-4xl">
      <div className="relative overflow-hidden aspect-[3/2] bg-fg/5"
        onTouchStart={(e) => { x0.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => { if (x0.current === null) return; const dx = e.changedTouches[0].clientX - x0.current; x0.current = null; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); }}>
        {s.img && <Image key={s.img} src={s.img} alt={s.title} fill sizes="(min-width:1024px) 896px, 100vw" className="object-cover" />}
        {n > 1 && (
          <>
            <button type="button" className={`${btn} left-3`} aria-label="Previous" onClick={() => go(-1)}><Arrow dir="prev" /></button>
            <button type="button" className={`${btn} right-3`} aria-label="Next" onClick={() => go(1)}><Arrow dir="next" /></button>
            <span className="absolute right-3 bottom-3 z-10 text-xs font-semibold px-2 py-1 rounded-full bg-black/55 text-white">{i + 1} / {n}</span>
          </>
        )}
      </div>
      <div className="flex gap-4 md:gap-6 mt-5 min-w-0">
        <div className="text-center shrink-0">
          <p className="serif text-4xl md:text-5xl leading-none">{s.day}</p>
          <p className="eyebrow mt-2">{s.month}</p>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="serif text-2xl md:text-3xl break-words">{s.title}</h3>
          <p className="text-sm text-fg/85 mt-2 flex flex-wrap items-center gap-3">
            {s.time}
            {s.price && <span className="chip">{s.price}</span>}
            <span className="text-fg/70">{s.ended}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
