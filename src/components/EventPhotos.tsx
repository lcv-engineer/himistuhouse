"use client";
// Ảnh sự kiện: hiện một ảnh, có hai mũi tên (và vuốt trên điện thoại) để lướt qua lại các ảnh. Có href thì bấm ảnh sẽ sang trang đó.
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

const Arrow = ({ dir }: { dir: "prev" | "next" }) => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
  </svg>
);

export default function EventPhotos({ images, alt, href, aspect = "aspect-[3/2]", sizes = "(min-width:768px) 520px, 100vw" }: {
  images: string[]; alt: string; href?: string; aspect?: string; sizes?: string;
}) {
  const [cur, setCur] = useState(0);
  const x0 = useRef<number | null>(null);
  if (!images.length) return null;
  const n = images.length;
  const i = Math.min(cur, n - 1);
  const go = (d: number) => setCur((c) => (Math.min(c, n - 1) + d + n) % n);
  const pic = <Image key={images[i]} src={images[i]} alt={alt} fill sizes={sizes} className="object-cover" priority={i === 0} />;
  const btn = "absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 grid place-items-center rounded-full bg-black/55 text-white hover:bg-black/80 focus-visible:outline outline-2 outline-white";
  return (
    <div className={`relative overflow-hidden img-zoom ${aspect}`}
      onTouchStart={(e) => { x0.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => { if (x0.current === null) return; const dx = e.changedTouches[0].clientX - x0.current; x0.current = null; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); }}>
      {href ? <Link href={href} className="absolute inset-0 block" aria-label={alt}>{pic}</Link> : pic}
      {n > 1 && (
        <>
          <button type="button" className={`${btn} left-3`} aria-label="Previous photo" onClick={() => go(-1)}><Arrow dir="prev" /></button>
          <button type="button" className={`${btn} right-3`} aria-label="Next photo" onClick={() => go(1)}><Arrow dir="next" /></button>
          <span className="absolute right-3 bottom-3 z-10 text-xs font-semibold px-2 py-1 rounded-full bg-black/55 text-white">{i + 1} / {n}</span>
        </>
      )}
    </div>
  );
}
