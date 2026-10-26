"use client";
// Lớp chuyển động dùng chung cho mọi trang: con trỏ tuỳ biến, nút hút theo chuột, thanh tiến độ cuộn, màn chuyển trang.
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Motion() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
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

  // Đổi trang thì trả vòng tròn về dạng thường (phần tử đang trỏ đã biến mất).
  useEffect(() => {
    if (ring.current) ring.current.dataset.mode = "";
  }, [path]);

  return (
    <>
      <div ref={bar} className="progress" aria-hidden="true" />
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
