import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/Logo";
import Reveal from "@/components/Reveal";
import EventRsvp from "@/components/EventRsvp";
import { CountUp, HeroFade, HeroFx, Parallax } from "@/components/fx";
import Showcase from "@/components/Showcase";
import { More, OpenDaily, PhotoRow, Split, Title, Wrap } from "@/components/ui";
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
  const drinks = c.photos.drinks.filter(Boolean);
  const happy = c.promos.find((p) => p.visible && p.weekday === -1);
  const weekly = c.promos.filter((p) => p.visible && p.weekday >= 0).sort((a, b) => a.weekday - b.weekday);
  const next = c.events.filter((e) => e.published && e.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0];
  // Trang chủ lấy 3 ảnh đầu của mỗi nhóm Khoảnh khắc.
  const moments = c.moments.flatMap((m) => m.images.slice(0, 3));

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: `url("${c.photos.hero}")` }} aria-hidden="true" />
        <HeroFx />
        <Wrap className="w-full flex-1 flex flex-col justify-center py-16">
          <HeroFade>
            <h1 className="logo-in" style={d(0.3)}>
              <span className="sr-only">Himitsu – house of cocktail</span>
              <Logo height={200} className="max-w-[80vw] h-auto" />
            </h1>
            <div className="mt-12 flex flex-wrap gap-3 fx-up" style={d(0.55)}>
              <Link href={`/${lang}/reservation`} className="btn btn-solid">{t.nav.reserve}</Link>
              <Link href={`/${lang}/menu`} className="btn btn-ghost">{t.seeMenu}</Link>
            </div>
          </HeroFade>
        </Wrap>
        {/* Dải dưới đáy: giờ mở cửa + địa chỉ, và vạch gợi ý cuộn xuống */}
        <Wrap className="w-full">
          <div className="hero-foot fx-up flex items-end justify-between gap-6 pt-6 pb-8" style={d(0.8)}>
            <div className="flex gap-3">
              <span className="dot-live mt-[.4rem] shrink-0" aria-hidden="true" />
              <OpenDaily hours={c.hours} lang={lang} address={s.address[lang]} className="max-w-md" />
            </div>
            <span className="scroll-line hidden md:block shrink-0" aria-hidden="true" />
          </div>
        </Wrap>
      </section>

      {/* Câu chuyện */}
      <Wrap className="py-16 md:py-32 grid gap-10 md:gap-12 md:grid-cols-2 items-center">
        <Reveal className="relative aspect-[4/3] md:aspect-[4/5]">
          {/* Hiệu ứng mở rèm đặt ở thẻ con: clip-path trên chính <Reveal> làm IntersectionObserver coi như không thấy. */}
          <div className="wipe absolute inset-0 overflow-hidden img-zoom">
            <Image src={c.photos.door} alt="" fill sizes="(min-width:768px) 600px, 100vw" className="object-cover object-[50%_62%]" />
          </div>
        </Reveal>
        <Reveal>
          <p className="eyebrow rule">{t.storyEyebrow}</p>
          <Title className="mt-6">{t.storyTitle}</Title>
          <div className="mt-10 space-y-5 text-fg/85 text-lg leading-relaxed">{t.storyP.map((p) => <p key={p}>{p}</p>)}</div>
          <div className="stagger serif text-2xl md:text-[1.7rem] mt-10 space-y-2 border-l border-red pl-6 tracking-tight">{t.storyLines.map((p, i) => <p key={p} style={{ "--i": i } as React.CSSProperties}>{p}</p>)}</div>
          <div className="mt-10"><More href={`/${lang}/story`}>{t.readStory}</More></div>
        </Reveal>
      </Wrap>

      {/* Signature */}
      {signature.length + drinks.length > 0 && (
        <Wrap className="py-14 md:py-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-4xl">
              <Title>{t.sigTitle}</Title>
              <p className="text-lg text-fg/80 mt-6">{t.sigSub}</p>
            </div>
            <More href={`/${lang}/menu`}>{t.fullMenu}</More>
          </Reveal>
          {/* Mỗi ly một thẻ lớn xếp chồng khi cuộn; ảnh chưa có tên (chờ anh Đạt gửi) chỉ hiện ảnh. Không giá, không nhãn trên hình (góp ý 23.10). */}
          <Showcase items={[
            ...signature.filter((it) => it.image).map((it) => ({ key: it.id, image: it.image, name: it.name, notes: it.desc[lang].split("·").map((x) => x.trim()).filter(Boolean) })),
            ...drinks.map((src, i) => ({ key: src + i, image: src })),
          ]} />
        </Wrap>
      )}

      {/* Ưu đãi & sự kiện */}
      <Wrap className="py-14 md:py-24">
        <Reveal className="max-w-2xl">
          <p className="eyebrow rule">{t.offersEyebrow}</p>
          <Title className="mt-6">{t.offersTitle}</Title>
          <p className="text-lg text-fg/80 mt-6">{t.offersSub}</p>
        </Reveal>
        <div className="mt-10 md:mt-14 grid gap-10 md:grid-cols-[5fr_7fr] items-start">
          {happy && (
            <Reveal>
              <div className="relative border border-line p-8 md:p-10 min-h-[26rem] md:min-h-[32rem] overflow-hidden flex flex-col img-zoom">
                {happy.image && <Image src={happy.image} alt="" fill sizes="500px" className="object-cover opacity-50" />}
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/75 to-bg/30" />
                <div className="relative flex-1 flex flex-col">
                  <p className="eyebrow flex items-center gap-3"><span className="dot-live" />{t.happyHour}</p>
                  <p className="serif display text-[6.5rem] md:text-[9rem] mt-auto pt-10"><CountUp value={happy.discount} /></p>
                  <p className="serif text-3xl mt-2">{fmt12(happy.start)}–{fmt12(happy.end)} {t.everyDay}</p>
                  {happy.desc[lang] && <p className="text-fg/80 mt-6">{happy.desc[lang]}</p>}
                </div>
              </div>
            </Reveal>
          )}
          <Reveal delay={120}>
            <div className="wipe relative aspect-[6/5] overflow-hidden img-zoom">
              <Image src={next?.image || c.photos.offers} alt={next?.title[lang] ?? ""} fill sizes="(min-width:768px) 720px, 100vw" className="object-cover" />
            </div>
            {next ? (
              <div className="mt-6 flex gap-6 md:gap-8">
                <div className="text-center shrink-0">
                  <p className="serif display text-6xl leading-none">{next.date.slice(8)}</p>
                  <p className="eyebrow mt-2">{fmtDate(next.date, "en", { month: "short" })}</p>
                </div>
                <div className="min-w-0">
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
        <Wrap className="py-14 md:py-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-4xl">
              <Title>{t.weekTitle}</Title>
              <p className="text-lg text-fg/80 mt-6">{t.weekSub}</p>
            </div>
            <More href={`/${lang}/menu`}>{t.seeMenu}</More>
          </Reveal>
          <div className="acc mt-10 md:mt-14 grid gap-4 md:gap-6 grid-cols-2">
            {weekly.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <div className="wipe relative aspect-[3/4] lg:aspect-auto lg:h-[32rem] overflow-hidden img-zoom">
                  {p.image && <Image src={p.image} alt="" fill sizes="(min-width:1024px) 300px, 50vw" className="object-cover" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute left-4 right-4 bottom-4 md:left-5 md:bottom-5">
                    <p className="eyebrow">{t.days[p.weekday]}</p>
                    <p className="serif display text-[2.4rem] sm:text-5xl md:text-6xl mt-2"><CountUp value={p.discount} ms={1200} /></p>
                    <p className="text-sm text-fg/85 mt-1">{p.label[lang]}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Wrap>
      )}

      {/* Khoảnh khắc – lướt ngang */}
      {moments.length > 0 && (
        <Wrap className="py-14 md:py-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <Title>{t.moments}</Title>
            <div className="flex flex-wrap gap-8">
              <More href={`/${lang}/gallery`}>{t.moreMoments}</More>
              <More href={s.instagram} external>@{s.handle}</More>
            </div>
          </Reveal>
          <PhotoRow images={moments} lang={lang} />
        </Wrap>
      )}

      {/* Hẹn gặp tối nay – khép lại trang chủ ngay trước chân trang */}
      <Parallax className="closing -mb-24 mt-10 md:mt-16 min-h-[75svh] md:min-h-[85svh] flex items-center">
        <div className="closing-bg" style={{ backgroundImage: `url("${c.photos.closing}")` }} aria-hidden="true" />
        <Wrap className="w-full py-24 md:py-40 text-center">
          <Reveal>
            <p className="eyebrow">{fill(t.openDaily, { t: fmt12(c.hours.find((h) => !h.closed)?.open ?? "17:00") })}</p>
            <h2 className="split neon serif display text-[3.2rem] md:text-8xl lg:text-9xl mt-8" aria-label={t.closingTitle}><span aria-hidden="true"><Split text={t.closingTitle} /></span></h2>
            <p className="text-lg text-fg/85 mt-8 max-w-md mx-auto">{t.closingSub}</p>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              <Link href={`/${lang}/reservation`} className="btn btn-solid">{t.nav.reserve}</Link>
              <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">{t.findUs}</a>
            </div>
          </Reveal>
        </Wrap>
      </Parallax>
    </>
  );
}
