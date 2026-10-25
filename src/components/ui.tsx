// Các khối giao diện dùng chung (render ở server).
import Link from "next/link";
import Logo from "./Logo";
import { ArrowIcon } from "./Icons";
import { Content, Lang, mapSrc, telHref } from "@/lib/content";
import { DICT } from "@/lib/i18n";

export const Wrap = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto max-w-[80rem] px-4 md:px-10 ${className}`}>{children}</div>
);

/** Đầu trang: chữ nhỏ + tiêu đề lớn, logo mờ phía sau, kanji dọc tuỳ chọn. */
export function PageHead({ eyebrow, title, kanji, children }: { eyebrow: string; title: string; kanji?: string; children?: React.ReactNode }) {
  return (
    <section className="page-head">
      <span className="ghost-logo hidden md:block"><Logo height={44} /></span>
      <Wrap className="relative pt-20 pb-14 md:pt-24">
        {kanji && <span className="kanji absolute right-6 md:right-10 top-16 text-2xl text-muted/70 [writing-mode:vertical-rl]" aria-hidden="true">{kanji}</span>}
        <p className="eyebrow fx-up">{eyebrow}</p>
        <h1 className="serif text-5xl md:text-7xl mt-4 fx-up" style={{ "--d": ".1s" } as React.CSSProperties}>{title}</h1>
        {children && <div className="mt-6 fx-up" style={{ "--d": ".2s" } as React.CSSProperties}>{children}</div>}
      </Wrap>
    </section>
  );
}

export const More = ({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) =>
  external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-2 text-sm">{children}<ArrowIcon className="w-4 h-4" /></a>
  ) : (
    <Link href={href} className="link inline-flex items-center gap-2 text-sm">{children}<ArrowIcon className="w-4 h-4" /></Link>
  );

/** Văn bản từ admin: "## " là tiêu đề, "> " là trích dẫn lớn, dòng trống tách đoạn. */
export function Prose({ text }: { text: string }) {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <>
      {blocks.map((b, i) =>
        b.startsWith("## ") ? <h2 key={i} className="serif text-3xl mt-12 mb-4">{b.slice(3)}</h2>
        : b.startsWith("> ") ? <blockquote key={i} className="serif italic text-4xl md:text-6xl leading-[1.15] text-center my-20 md:-mx-16">{b.replace(/^> ?/gm, "")}</blockquote>
        : <p key={i} className="text-lg leading-relaxed mb-6 whitespace-pre-line">{b}</p>,
      )}
    </>
  );
}

/** "The door is open every night." + địa chỉ + bản đồ. */
export function FindUs({ lang, c }: { lang: Lang; c: Content }) {
  const t = DICT[lang];
  const s = c.site;
  return (
    <Wrap className="py-24 grid gap-12 md:grid-cols-2 items-start">
      <div>
        <h2 className="serif text-4xl md:text-5xl">{t.doorOpen}</h2>
        <p className="text-lg text-fg/85 mt-6 leading-relaxed">{s.address[lang]}</p>
        {s.directions[lang] && <p className="text-muted mt-3">{s.directions[lang]}</p>}
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Link href={`/${lang}/reservation`} className="btn btn-solid">{t.nav.reserve}</Link>
          <span className="text-sm text-fg/85">{t.orCall} <a href={telHref(s.phone)} className="hover:underline">{s.phone}</a></span>
        </div>
      </div>
      <div>
        <p className="eyebrow mb-4">{t.findUs}</p>
        <iframe title={t.findUs} src={mapSrc(s)} className="w-full aspect-[4/3] border-0 grayscale-[.2]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
    </Wrap>
  );
}
