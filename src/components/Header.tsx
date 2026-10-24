"use client";
import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";
import { Lang, T, SITE } from "@/lib/content";

const KEYS = ["story", "menu", "events", "press", "gallery", "contact"] as const;

export default function Header({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const t = T[lang];
  const other = lang === "vi" ? "en" : "vi";
  const links = [...KEYS.map((k) => ({ href: `/${lang}/${k}`, label: t.nav[k] })), { href: `/${lang}/reservation`, label: t.nav.reserve }];

  return (
    <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href={`/${lang}`} onClick={() => setOpen(false)}><Logo /></Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {KEYS.map((k) => (
            <Link key={k} href={`/${lang}/${k}`} className="hover:text-gold">{t.nav[k]}</Link>
          ))}
          <Link href={`/${other}`} className="text-muted hover:text-gold uppercase">{other}</Link>
          <a href={SITE.instagram} className="text-muted hover:text-white" aria-label="Instagram">IG</a>
          <a href={SITE.facebook} className="text-muted hover:text-white" aria-label="Facebook">FB</a>
          <Link href={`/${lang}/reservation`} className="border border-gold text-gold px-4 py-1.5 hover:bg-gold hover:text-bg">{t.nav.reserve}</Link>
        </nav>
        <button className="md:hidden p-2" aria-label="Menu" onClick={() => setOpen(!open)}>
          <span className="block w-6 h-0.5 bg-fg mb-1.5" /><span className="block w-6 h-0.5 bg-fg mb-1.5" /><span className="block w-6 h-0.5 bg-fg" />
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-bg border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-lg">{l.label}</Link>
          ))}
          <div className="flex gap-4 pt-2">
            <a href={SITE.messenger} className="text-[#a855f7]">Messenger</a>
            <a href={SITE.zalo} className="text-[#0068FF]">Zalo</a>
            <Link href={`/${other}`} className="text-muted uppercase ml-auto">{other}</Link>
          </div>
        </div>
      )}
    </header>
  );
}
