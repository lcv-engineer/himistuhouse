"use client";
// Các hiệu ứng nhỏ phía client: màn chào, trạng thái mở cửa, cửa shoji, thẻ nghiêng, hero mờ dần khi cuộn.
import { useEffect, useRef, useState } from "react";
import type { Hours, Lang } from "@/lib/content";
import { DICT, fill } from "@/lib/i18n";
import { fmt12, openState } from "@/lib/time";

/** "○ Closed · opens at 5PM" / "● Open · until 1AM" theo giờ Việt Nam. */
export function OpenStatus({ hours, lang, className = "" }: { hours: Hours[]; lang: Lang; className?: string }) {
  const [s, setS] = useState<ReturnType<typeof openState> | null>(null);
  useEffect(() => {
    const tick = () => setS(openState(hours));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [hours]);
  const t = DICT[lang];
  if (!s) return <p className={`text-sm h-5 ${className}`} />;
  const sub = s.open
    ? fill(t.until, { t: fmt12(s.until) })
    : s.inDays === 0 ? fill(t.opensAt, { t: fmt12(s.at) })
    : s.inDays === 1 ? fill(t.opensTomorrow, { t: fmt12(s.at) })
    : s.at ? fill(t.opensAt, { t: fmt12(s.at) }) : "";
  return (
    <p className={`text-sm flex items-center gap-2 ${className}`}>
      <span className={`inline-block w-2 h-2 rounded-full ${s.open ? "bg-emerald-400" : "border border-fg/70"}`} />
      <span className="font-semibold">{s.open ? t.open : t.closed}</span>
      {sub && <><span className="text-muted">·</span><span className="text-muted">{sub}</span></>}
    </p>
  );
}

function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [inView, set] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { set(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/** Ảnh nằm sau hai cánh cửa shoji, cửa trượt ra khi cuộn tới. */
export function Shoji({ src, alt }: { src: string; alt: string }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  return (
    <div ref={ref} className={`shoji ${inView ? "in" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <span className="panel l" aria-hidden="true" />
      <span className="panel r" aria-hidden="true" />
    </div>
  );
}

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
