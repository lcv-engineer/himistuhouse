"use client";
import { useEffect, useRef, useState } from "react";

// Bọc một khối để nó trượt lên và hiện dần khi cuộn tới. Không có JS thì nội dung vẫn hiện bình thường (xem .rv trong globals.css).
export default function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`rv ${on ? "in" : ""} ${className}`} style={{ "--rv-delay": `${delay}ms` } as React.CSSProperties}>
      {children}
    </div>
  );
}
