"use client";
// Phòng trưng bày các ly signature: mỗi ly một thẻ lớn dính ở đầu màn hình, thẻ sau trượt đè lên thẻ trước (thẻ trước lùi sâu và tối dần).
// Ảnh mở ra qua một cổng tròn theo nhịp cuộn, rồi tia quét hologram chạy dọc ảnh; ly lơ lửng nhẹ.
// Máy tính có thêm "kính soi": vòng tròn theo con trỏ phóng to ảnh ngay tại chỗ đó.
import Image from "next/image";
import { useEffect, useRef } from "react";

export type Exhibit = { key: string; image: string; name?: string; notes?: string[] };

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v: number) => Math.max(0, Math.min(1, v));

export default function Showcase({ items }: { items: Exhibit[] }) {
  const ref = useRef<HTMLDivElement>(null);

  // Nhịp cuộn: --e (thẻ đi vào, 0→1) mở cổng tròn; --c (bị thẻ sau che, 0→1) đẩy thẻ lùi sâu.
  useEffect(() => {
    const root = ref.current;
    if (!root || reduced()) return;
    const cards = [...root.children] as HTMLElement[];
    let raf = 0;
    const frame = () => {
      raf = 0;
      const vh = innerHeight;
      cards.forEach((el, i) => {
        const top = parseFloat(getComputedStyle(el).top) || 0;
        const r = el.getBoundingClientRect();
        const e = clamp(1 - (r.top - top) / (vh * 0.85 - top));
        const next = cards[i + 1]?.getBoundingClientRect();
        const c = next ? clamp(1 - (next.top - top) / (vh - top)) : 0;
        el.style.setProperty("--e", e.toFixed(3));
        el.style.setProperty("--c", c.toFixed(3));
        if (e > 0.92 && !el.dataset.on) el.dataset.on = "1";
      });
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(frame); };
    frame();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);

  // Kính soi theo con trỏ (chỉ chuột).
  const lens = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget, b = el.getBoundingClientRect();
    el.style.setProperty("--lx", `${e.clientX - b.left}px`);
    el.style.setProperty("--ly", `${e.clientY - b.top}px`);
    el.dataset.lens = "1";
  };
  const unlens = (e: React.PointerEvent<HTMLDivElement>) => { delete e.currentTarget.dataset.lens; };

  return (
    <div ref={ref} className="sig-deck">
      {items.map((it, i) => (
        <article key={it.key} className={`sig-card${it.name ? "" : " sig-wide"}`} style={{ "--i": i } as React.CSSProperties}>
          <div className="sig-stage">
            <div className="sig-pic" onPointerMove={lens} onPointerLeave={unlens}>
              <div className="sig-float">
                <Image src={it.image} alt={it.name ?? ""} fill sizes="(min-width:768px) 60vw, 100vw" className="object-cover" />
              </div>
              {/* Bản phóng to, chỉ lộ ra trong vòng kính soi */}
              <div className="sig-zoom" aria-hidden="true">
                <Image src={it.image} alt="" fill sizes="(min-width:768px) 60vw, 100vw" className="object-cover" />
              </div>
              <span className="sig-beam" aria-hidden="true" />
              <span className="sig-scan" aria-hidden="true" />
            </div>
            {it.name && (
              <div className="sig-meta">
                <h3 className="sig-name">{it.name}</h3>
                {it.notes && it.notes.length > 0 && (
                  <ul className="sig-notes">
                    {it.notes.map((n, k) => <li key={n} data-decode style={{ "--k": k } as React.CSSProperties}>{n}</li>)}
                  </ul>
                )}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
