// Các khối giao diện dùng chung (render ở server).
import Image from "next/image";
import Link from "next/link";
import Logo from "./Logo";
import { ArrowIcon } from "./Icons";
import { Slider } from "./fx";
import { Content, GalleryImage, Hours, Lang, mapSrc, telHref } from "@/lib/content";
import { DICT, fill } from "@/lib/i18n";
import { fmt12 } from "@/lib/time";

export const Wrap = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto max-w-[80rem] px-4 md:px-10 ${className}`}>{children}</div>
);

/** Đầu trang: chữ nhỏ + tiêu đề lớn, logo mờ phía sau. */
export function PageHead({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <section className="page-head">
      <span className="ghost-logo hidden md:block"><Logo height={44} /></span>
      <Wrap className="relative pt-20 pb-14 md:pt-24">
        {eyebrow && <p className="eyebrow fx-up">{eyebrow}</p>}
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

/** "Everyday, Himitsu open at 5PM" – giờ mở cửa lấy từ ngày mở đầu tiên trong tuần. */
export function OpenDaily({ hours, lang, address, className = "" }: { hours: Hours[]; lang: Lang; address?: string; className?: string }) {
  const first = hours.find((h) => !h.closed);
  if (!first) return null;
  return (
    <div className={`text-sm ${className}`}>
      <p className="font-semibold">{fill(DICT[lang].openDaily, { t: fmt12(first.open) })}</p>
      {address && <p className="text-fg/80 mt-1.5">{address}</p>}
    </div>
  );
}

// *chữ* trong văn bản admin thành chữ nghiêng.
const em = (s: string) => s.split(/\*([^*\n]+)\*/).map((x, i) => (i % 2 ? <em key={i}>{x}</em> : x));

/** Văn bản từ admin: "## " là tiêu đề, "> " là trích dẫn lớn, dòng trống tách đoạn, *chữ* là nghiêng. */
export function Prose({ text }: { text: string }) {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <>
      {blocks.map((b, i) =>
        b.startsWith("## ") ? <h2 key={i} className="serif text-3xl mt-12 mb-4">{b.slice(3)}</h2>
        : b.startsWith("> ") ? <blockquote key={i} className="serif italic text-4xl md:text-6xl leading-[1.15] text-center my-20 md:-mx-16">{b.replace(/^> ?/gm, "")}</blockquote>
        : <p key={i} className="text-lg leading-relaxed mb-6 whitespace-pre-line">{em(b)}</p>,
      )}
    </>
  );
}

/** Hàng ảnh lướt ngang, không chú thích. */
export function PhotoRow({ images, lang }: { images: GalleryImage[]; lang: Lang }) {
  const t = DICT[lang];
  return (
    <Slider prev={t.prev} next={t.next}>
      {images.map((g, i) => (
        <div key={g.src + i} className="relative h-[22rem] md:h-[30rem] overflow-hidden img-zoom" style={{ aspectRatio: `${g.w} / ${g.h}` }}>
          <Image src={g.src} alt={g.alt[lang]} fill sizes="(min-width:768px) 720px, 90vw" className="object-cover" />
        </div>
      ))}
    </Slider>
  );
}

/** Địa chỉ + nút đặt bàn + bản đồ (trang Liên hệ). */
export function FindUs({ lang, c }: { lang: Lang; c: Content }) {
  const t = DICT[lang];
  const s = c.site;
  return (
    <Wrap className="py-24 grid gap-12 md:grid-cols-2 items-start">
      <div>
        <p className="eyebrow mb-4">{t.visit}</p>
        <p className="serif text-3xl md:text-4xl leading-snug">{s.address[lang]}</p>
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
