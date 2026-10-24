"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { FacebookIcon, InstagramIcon, MessengerIcon, ZaloIcon } from "./Icons";
import { Lang, T, SITE } from "@/lib/content";

const KEYS = ["story", "menu", "events", "press", "gallery", "contact"] as const;

export default function Header({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const t = T[lang];
  const other = lang === "vi" ? "en" : "vi";
  const links = [
    ...KEYS.map((k) => ({ href: `/${lang}/${k}`, label: t.nav[k] })),
    { href: `/${lang}/reservation`, label: t.nav.reserve },
  ];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href={`/${lang}`} onClick={() => setOpen(false)} aria-label="Himitsu – home">
          <Logo height={34} />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-sans" aria-label="Main">
          {KEYS.map((k) => (
            <Link key={k} href={`/${lang}/${k}`} className="nav-link">
              {t.nav[k]}
            </Link>
          ))}
          <Link href={`/${other}`} className="text-muted hover:text-gold uppercase" aria-label={other === "en" ? "English" : "Tiếng Việt"}>
            {other}
          </Link>
          <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="icon-link">
            <InstagramIcon />
          </a>
          <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="icon-link">
            <FacebookIcon />
          </a>
          <Link href={`/${lang}/reservation`} className="border border-gold text-gold px-4 py-1.5 hover:bg-gold hover:text-bg transition-colors">
            {t.nav.reserve}
          </Link>
        </nav>
        <button
          className="md:hidden p-2 -mr-2"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}
        >
          <span className={`block w-6 h-0.5 bg-fg mb-1.5 transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block w-6 h-0.5 bg-fg mb-1.5 transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-fg transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>
      {open && (
        <div id="mobile-menu" className="md:hidden bg-bg border-t border-white/10 px-4 py-4 flex flex-col gap-4 font-sans">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-lg">
              {l.label}
            </Link>
          ))}
          <div className="flex items-center gap-5 pt-2">
            <a href={SITE.messenger} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <MessengerIcon /> Messenger
            </a>
            <a href={SITE.zalo} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <ZaloIcon /> Zalo
            </a>
            <Link href={`/${other}`} onClick={() => setOpen(false)} className="text-muted uppercase ml-auto">
              {other}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
