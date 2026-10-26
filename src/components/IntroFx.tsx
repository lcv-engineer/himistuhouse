"use client";
// Phần chạy của màn chào: bụi sao xoáy thành logo trên canvas và điều khiển các pha
// gather (tụ lại) → formed (logo hiện rõ) → open (cửa mở, bụi nổ tung) → done (ẩn hẳn).
// Bấm / chạm / nhấn phím bất kỳ để mở cửa ngay.
import { useEffect } from "react";

type Dust = {
  x: number; y: number; tx: number; ty: number; vx: number; vy: number;
  a0: number; r0: number; spin: number; delay: number; dur: number;
  size: number; hue: number; light: number; alpha: number; ph: number; orbit: boolean;
};

const GATHER = 2300; // ms bụi sao xoáy lại
const HOLD = 800;    // ms logo đứng yên, toả sáng
const OPEN = 1400;   // ms cửa mở tới khi ẩn hẳn

const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);

/** Lấy toạ độ các điểm có màu trong ảnh logo, theo đúng vị trí logo trên màn hình. */
function sample(img: HTMLImageElement, r: DOMRect, max: number) {
  const c = document.createElement("canvas");
  const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
  c.width = w; c.height = h;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  g.drawImage(img, 0, 0, w, h);
  const data = g.getImageData(0, 0, w, h).data;
  const pts: [number, number][] = [];
  for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) if (data[(y * w + x) * 4 + 3] > 110) pts.push([r.left + x, r.top + y]);
  // Trộn rồi lấy tối đa max điểm.
  for (let i = pts.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pts[i], pts[j]] = [pts[j], pts[i]]; }
  return pts.slice(0, max);
}

/** Đốm sáng mềm vẽ sẵn để dán nhanh lên canvas. */
function glowSprite() {
  const s = document.createElement("canvas");
  s.width = s.height = 32;
  const g = s.getContext("2d")!;
  const grd = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grd.addColorStop(0, "rgba(255,230,190,1)");
  grd.addColorStop(0.35, "rgba(255,190,120,.35)");
  grd.addColorStop(1, "rgba(255,160,90,0)");
  g.fillStyle = grd; g.fillRect(0, 0, 32, 32);
  return s;
}

export default function IntroFx() {
  useEffect(() => {
    const root = document.documentElement;
    const intro = document.querySelector<HTMLElement>(".intro");
    if (!intro || !root.classList.contains("intro-on")) return;
    const cv = intro.querySelector<HTMLCanvasElement>(".intro-cv")!;
    const img = intro.querySelector<HTMLImageElement>(".mark img");
    const ctx = cv.getContext("2d")!;
    const dpr = Math.min(devicePixelRatio || 1, 1.75);
    const W = innerWidth, H = innerHeight, cx = W / 2, cy = H / 2;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const small = W < 768;
    const sprite = glowSprite();

    let dust: Dust[] = [];
    let phase = "wait", t0 = 0, tOpen = 0, raf = 0, alive = true;
    const timers: number[] = [];
    const set = (p: string) => { phase = p; intro.dataset.phase = p; };

    const build = () => {
      const pts = img && img.naturalWidth ? sample(img, img.getBoundingClientRect(), small ? 1100 : 2400) : [];
      const R = Math.hypot(W, H) * 0.6;
      dust = pts.map(([tx, ty]) => ({
        x: 0, y: 0, tx, ty, vx: 0, vy: 0,
        a0: Math.random() * Math.PI * 2, r0: R * (0.55 + Math.random() * 0.6),
        spin: (2.2 + Math.random() * 2.2) * (Math.random() < 0.85 ? 1 : -1),
        delay: Math.random() * 650, dur: 1250 + Math.random() * 600,
        size: 0.8 + Math.random() * 1.5,
        hue: Math.random() < 0.06 ? 356 : 32 + Math.random() * 16, light: 62 + Math.random() * 26,
        alpha: 0.55 + Math.random() * 0.45, ph: Math.random() * 6.28, orbit: false,
      }));
      // Bụi quay quanh như dải ngân hà, không tham gia tạo logo.
      const extra = small ? 160 : 380;
      for (let i = 0; i < extra; i++) {
        dust.push({
          x: 0, y: 0, tx: cx, ty: cy, vx: 0, vy: 0,
          a0: Math.random() * Math.PI * 2, r0: Math.min(W, H) * (0.25 + Math.random() * 0.75),
          spin: 0.15 + Math.random() * 0.35, delay: Math.random() * 900, dur: 0,
          size: 0.6 + Math.random() * 1.2, hue: Math.random() < 0.1 ? 356 : 36 + Math.random() * 14, light: 70 + Math.random() * 20,
          alpha: 0.2 + Math.random() * 0.5, ph: Math.random() * 6.28, orbit: true,
        });
      }
    };

    const open = () => {
      if (phase === "open" || phase === "done") return;
      // Mỗi hạt bay ra xa tâm, nghiêng về phía cánh cửa gần nó.
      for (const d of dust) {
        const dx = d.x - cx, dy = d.y - cy, len = Math.hypot(dx, dy) || 1;
        const sp = 3 + Math.random() * 11;
        d.vx = (dx / len) * sp + Math.sign(dx || 1) * (2 + Math.random() * 6);
        d.vy = (dy / len) * sp * 0.6 - Math.random() * 1.5;
      }
      tOpen = performance.now();
      set("open");
      root.classList.remove("intro-on"); // hero bắt đầu chạy hoạt ảnh
      timers.push(window.setTimeout(() => { set("done"); root.classList.add("no-intro"); stop(); }, OPEN));
    };

    const frame = (now: number) => {
      if (!alive) return;
      const t = now - t0;
      // Mờ dần khung cũ thay vì xoá hẳn để hạt để lại vệt như sao chổi.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = phase === "open" ? "rgba(0,0,0,.18)" : "rgba(0,0,0,.26)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      const fade = phase === "open" ? Math.max(0, 1 - (now - tOpen) / OPEN) : 1;

      for (const d of dust) {
        let a = d.alpha;
        if (phase === "open") {
          d.x += d.vx; d.y += d.vy; d.vx *= 0.975; d.vy *= 0.975; d.vy += 0.02;
          a *= fade;
        } else if (d.orbit) {
          const ang = d.a0 + (t / 1000) * d.spin;
          d.x = cx + Math.cos(ang) * d.r0;
          d.y = cy + Math.sin(ang) * d.r0 * 0.32;
          a *= Math.min(1, Math.max(0, (t - d.delay) / 600)) * (0.6 + 0.4 * Math.sin(t / 300 + d.ph));
        } else {
          const p = Math.min(1, Math.max(0, (t - d.delay) / d.dur));
          const e = ease(p);
          // Xoáy hình elip (như thiên hà nhìn nghiêng) rồi thu về đúng điểm trên logo.
          const ang = d.a0 + d.spin * (1 - e);
          const r = d.r0 * (1 - e) ** 1.4;
          const jitter = phase === "formed" ? Math.sin(t / 180 + d.ph) * 0.5 : 0;
          d.x = d.tx + Math.cos(ang) * r + jitter;
          d.y = d.ty + Math.sin(ang) * r * 0.45 + jitter;
          // Khi logo thật đã hiện: bụi chỉ còn lấp lánh lác đác.
          a *= Math.min(1, p * 3) * (phase === "formed" ? 0.08 + 0.5 * Math.max(0, Math.sin(t / 160 + d.ph)) ** 3 : 1);
        }
        if (a <= 0.01) continue;
        const s = d.size * 7;
        ctx.globalAlpha = a * 0.32;
        ctx.drawImage(sprite, d.x - s / 2, d.y - s / 2, s, s);
        ctx.globalAlpha = a;
        ctx.fillStyle = `hsl(${d.hue} 95% ${d.light}%)`;
        ctx.fillRect(d.x - d.size / 2, d.y - d.size / 2, d.size, d.size);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      alive = false;
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      removeEventListener("pointerdown", skip);
      removeEventListener("keydown", skip);
    };
    const skip = () => { if (phase === "gather" || phase === "formed") open(); };

    const start = () => {
      if (!alive || phase !== "wait") return;
      build();
      t0 = performance.now();
      set("gather");
      raf = requestAnimationFrame(frame);
      timers.push(window.setTimeout(() => { if (phase === "gather") set("formed"); }, GATHER));
      timers.push(window.setTimeout(open, GATHER + HOLD));
    };

    addEventListener("pointerdown", skip);
    addEventListener("keydown", skip);
    // Chờ ảnh logo tải xong để lấy hình (tối đa 1,5 giây, quá thì chạy không có bụi tụ thành chữ).
    if (img && !img.complete) {
      const go = () => start();
      img.addEventListener("load", go, { once: true });
      timers.push(window.setTimeout(go, 1500));
    } else start();

    return stop;
  }, []);

  return null;
}
