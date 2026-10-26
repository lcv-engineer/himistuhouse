"use client";
// Lớp chuyển động dùng chung cho mọi trang: con trỏ tuỳ biến kèm vệt bụi sao, nút hút theo chuột,
// thanh tiến độ cuộn, màn chuyển trang, và chữ nhỏ (eyebrow) "giải mã" khi cuộn tới.
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/";

/** Chữ nhảy ký tự ngẫu nhiên rồi lần lượt hiện đúng chữ, từ trái sang phải. Chỉ đổi nội dung các nút chữ, trả lại y nguyên khi xong. */
function decode(el: HTMLElement) {
  const nodes = [...el.childNodes].filter((n): n is Text => n.nodeType === Node.TEXT_NODE);
  const finals = nodes.map((n) => n.data);
  const total = finals.reduce((a, x) => a + x.length, 0);
  if (!total) return;
  const t0 = performance.now();
  const step = (now: number) => {
    // Mỗi ký tự "chốt" sau 28ms, có thêm 220ms nhiễu ban đầu.
    const fixed = Math.floor((now - t0 - 220) / 28);
    let k = 0;
    nodes.forEach((n, i) => {
      n.data = [...finals[i]].map((ch) => (k++ < fixed || ch === " " ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join("");
    });
    if (fixed < total) requestAnimationFrame(step);
    else nodes.forEach((n, i) => { n.data = finals[i]; });
  };
  requestAnimationFrame(step);
}

// React đã hydrate phần tử này chưa (gắn khoá __reactFiber…). Phần trang stream về sau có thể hydrate muộn hơn lớp này;
// đổi chữ trước lúc đó sẽ gây lỗi lệch nội dung (#418).
const hydrated = (el: Element) => Object.keys(el).some((k) => k.startsWith("__reactFiber"));

type Mote = { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; hue: number };

export default function Motion() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const trail = useRef<HTMLCanvasElement>(null);
  const path = usePathname();
  // Mỗi lần đổi trang thì dựng lại màn chuyển (key mới), lần mở đầu tiên thì không.
  const [seen, setSeen] = useState(path);
  const [wipe, setWipe] = useState(0);
  if (seen !== path) { setSeen(path); setWipe(wipe + 1); }

  // Thanh tiến độ cuộn ở mép trên.
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        bar.current?.style.setProperty("transform", `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`);
      });
    };
    on();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);

  // Con trỏ: chấm theo sát, vòng tròn trôi theo; lớn lên trên link/nút, hiện chữ khi phần tử có data-cursor.
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || reduced()) return;
    const d = dot.current!, r = ring.current!, label = r.firstElementChild as HTMLElement;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    let x = -100, y = -100, rx = x, ry = y, raf = 0;
    let mag: HTMLElement | null = null;

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const release = () => { if (mag) { mag.style.translate = ""; mag = null; } };

    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      d.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      const t = e.target as Element;
      const field = t.closest("input, textarea, select, iframe");
      const tagged = t.closest<HTMLElement>("[data-cursor]");
      const hot = t.closest("a, button, label, [role=tab], [role=radio]");
      r.dataset.mode = field ? "hide" : tagged ? "label" : hot ? "hover" : "";
      d.dataset.mode = field ? "hide" : "";
      label.textContent = tagged?.dataset.cursor ?? "";
      // Nút hút nhẹ về phía con trỏ.
      const m = t.closest<HTMLElement>(".btn, [data-magnetic]");
      if (m !== mag) release();
      if (m) {
        const b = m.getBoundingClientRect();
        m.style.translate = `${(x - b.left - b.width / 2) * 0.22}px ${(y - b.top - b.height / 2) * 0.3}px`;
        mag = m;
      }
    };
    const out = () => { r.dataset.mode = "hide"; d.dataset.mode = "hide"; release(); };
    const down = () => r.classList.add("press");
    const up = () => r.classList.remove("press");

    addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", out);
    addEventListener("pointerdown", down);
    addEventListener("pointerup", up);
    raf = requestAnimationFrame(loop);
    return () => {
      root.classList.remove("has-cursor");
      removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", out);
      removeEventListener("pointerdown", down);
      removeEventListener("pointerup", up);
      cancelAnimationFrame(raf);
      release();
    };
  }, []);

  // Vệt bụi sao theo con trỏ: hạt sinh ra theo quãng đường chuột đi, bay lên nhẹ rồi tắt. Không có hạt thì ngừng vẽ.
  useEffect(() => {
    const c = trail.current;
    if (!c || !matchMedia("(pointer: fine)").matches || reduced()) return;
    const ctx = c.getContext("2d")!;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    let motes: Mote[] = [], raf = 0, last = 0, px = -1, py = -1;
    const size = () => { c.width = innerWidth * dpr; c.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size();

    const tick = (now: number) => {
      const dt = Math.min(48, now - (last || now)); last = now;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.globalCompositeOperation = "lighter";
      motes = motes.filter((m) => (m.life += dt) < m.max);
      for (const m of motes) {
        m.x += m.vx; m.y += m.vy; m.vy -= 0.012; m.vx *= 0.97;
        const k = 1 - m.life / m.max;
        const r = m.size * (0.6 + k);
        const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, r * 4);
        g.addColorStop(0, `hsla(${m.hue}, 95%, 78%, ${0.9 * k})`);
        g.addColorStop(1, `hsla(${m.hue}, 95%, 60%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(m.x, m.y, r * 4, 0, 6.283); ctx.fill();
      }
      raf = motes.length ? requestAnimationFrame(tick) : 0;
      if (!raf) last = 0;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const x = e.clientX, y = e.clientY;
      if (px < 0) { px = x; py = y; return; }
      const dist = Math.hypot(x - px, y - py);
      const n = Math.min(4, Math.floor(dist / 14));
      for (let i = 0; i < n; i++) {
        const k = (i + 1) / n;
        motes.push({
          x: px + (x - px) * k + (Math.random() - 0.5) * 6, y: py + (y - py) * k + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6 - 0.2,
          life: 0, max: 500 + Math.random() * 700, size: 0.8 + Math.random() * 1.6,
          hue: Math.random() < 0.12 ? 356 : 34 + Math.random() * 14,
        });
      }
      if (motes.length > 160) motes.splice(0, motes.length - 160);
      if (n) { px = x; py = y; }
      if (!raf && motes.length) raf = requestAnimationFrame(tick);
    };
    addEventListener("pointermove", move, { passive: true });
    addEventListener("resize", size);
    return () => { removeEventListener("pointermove", move); removeEventListener("resize", size); cancelAnimationFrame(raf); };
  }, []);

  // Chữ nhỏ (eyebrow, data-decode) giải mã khi cuộn tới; chờ màn chào mở cửa xong mới chạy.
  useEffect(() => {
    if (reduced()) return;
    const root = document.documentElement;
    const els = [...document.querySelectorAll<HTMLElement>(".eyebrow, [data-decode]")].filter((el) => !el.dataset.decoded && !el.closest(".intro") && [...el.childNodes].every((n) => n.nodeType === Node.TEXT_NODE));
    const timers: number[] = [];
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        io.unobserve(el);
        const run = () => {
          if (root.classList.contains("intro-on") || !hydrated(el)) { timers.push(window.setTimeout(run, 150)); return; }
          el.dataset.decoded = "1";
          decode(el);
        };
        run();
      }
    }, { threshold: 0.6 });
    els.forEach((el) => io.observe(el));
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, [path]);

  // Đổi trang thì trả vòng tròn về dạng thường (phần tử đang trỏ đã biến mất).
  useEffect(() => {
    if (ring.current) ring.current.dataset.mode = "";
  }, [path]);

  return (
    <>
      <div ref={bar} className="progress" aria-hidden="true" />
      <canvas ref={trail} className="trail" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
      <div ref={ring} className="cursor-ring" aria-hidden="true"><span /></div>
      {wipe > 0 && (
        <div key={wipe} className="curtain" aria-hidden="true">
          <Logo height={56} />
        </div>
      )}
    </>
  );
}
