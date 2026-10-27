"use client";
// Các hiệu ứng phía client: hero (đèn soi + đốm sáng), số chạy, ảnh trôi, hàng ảnh kéo ngang, bụi sao nổ chúc mừng.
// Không còn hiệu ứng chạy theo con trỏ (khách thấy khựng, lag).
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowIcon } from "./Icons";

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

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

type Mote = { x: number; y: number; r: number; vy: number; ph: number; sp: number; hue: number; a: number };

/**
 * Hiệu ứng nền hero: một quầng đèn ấm tự trôi chậm (như soi đèn trong quán tối)
 * và những đốm sáng bokeh trôi lên chậm.
 */
export function HeroFx() {
  const light = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const L = light.current;
    const hero = L?.parentElement;
    const c = cv.current;
    if (!L || !hero || !c || reduced()) return;
    const lamp: HTMLDivElement = L;
    const ctx = c.getContext("2d")!;
    const fine = matchMedia("(pointer: fine)").matches;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    let w = 0, h = 0, raf = 0, visible = true, alive = true;
    let lx = 0, ly = 0, tx = 0, ty = 0;

    const size = () => {
      const b = hero.getBoundingClientRect();
      w = b.width; h = b.height;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      tx = lx = w * 0.68; ty = ly = h * 0.42;
    };
    size();

    const n = fine ? 34 : 16;
    const motes: Mote[] = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h, r: 1.5 + Math.random() ** 2 * 16,
      vy: 0.08 + Math.random() * 0.3, ph: Math.random() * 6.28, sp: 0.004 + Math.random() * 0.01,
      hue: Math.random() < 0.18 ? 356 : 28 + Math.random() * 16, a: 0.15 + Math.random() * 0.4,
    }));

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); } });
    io.observe(hero);

    let t = 0;
    function tick() {
      if (!alive || !visible || document.hidden) return;
      t += 1;
      tx = w * (0.62 + Math.sin(t / 260) * 0.2); ty = h * (0.45 + Math.cos(t / 330) * 0.16);
      lx += (tx - lx) * 0.07; ly += (ty - ly) * 0.07;
      lamp.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const m of motes) {
        m.y -= m.vy; m.ph += m.sp;
        m.x += Math.sin(m.ph) * 0.25;
        if (m.y < -30) { m.y = h + 30; m.x = Math.random() * w; }
        const tw = m.a * (0.6 + 0.4 * Math.sin(m.ph * 2));
        const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r);
        g.addColorStop(0, `hsla(${m.hue}, 90%, 72%, ${tw})`);
        g.addColorStop(0.4, `hsla(${m.hue}, 90%, 62%, ${tw * 0.35})`);
        g.addColorStop(1, `hsla(${m.hue}, 90%, 50%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.283); ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    const vis = () => { if (!document.hidden) { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); } };
    document.addEventListener("visibilitychange", vis);
    addEventListener("resize", size);
    return () => {
      alive = false;
      cancelAnimationFrame(raf); io.disconnect();
      document.removeEventListener("visibilitychange", vis);
      removeEventListener("resize", size);
    };
  }, []);

  return (
    <>
      <div ref={light} className="hero-light" aria-hidden="true" />
      <canvas ref={cv} className="hero-motes" aria-hidden="true" />
    </>
  );
}

/** Số chạy từ 0 khi cuộn tới, ví dụ "−50%". Máy chủ in sẵn giá trị cuối. */
export function CountUp({ value, ms = 1600 }: { value: string; ms?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);
  useEffect(() => {
    const m = value.match(/^(\D*)(\d+)(.*)$/);
    const el = ref.current;
    if (!m || !el || reduced()) return;
    const [, pre, num, post] = m;
    const end = +num;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / ms);
        const k = p === 1 ? 1 : 1 - 2 ** (-10 * p);
        setText(`${pre}${Math.round(end * k)}${post}`);
        if (p < 1) raf = requestAnimationFrame(step);
      };
      setText(`${pre}0${post}`);
      raf = requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, ms]);
  return <span ref={ref} className="tabular-nums">{text}</span>;
}

/** Ảnh nền trôi chậm hơn trang khi cuộn (đặt --py cho phần tử con đầu tiên). */
export function Parallax({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    const bg = el?.firstElementChild as HTMLElement | null;
    if (!el || !bg || reduced()) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        // -1 khi khối vừa chạm đáy màn hình, 1 khi vừa rời đỉnh.
        const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - innerHeight / 2) / (innerHeight / 2 + r.height / 2)));
        bg.style.setProperty("--py", `${(-p * 8).toFixed(2)}%`);
        el.style.setProperty("--pp", p.toFixed(3));
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, []);
  return <section ref={ref} className={className}>{children}</section>;
}

/**
 * Hàng ảnh lướt ngang. Điện thoại: vuốt. Máy tính: kéo bằng chuột (con trỏ hiện chữ "Kéo"),
 * hoặc bấm nút trước / tiếp. Ảnh nghiêng nhẹ theo tốc độ kéo.
 */
export function Slider({ children, prev, next, drag }: { children: React.ReactNode; prev: string; next: string; drag: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const go = (d: number) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: d * el.clientWidth * 0.8, behavior: "smooth" });
  };

  // Kéo bằng chuột để lướt ngang, thả ra thì trượt tiếp theo đà.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let down = false, sx = 0, sl = 0, last = 0, v = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true; sx = e.clientX; sl = el.scrollLeft; last = e.clientX;
      el.classList.add("dragging");
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      el.scrollLeft = sl - (e.clientX - sx);
      v = last - e.clientX; last = e.clientX;
    };
    const onUp = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      el.classList.remove("dragging");
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      // Đà trượt tiếp sau khi thả chuột.
      el.scrollBy({ left: v * 12, behavior: "smooth" });
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div>
      <div ref={ref} className="hscroll" data-cursor={drag} onDragStart={(e) => e.preventDefault()}>{children}</div>
      <div className="hidden md:flex justify-end gap-2 mt-5">
        <button type="button" aria-label={prev} onClick={() => go(-1)} className="btn btn-ghost !p-3"><ArrowIcon className="w-4 h-4 rotate-180" /></button>
        <button type="button" aria-label={next} onClick={() => go(1)} className="btn btn-ghost !p-3"><ArrowIcon className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; hue: number };

/** Bụi sao vàng nổ tung từ chỗ đặt component rồi rơi xuống – dùng khi đặt bàn thành công. */
export function Burst() {
  const ref = useRef<HTMLCanvasElement>(null);
  const anchor = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const c = ref.current;
    const host = anchor.current?.parentElement;
    if (!c || !host || reduced()) return;
    const ctx = c.getContext("2d")!;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const W = innerWidth, H = innerHeight;
    c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Chờ trang cuộn mượt lên đầu (ReserveFlow gọi scrollTo) rồi mới lấy vị trí điểm nổ.
    let raf = 0, last = 0, ox = 0, oy = 0;
    const n = W < 768 ? 140 : 260;
    let sparks: Spark[] = [];
    const make = () => Array.from({ length: n }, (): Spark => {
      const a = Math.random() * Math.PI * 2, sp = 2 + Math.random() ** 0.6 * 11;
      return { x: ox, y: oy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 3, life: 0, max: 1300 + Math.random() * 1200, size: 1 + Math.random() * 2.2, hue: Math.random() < 0.15 ? 356 : 34 + Math.random() * 16 };
    });
    const tick = (now: number) => {
      const dt = Math.min(40, now - last); last = now;
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      let alive = 0;
      for (const p of sparks) {
        p.life += dt;
        if (p.life > p.max) continue;
        alive++;
        p.x += p.vx; p.y += p.vy; p.vx *= 0.97; p.vy = p.vy * 0.97 + 0.16;
        const k = 1 - p.life / p.max;
        // Lấp lánh: độ sáng dao động nhanh.
        ctx.globalAlpha = k * (0.55 + 0.45 * Math.sin(p.life / 40 + p.size * 9));
        ctx.fillStyle = `hsl(${p.hue} 95% 72%)`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (0.5 + k), 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (alive) raf = requestAnimationFrame(tick); else setGone(true);
    };
    const t = window.setTimeout(() => {
      const b = host.getBoundingClientRect();
      ox = b.left + Math.min(b.width, 520) / 2; oy = Math.max(80, b.top + 60);
      sparks = make(); last = performance.now();
      raf = requestAnimationFrame(tick);
    }, 550);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, []);
  // Canvas gắn thẳng vào <body>: <main> có transform nên position: fixed bên trong sẽ bị lệch.
  return (
    <>
      <span ref={anchor} hidden />
      {!gone && createPortal(<canvas ref={ref} className="burst" aria-hidden="true" />, document.body)}
    </>
  );
}
