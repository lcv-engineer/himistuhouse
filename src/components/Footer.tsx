import Logo from "./Logo";
import { Lang, T, SITE } from "@/lib/content";

export default function Footer({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3 text-sm">
        <Logo />
        <div>
          <p className="text-gold uppercase tracking-widest text-xs mb-2">{t.address}</p>
          <p>{SITE.address}</p>
          <p className="text-muted mt-1">{SITE.hours}</p>
        </div>
        <div>
          <p className="text-gold uppercase tracking-widest text-xs mb-2">{t.follow}</p>
          <div className="flex gap-4">
            <a href={SITE.instagram} className="text-[#E1306C]">Instagram</a>
            <a href={SITE.facebook} className="text-[#1877F2]">Facebook</a>
            <a href={SITE.zalo} className="text-[#0068FF]">Zalo</a>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-muted pb-6">© Himitsu. {t.rights}</p>
    </footer>
  );
}
