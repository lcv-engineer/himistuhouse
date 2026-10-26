"use client";
// Các hiệu ứng nhỏ phía client: thẻ nghiêng, hero mờ dần khi cuộn, hàng ảnh lướt ngang.
import { useEffect, useRef } from "react";
import { ArrowIcon } from "./Icons";

/** Thẻ nghiêng nhẹ theo vị trí chuột. */
export function Tilt({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${x * 8}deg`);
    el.style.setProperty("--rx", `${-y * 8}deg`);
  };
  const leave = () => { ref.current?.style.setProperty("--rx", "0deg"); ref.current?.style.setProperty("--ry", "0deg"); };
  return <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={`tilt ${className}`}>{children}</div>;
}

/** Nội dung hero mờ dần khi cuộn xuống. */
export function HeroFade({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const on = () => {
      const el = ref.current;
      if (!el) return;
      const p = Math.min(1, window.scrollY / (window.innerHeight * 0.7));
      el.style.opacity = String(1 - p * 0.75);
      el.style.transform = `translate3d(0, ${p * -40}px, 0)`;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

/** Hàng ảnh lướt ngang, có nút trước / tiếp trên màn hình lớn. Trên điện thoại vuốt bằng tay. */
export function Slider({ children, prev, next }: { children: React.ReactNode; prev: string; next: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const go = (d: number) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: d * el.clientWidth * 0.8, behavior: "smooth" });
  };
  return (
    <div>
      <div ref={ref} className="hscroll">{children}</div>
      <div className="hidden md:flex justify-end gap-2 mt-5">
        <button type="button" aria-label={prev} onClick={() => go(-1)} className="btn btn-ghost !p-3"><ArrowIcon className="w-4 h-4 rotate-180" /></button>
        <button type="button" aria-label={next} onClick={() => go(1)} className="btn btn-ghost !p-3"><ArrowIcon className="w-4 h-4" /></button>
      </div>
    </div>
  );
}
