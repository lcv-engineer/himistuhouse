import Logo from "./Logo";
import { FacebookIcon, InstagramIcon, MessengerIcon, ZaloIcon } from "./Icons";
import { Lang, T, SITE } from "@/lib/content";

export default function Footer({ lang }: { lang: Lang }) {
  const t = T[lang];
  const ic = "inline-flex items-center gap-2 hover:text-gold transition-colors";
  return (
    <footer className="border-t border-white/10 mt-20 font-sans">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3 text-sm">
        <Logo height={44} />
        <div>
          <p className="text-gold uppercase tracking-widest text-xs mb-2">{t.address}</p>
          <p>{SITE.address}</p>
          <p className="text-muted mt-1">{SITE.hours}</p>
        </div>
        <div>
          <p className="text-gold uppercase tracking-widest text-xs mb-2">{t.follow}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className={ic}><InstagramIcon /> Instagram</a>
            <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" className={ic}><FacebookIcon /> Facebook</a>
            <a href={SITE.messenger} target="_blank" rel="noopener noreferrer" className={ic}><MessengerIcon /> Messenger</a>
            <a href={SITE.zalo} target="_blank" rel="noopener noreferrer" className={ic}><ZaloIcon /> Zalo</a>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-muted pb-6">© Himitsu. {t.rights}</p>
    </footer>
  );
}
