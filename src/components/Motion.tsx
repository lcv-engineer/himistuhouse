"use client";
// Lớp chuyển động dùng chung cho mọi trang: thanh tiến độ cuộn, màn chuyển trang, và chữ nhỏ (eyebrow) "giải mã" khi cuộn tới.
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

export default function Motion() {
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

  return (
    <>
      <div ref={bar} className="progress" aria-hidden="true" />
      {wipe > 0 && (
        <div key={wipe} className="curtain" aria-hidden="true">
          <Logo height={56} />
        </div>
      )}
    </>
  );
}
