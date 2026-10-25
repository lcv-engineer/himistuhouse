import Link from "next/link";
import Logo from "./Logo";
import { FacebookIcon, InstagramIcon, MessengerIcon, ZaloIcon } from "./Icons";
import { Lang, Content, zaloUrl, telHref } from "@/lib/content";

export default function Footer({ lang, c }: { lang: Lang; c: Content }) {
  const t = c.t[lang];
  const s = c.site;
  const ic = "inline-flex items-center gap-2 hover:text-gold transition-colors";
  return (
    <footer className="border-t border-white/10 mt-20 font-sans">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3 text-sm">
        <div className="flex flex-col items-start gap-4">
          <Logo height={44} />
          <Link href={`/${lang}/reservation`} className="inline-block border border-gold text-gold px-6 py-2 uppercase tracking-widest text-xs hover:bg-gold hover:text-bg transition-colors">{t.nav.reserve}</Link>
        </div>
        <div>
          <p className="text-gold uppercase tracking-widest text-xs mb-2">{t.address}</p>
          <p>{s.address}</p>
          <p className="text-muted mt-1">{s.hours}</p>
          <p className="mt-1"><a href={telHref(s)} className="hover:text-gold">{s.hotline}</a></p>
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
