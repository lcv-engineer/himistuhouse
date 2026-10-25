import { FacebookIcon, InstagramIcon, MessengerIcon, ZaloIcon } from "@/components/Icons";
import { FindUs, PageHead, Wrap } from "@/components/ui";
import { telHref } from "@/lib/content";
import { DICT } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { getContent } from "@/lib/content-server";
import { fmt12 } from "@/lib/time";

// Đọc nội dung mới ở mỗi lượt truy cập, xem [lang]/layout.tsx.
export const instant = false;

export default async function Contact({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await getLang(params);
  const c = await getContent();
  const t = DICT[lang];
  const s = c.site;
  const links = [
    { href: s.instagram, label: `@${s.handle}`, I: InstagramIcon },
    { href: s.facebook, label: "Facebook", I: FacebookIcon },
    { href: s.messenger, label: "Messenger", I: MessengerIcon },
    { href: s.zalo, label: "Zalo", I: ZaloIcon },
  ].filter((x) => x.href);
  return (
    <>
      <PageHead eyebrow={t.contactEyebrow} title={t.doorOpen} />
      <Wrap className="pt-16 grid gap-12 md:grid-cols-3">
        <div>
          <p className="eyebrow text-muted mb-4">{t.openingHours}</p>
          <ul className="space-y-2">
            {c.hours.map((h, i) => (
              <li key={i} className="flex justify-between gap-4 max-w-xs"><span className="text-fg/75">{t.days[i]}</span><span className="font-medium">{h.closed ? "—" : `${fmt12(h.open)}–${fmt12(h.close)}`}</span></li>
            ))}
          </ul>
        </div>
        <div className="space-y-3 font-medium">
          <p className="eyebrow text-muted mb-4">{t.contactEyebrow}</p>
          <p><a href={telHref(s.phone)} className="hover:underline">{s.phone}</a></p>
          {s.email && <p><a href={`mailto:${s.email}`} className="hover:underline">{s.email}</a></p>}
        </div>
        <div>
          <p className="eyebrow text-muted mb-4">{t.follow}</p>
          <ul className="space-y-3">
            {links.map(({ href, label, I }) => (
              <li key={label}><a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 hover:opacity-70"><I />{label}</a></li>
            ))}
          </ul>
        </div>
      </Wrap>
      <FindUs lang={lang} c={c} />
    </>
  );
}
