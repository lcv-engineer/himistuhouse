import Link from "next/link";
import Logo from "./Logo";
import { FacebookIcon, InstagramIcon, MessengerIcon, TelegramIcon, ZaloIcon } from "./Icons";
import { Content, Lang, telHref, tgHref } from "@/lib/content";
import { DICT } from "@/lib/i18n";
import { fmt12 } from "@/lib/time";

export default function Footer({ lang, c }: { lang: Lang; c: Content }) {
  const t = DICT[lang];
  const s = c.site;
  const open = c.hours.filter((h) => !h.closed);
  const same = open.length === 7 && open.every((h) => h.open === open[0].open && h.close === open[0].close);
  const icons = [
    { href: s.instagram, label: "Instagram", I: InstagramIcon },
    { href: s.facebook, label: "Facebook", I: FacebookIcon },
    { href: s.messenger, label: "Messenger", I: MessengerIcon },
    { href: s.zalo, label: "Zalo", I: ZaloIcon },
    { href: tgHref(s.telegram), label: "Telegram", I: TelegramIcon },
  ].filter((x) => x.href);
  return (
    <footer className="border-t border-line bg-bg2 mt-24">
      <div className="mx-auto max-w-[80rem] px-4 md:px-10 py-16 grid gap-12 md:grid-cols-[2fr_1fr]">
        {/* Thông tin ghé thăm nằm thẳng hàng dưới logo */}
        <div className="space-y-8">
          <Logo height={64} />
          <div>
            <p className="eyebrow text-muted mb-3">{t.visit}</p>
            <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 font-medium hover:opacity-75">{s.address[lang]}</a>
          </div>
          <div>
            <p className="eyebrow text-muted mb-3">{t.openingHours}</p>
            {same ? (
              <p><span className="text-muted mr-6">{t.everyDayHours}</span><span className="font-semibold">{fmt12(open[0].open)}–{fmt12(open[0].close)}</span></p>
            ) : (
              <ul className="space-y-1 text-sm">
                {c.hours.map((h, i) => (
                  <li key={i} className="flex gap-4"><span className="text-muted w-24">{t.days[i]}</span><span>{h.closed ? "—" : `${fmt12(h.open)}–${fmt12(h.close)}`}</span></li>
                ))}
              </ul>
            )}
          </div>
          <div className="space-y-3 font-medium">
            <p><a href={telHref(s.phone)} className="hover:opacity-75">{s.phone}</a></p>
            {s.email && <p><a href={`mailto:${s.email}`} className="hover:opacity-75">{s.email}</a></p>}
          </div>
        </div>
        <div>
          <p className="eyebrow text-muted mb-4">{t.follow}</p>
          <div className="flex gap-5">
            {icons.map(({ href, label, I }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="hover:opacity-70"><I className="w-6 h-6" /></a>
            ))}
          </div>
          <Link href={`/${lang}/reservation`} className="btn btn-solid mt-10">{t.nav.reserve}</Link>
        </div>
      </div>
    </footer>
  );
}
