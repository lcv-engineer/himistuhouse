"use client";
// Các hiệu ứng phía client: thẻ nghiêng, hero (đèn soi + đốm sáng), số chạy, ảnh trôi, hàng ảnh kéo ngang (màn cong 3D),
// quầng sáng theo con trỏ (kèm ảnh bay theo), bụi sao nổ chúc mừng.
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowIcon } from "./Icons";

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Thẻ nghiêng nhẹ theo vị trí chuột, kèm vệt sáng lướt trên bề mặt. */
export function Tilt({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${x * 10}deg`);
    el.style.setProperty("--rx", `${-y * 10}deg`);
    el.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
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

type Mote = { x: number; y: number; r: number; vy: number; ph: number; sp: number; hue: number; a: number };

/**
 * Hiệu ứng nền hero: một quầng đèn ấm đi theo chuột (như soi đèn trong quán tối)
 * và những đốm sáng bokeh trôi lên chậm. Trên điện thoại quầng đèn tự trôi.
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
    let mx = -9999, my = -9999, lx = 0, ly = 0, tx = 0, ty = 0;

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

    const move = (e: PointerEvent) => {
      const b = hero.getBoundingClientRect();
      mx = e.clientX - b.left; my = e.clientY - b.top;
      tx = mx; ty = my;
    };
    if (fine) hero.addEventListener("pointermove", move);

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); } });
    io.observe(hero);

    let t = 0;
    function tick() {
      if (!alive || !visible || document.hidden) return;
      t += 1;
      // Không có chuột thì quầng đèn tự đi một vòng chậm.
      if (!fine || mx < -999) { tx = w * (0.62 + Math.sin(t / 260) * 0.2); ty = h * (0.45 + Math.cos(t / 330) * 0.16); }
      lx += (tx - lx) * 0.07; ly += (ty - ly) * 0.07;
      lamp.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const m of motes) {
        m.y -= m.vy; m.ph += m.sp;
        m.x += Math.sin(m.ph) * 0.25;
        // Đốm gần con trỏ dạt ra nhẹ.
        const dx = m.x - mx, dy = m.y - my, dd = dx * dx + dy * dy;
        if (dd < 22000) { const f = (1 - dd / 22000) * 1.4; m.x += (dx / Math.sqrt(dd + 1)) * f; m.y += (dy / Math.sqrt(dd + 1)) * f; }
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
      hero.removeEventListener("pointermove", move);
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

  // Màn cong: ảnh càng xa giữa khung càng xoay nghiêng vào trong, nhỏ và tối đi một chút.
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    let raf = 0;
    const bend = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const box = el.getBoundingClientRect();
        const mid = box.left + box.width / 2;
        for (const c of el.children as HTMLCollectionOf<HTMLElement>) {
          const r = c.getBoundingClientRect();
          const d = Math.max(-1.2, Math.min(1.2, (r.left + r.width / 2 - mid) / (box.width / 2)));
          c.style.setProperty("--ry", `${(-d * 12).toFixed(2)}deg`);
          c.style.setProperty("--sc", (1 - Math.abs(d) * 0.07).toFixed(3));
          c.style.setProperty("--br", (1 - Math.min(1, Math.abs(d)) * 0.35).toFixed(3));
        }
      });
    };
    bend();
    el.addEventListener("scroll", bend, { passive: true });
    addEventListener("resize", bend);
    return () => { el.removeEventListener("scroll", bend); removeEventListener("resize", bend); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let down = false, sx = 0, sl = 0, last = 0, v = 0, raf = 0;
    const skew = () => {
      v *= 0.9;
      el.style.setProperty("--skew", `${Math.max(-6, Math.min(6, v * 0.25)).toFixed(2)}deg`);
      if (Math.abs(v) > 0.05) raf = requestAnimationFrame(skew);
      else el.style.setProperty("--skew", "0deg");
    };
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
      cancelAnimationFrame(raf); raf = requestAnimationFrame(skew);
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
      cancelAnimationFrame(raf);
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

/**
 * Quầng sáng đi theo con trỏ trong một vùng (đặt --mx, --my và data-lit lên vùng đó).
 * preview: phần tử con có data-img thì hiện ảnh đó bay theo con trỏ, nghiêng theo hướng chuột đi.
 */
export function Spot({ children, className = "", preview = false }: { children: React.ReactNode; className?: string; preview?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const pic = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !matchMedia("(pointer: fine)").matches || reduced()) return;
    let x = 0, y = 0, px = 0, py = 0, vx = 0, raf = 0, src = "";
    const loop = () => {
      px += (x - px) * 0.14; py += (y - py) * 0.14;
      vx = vx * 0.85 + (x - px) * 0.15;
      if (pic.current) pic.current.style.transform = `translate3d(${px + 28}px, ${py - 90}px, 0) rotate(${Math.max(-14, Math.min(14, vx * 0.35)).toFixed(2)}deg)`;
      raf = requestAnimationFrame(loop);
    };
    const move = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - b.left}px`);
      el.style.setProperty("--my", `${e.clientY - b.top}px`);
      el.dataset.lit = "1";
      if (!preview || !pic.current) return;
      // Ảnh định vị tuyệt đối trong vùng này: <main> có transform nên position: fixed sẽ bị lệch.
      x = e.clientX - b.left; y = e.clientY - b.top;
      const next = (e.target as Element).closest<HTMLElement>("[data-img]")?.dataset.img ?? "";
      if (next !== src) {
        src = next;
        if (src) { pic.current.src = src; if (!raf) { px = x; py = y; raf = requestAnimationFrame(loop); } }
        pic.current.dataset.on = src ? "1" : "";
      }
    };
    const leave = () => {
      delete el.dataset.lit;
      src = "";
      if (pic.current) pic.current.dataset.on = "";
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); cancelAnimationFrame(raf); };
  }, [preview]);
  return (
    <div ref={ref} className={`spot ${className}`}>
      {children}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {preview && <img ref={pic} alt="" className="float-pic" aria-hidden="true" />}
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
