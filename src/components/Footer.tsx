import Logo from "./Logo";
import { FacebookIcon, InstagramIcon, MessengerIcon, ZaloIcon } from "./Icons";
import { Lang, Content, zaloUrl } from "@/lib/content";

export default function Footer({ lang, c }: { lang: Lang; c: Content }) {
  const t = c.t[lang];
  const s = c.site;
  const ic = "inline-flex items-center gap-2 hover:text-gold transition-colors";
  return (
    <footer className="border-t border-white/10 mt-20 font-sans">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3 text-sm">
        <Logo height={44} />
        <div>
          <p className="text-gold uppercase tracking-widest text-xs mb-2">{t.address}</p>
          <p>{s.address}</p>
          <p className="text-muted mt-1">{s.hours}</p>
        </div>
        <div>
          <p className="text-gold uppercase tracking-widest text-xs mb-2">{t.follow}</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href={s.instagram} target="_blank" rel="noopener noreferrer" className={ic}><InstagramIcon /> Instagram</a>
            <a href={s.facebook} target="_blank" rel="noopener noreferrer" className={ic}><FacebookIcon /> Facebook</a>
            <a href={s.messenger} target="_blank" rel="noopener noreferrer" className={ic}><MessengerIcon /> Messenger</a>
            <a href={zaloUrl(s)} target="_blank" rel="noopener noreferrer" className={ic}><ZaloIcon /> Zalo</a>
          </div>
        </div>
      </div>
      <p className="text-center text-xs text-muted pb-6">© {s.name}. {t.rights}</p>
    </footer>
  );
}
