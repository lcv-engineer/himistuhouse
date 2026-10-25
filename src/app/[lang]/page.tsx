import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/Logo";
import Reveal from "@/components/Reveal";
import EventRsvp from "@/components/EventRsvp";
import { HeroFade, OpenStatus, Shoji, Tilt } from "@/components/fx";
import { More, Wrap } from "@/components/ui";
import { DICT, fill } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { getContent } from "@/lib/content-server";
import { fmt12, fmtDate, vnNow } from "@/lib/time";

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

// Đọc nội dung mới ở mỗi lượt truy cập, xem [lang]/layout.tsx.
export const instant = false;

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await getLang(params);
  const c = await getContent();
  const t = DICT[lang];
  const s = c.site;
  const today = vnNow().date;
  const signature = c.menu.flatMap((m) => (m.visible ? m.items : [])).filter((i) => i.visible && i.signature);
  const happy = c.promos.find((p) => p.visible && p.weekday === -1);
  const weekly = c.promos.filter((p) => p.visible && p.weekday >= 0).sort((a, b) => a.weekday - b.weekday);
  const next = c.events.filter((e) => e.published && e.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0];
  const moments = c.gallery.slice(0, 7);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url("${c.photos.hero}")` }} aria-hidden="true" />
        <span className="hero-kanji kanji" aria-hidden="true">秘</span>
        <Wrap className="w-full py-24">
          <HeroFade>
            <p className="eyebrow text-fg/80 fx-up" style={d(0.2)}>{t.heroEyebrow}</p>
            <h1 className="mt-6 fx-up" style={d(0.35)}>
              <span className="sr-only">Himitsu – house of cocktail</span>
              <Logo height={180} className="max-w-[78vw] h-auto" />
            </h1>
            <p className="mt-8 text-lg md:text-xl font-medium fx-up" style={d(0.55)}>{s.intro[lang]}</p>
            <div className="mt-10 flex flex-wrap gap-3 fx-up" style={d(0.7)}>
              <Link href={`/${lang}/reservation`} className="btn btn-solid">{t.nav.reserve}</Link>
              <Link href={`/${lang}/menu`} className="btn btn-ghost">{t.seeMenu}</Link>
            </div>
            <OpenStatus hours={c.hours} lang={lang} className="mt-8 fx-up" />
          </HeroFade>
        </Wrap>
        <span className="scroll-line" aria-hidden="true" />
      </section>

      {/* Dải chữ chạy */}
      <div className="marquee serif" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <div key={k} className="marquee-item">
              {[...t.marquee, ...t.marquee].map((w, i) => (
                <span key={i} className="flex items-center gap-10">
                  <span className={i % 2 ? "o" : ""}>{w}</span>
                  <span className="dot" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 01 – Câu chuyện */}
      <Wrap className="py-24 md:py-32 grid gap-12 md:grid-cols-2 items-center">
        <div className="max-w-md w-full"><Shoji src={c.photos.door} alt={s.address[lang]} /></div>
        <Reveal>
          <p className="eyebrow">{t.storyEyebrow}</p>
          <h2 className="serif text-4xl md:text-5xl mt-4 leading-tight">{t.storyTitle}</h2>
          <div className="mt-10 space-y-5 text-fg/85 text-lg leading-relaxed">{t.storyP.map((p) => <p key={p}>{p}</p>)}</div>
          <div className="serif text-2xl md:text-[1.7rem] mt-10 space-y-2">{t.storyLines.map((p) => <p key={p}>{p}</p>)}</div>
          <div className="mt-10"><More href={`/${lang}/story`}>{t.readStory}</More></div>
        </Reveal>
      </Wrap>

      {/* 02 – Signature */}
      {signature.length > 0 && (
        <Wrap className="py-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-lg">
              <p className="eyebrow">{t.sigEyebrow}</p>
              <h2 className="serif text-4xl md:text-5xl mt-4 leading-tight">{t.sigTitle}</h2>
              <p className="text-lg text-fg/80 mt-6">{t.sigSub}</p>
            </div>
            <More href={`/${lang}/menu`}>{t.fullMenu}</More>
          </Reveal>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
            {signature.map((it, i) => (
              <Reveal key={it.id} delay={i * 120}>
                <Tilt>
                  <div className="relative aspect-[4/5] overflow-hidden bg-card">
                    {it.image && <Image src={it.image} alt={it.name} fill sizes="(min-width:640px) 440px, 100vw" className="object-cover" />}
                    <span className="chip absolute left-4 top-4 bg-bg/70 backdrop-blur font-semibold">{t.signature}</span>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 mt-5">
                    <h3 className="serif text-3xl">{it.name}</h3>
                    <span className="font-semibold">{it.price}k</span>
                  </div>
                  <p className="text-sm text-fg/75 mt-2">{it.desc[lang]}</p>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </Wrap>
      )}

      {/* 03 – Ưu đãi & sự kiện */}
      <Wrap className="py-24">
        <Reveal className="max-w-lg">
          <p className="eyebrow">{t.offersEyebrow}</p>
          <h2 className="serif text-4xl md:text-5xl mt-4">{t.offersTitle}</h2>
          <p className="text-lg text-fg/80 mt-6">{t.offersSub}</p>
        </Reveal>
        <div className="mt-14 grid gap-10 md:grid-cols-[5fr_7fr] items-start">
          {happy && (
            <Reveal>
              <div className="relative border border-line p-8 md:p-10 min-h-[32rem] overflow-hidden">
                {happy.image && <Image src={happy.image} alt="" fill sizes="500px" className="object-cover opacity-[.12]" />}
                <div className="relative">
                  <p className="eyebrow flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red" />{t.happyHour}</p>
                  <p className="serif text-7xl md:text-8xl mt-10">{happy.discount}</p>
                  <p className="serif text-3xl mt-2">{fmt12(happy.start)}–{fmt12(happy.end)} {t.everyDay}</p>
                  {happy.desc[lang] && <p className="text-fg/80 mt-6">{happy.desc[lang]}</p>}
                  <OpenStatus hours={c.hours} lang={lang} className="mt-10" />
                </div>
              </div>
            </Reveal>
          )}
          <Reveal delay={120}>
            <div className="relative aspect-[6/5] overflow-hidden img-zoom">
              <Image src={next?.image || c.photos.offers} alt={next?.title[lang] ?? ""} fill sizes="(min-width:768px) 720px, 100vw" className="object-cover" />
            </div>
            {next ? (
              <div className="mt-6 flex gap-8">
                <div className="text-center shrink-0">
                  <p className="serif text-5xl leading-none">{next.date.slice(8)}</p>
                  <p className="eyebrow mt-2">{fmtDate(next.date, "en", { month: "short" })}</p>
                </div>
                <div>
                  <h3 className="serif text-3xl">{next.title[lang]}</h3>
                  <p className="text-sm text-fg/85 mt-2 flex items-center gap-3">{fmt12(next.start)}–{fmt12(next.end)}{next.price[lang] && <span className="chip">{next.price[lang]}</span>}</p>
                  {next.rsvp && <div className="mt-5"><EventRsvp lang={lang} phone={s.phone} handle={s.handle} instagram={s.instagram} address={s.address[lang]} ev={{ id: next.id, title: next.title[lang], date: next.date, start: next.start, end: next.end }} /></div>}
                </div>
              </div>
            ) : (
              <p className="mt-6 text-fg/80">{t.noEvent} <a href={s.instagram} target="_blank" rel="noopener noreferrer" className="link">{fill(t.followNext, { h: s.handle })}</a></p>
            )}
            <div className="mt-10"><More href={`/${lang}/events`}>{t.allEvents}</More></div>
          </Reveal>
        </div>
      </Wrap>

      {/* Mỗi tuần */}
      {weekly.length > 0 && (
        <Wrap className="py-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-lg">
              <p className="eyebrow">{t.weekEyebrow}</p>
              <h2 className="serif text-4xl md:text-5xl mt-4 leading-tight">{t.weekTitle}</h2>
              <p className="text-lg text-fg/80 mt-6">{t.weekSub}</p>
            </div>
            <More href={`/${lang}/menu`}>{t.seeMenu}</More>
          </Reveal>
          <div className="mt-14 grid gap-6 grid-cols-2 lg:grid-cols-4">
            {weekly.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <div className="relative aspect-[3/4] overflow-hidden img-zoom">
                  {p.image && <Image src={p.image} alt="" fill sizes="(min-width:1024px) 300px, 50vw" className="object-cover" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute left-5 bottom-5">
                    <p className="eyebrow">{t.days[p.weekday]}</p>
                    <p className="serif text-5xl mt-2">{p.discount}</p>
                    <p className="text-sm text-fg/85 mt-1">{p.label[lang]}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Wrap>
      )}

      {/* Khoảnh khắc */}
      {moments.length > 0 && (
        <Wrap className="py-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="serif text-4xl md:text-5xl">{t.moments}</h2>
            <div className="flex flex-wrap gap-8">
              <More href={`/${lang}/gallery`}>{t.moreMoments}</More>
              <More href={s.instagram} external>@{s.handle}</More>
            </div>
          </Reveal>
          <div className="mt-12 columns-2 md:columns-3 gap-2 [&>*]:mb-2">
            {moments.map((g, i) => (
              <Reveal key={g.src + i} delay={(i % 3) * 80} className="break-inside-avoid img-zoom">
                <Image src={g.src} alt={g.alt[lang]} width={g.w} height={g.h} sizes="(min-width:768px) 420px, 50vw" className="w-full h-auto" />
              </Reveal>
            ))}
          </div>
        </Wrap>
      )}
    </>
  );
}
