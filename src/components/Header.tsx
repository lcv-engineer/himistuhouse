"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { FacebookIcon, InstagramIcon } from "./Icons";
import type { Lang } from "@/lib/content";
import type { Dict } from "@/lib/i18n";

const KEYS = ["story", "menu", "events", "gallery", "contact"] as const;

export default function Header({ lang, nav, instagram, facebook }: { lang: Lang; nav: Dict["nav"]; instagram: string; facebook: string }) {
  const path = usePathname() || `/${lang}`;
  // Menu điện thoại gắn với trang đang mở: chuyển trang là tự đóng.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === path;
  const setOpen = (v: boolean) => setOpenAt(v ? path : null);
  // Đổi ngôn ngữ nhưng giữ nguyên trang đang xem.
  const swap = (l: Lang) => path.replace(/^\/(vi|en)(?=\/|$)/, `/${l}`);

  // Trang chủ: đầu trang trong suốt khi còn nằm trên ảnh hero.
  const home = path === `/${lang}`;
  const [top, setTop] = useState(true);
  useEffect(() => {
    const on = () => setTop(window.scrollY < 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenAt(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const langSwitch = (
    <span className="text-[.78rem] font-semibold tracking-[.2em]">
      {(["vi", "en"] as Lang[]).map((l, i) => (
        <span key={l}>
          {i > 0 && <span className="text-muted mx-2">/</span>}
          <Link href={swap(l)} className={l === lang ? "text-fg" : "text-muted hover:text-fg"} aria-current={l === lang ? "true" : undefined}>{l.toUpperCase()}</Link>
        </span>
      ))}
    </span>
  );

  return (
    <header className="site-head sticky top-0 z-40 bg-bg/85 backdrop-blur-md border-b border-line" data-clear={home && top && !open}>
      <div className="mx-auto max-w-[80rem] px-4 md:px-10 h-20 flex items-center justify-between gap-6">
        <Link href={`/${lang}`} aria-label="Himitsu – home" className="shrink-0"><Logo height={42} /></Link>
        <nav className="hidden lg:flex items-center gap-8" aria-label="Main">
          {KEYS.map((k) => (
            <Link key={k} href={`/${lang}/${k}`} className="nav-link" aria-current={path.startsWith(`/${lang}/${k}`) ? "page" : undefined}><span className="roll" data-t={nav[k]}><span>{nav[k]}</span></span></Link>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-6">
          {langSwitch}
          <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:opacity-70"><InstagramIcon /></a>
          <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:opacity-70"><FacebookIcon /></a>
          <Link href={`/${lang}/reservation`} className="btn btn-solid !py-2.5 !px-5">{nav.reserve}</Link>
        </div>
        <div className="flex lg:hidden items-center gap-4">
          <Link href={`/${lang}/reservation`} className="btn btn-solid !py-2 !px-4">{nav.reserve}</Link>
          <button className="p-2 -mr-2" aria-label="Menu" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
            <span className={`block w-6 h-px bg-fg mb-2 transition-transform ${open ? "translate-y-[4.5px] rotate-45" : ""}`} />
            <span className={`block w-6 h-px bg-fg transition-transform ${open ? "-translate-y-[4.5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>
      {open && (
        <div id="mobile-menu" className="lg:hidden border-t border-line bg-bg px-4 py-6 flex flex-col gap-5">
          {KEYS.map((k) => <Link key={k} href={`/${lang}/${k}`} className="serif text-3xl">{nav[k]}</Link>)}
          <div className="flex items-center gap-6 pt-3">
            {langSwitch}
            <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon /></a>
            <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FacebookIcon /></a>
          </div>
        </div>
      )}
    </header>
  );
}
