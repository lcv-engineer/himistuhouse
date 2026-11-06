"use client";
// Mô tả dài: giữ nguyên xuống dòng, chỉ hiện vài dòng đầu và có nút "Đọc tiếp" khi bị cắt.
import { useLayoutEffect, useRef, useState } from "react";
import type { Lang } from "@/lib/content";
import { DICT } from "@/lib/i18n";

export default function Desc({ text, lang, lines = 5, className = "" }: { text: string; lang: Lang; lines?: number; className?: string }) {
  const t = DICT[lang];
  const ref = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [cut, setCut] = useState(false);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || open) return;
    const check = () => setCut(el.scrollHeight > el.clientHeight + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, open, lines]);
  if (!text) return null;
  return (
    <div className={className}>
      <p ref={ref} className="whitespace-pre-line leading-relaxed max-w-prose break-words [overflow-wrap:anywhere]"
        style={open ? undefined : { display: "-webkit-box", WebkitLineClamp: lines, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{text}</p>
      {(cut || open) && <button type="button" className="link text-sm mt-2" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? t.readLess : t.readMore}</button>}
    </div>
  );
}
