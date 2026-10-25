import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { telHref } from "@/lib/content";
import { getLang } from "@/lib/lang";
import { getContent } from "@/lib/content-server";

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await getLang(params);
  const c = await getContent();
  const t = c.t[lang];
  const x = t.x;
  const signature = c.menu[0]?.items.slice(0, 4) ?? [];
  const heroStyle = { "--hero": `url("${c.photos.hero}")` } as React.CSSProperties;
  const call = (
    <span className="font-sans text-sm text-muted">{t.orCall} <a href={telHref(c.site)} className="text-fg underline">{c.site.hotline}</a></span>
  );
  return (
    <>
      <section className="hero -mx-4 px-4 py-24 md:py-40 text-center flex flex-col items-center" style={heroStyle}>
        <span className="hero-glow" aria-hidden="true" />
        <p className="fx-up font-sans text-xs uppercase tracking-[0.3em] text-fg" style={d(0.1)}>{t.open}</p>
        <p className="fx-up font-sans text-xs text-fg/80 mt-2 mb-8" style={d(0.25)}>{c.site.address}</p>
        <h1 className="hero-title text-6xl md:text-8xl font-medium leading-tight">{c.site.name}</h1>
        <p className="fx-up font-sans text-[0.7rem] tracking-[0.5em] uppercase text-muted mt-2" style={d(0.9)}>{c.site.tagline}</p>
        <span className="hero-line" aria-hidden="true" />
        <p className="fx-up mt-8 text-2xl md:text-4xl" style={d(1.3)}>{t.heroTitle}</p>
        <p className="fx-up mt-3 text-muted font-sans text-base" style={d(1.5)}>{t.heroSub}</p>
        <div className="fx-up mt-10 flex flex-wrap items-center justify-center gap-3" style={d(1.75)}>
          <Link href={`/${lang}/reservation`} className="inline-block bg-gold text-bg px-8 py-3 uppercase tracking-widest text-sm font-sans hover:brightness-110 hover:-translate-y-0.5 transition">{t.cta}</Link>
          <Link href={`/${lang}/menu`} className="inline-block border border-fg/60 text-fg px-8 py-3 uppercase tracking-widest text-sm font-sans hover:bg-fg hover:text-bg transition-colors">{x.seeMenu}</Link>
        </div>
        <p className="fx-up mt-4" style={d(1.9)}>{call}</p>
        <span className="scroll-cue" aria-hidden="true" />
      </section>

      <section className="py-14">
        <Reveal>
          <h2 className="h-section">{t.drinksTitle}</h2>
          <p className="text-muted font-sans text-sm mt-2 mb-8">{x.signatureSub}</p>
        </Reveal>
        <div className="snap-row md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4">
          {signature.map((dr, i) => (
            <Reveal key={dr.n + i} delay={i * 110} className="snap-item">
              <div className="card overflow-hidden h-full">
                {c.photos.drinks[i] && (
                  <Image src={c.photos.drinks[i]} alt={dr.n} width={600} height={800} sizes="(min-width:1024px) 280px, (min-width:640px) 45vw, 80vw" className="w-full aspect-[4/5] object-cover" />
                )}
                <div className="p-5">
                  <h3 className="text-gold text-xl">{dr.n}</h3>
                  <p className="body-sans text-muted mt-2">{dr.d[lang]}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-14">
        <Reveal><h2 className="h-section mb-8">{t.eventsTitle}</h2></Reveal>
        <div className="snap-row md:grid md:grid-cols-3 md:gap-4">
          {c.events.map((e, i) => (
            <Reveal key={e.t.en + i} delay={i * 130} className="snap-item">
              <div className="card overflow-hidden h-full">
                {c.photos.events[i] && (
                  <Image src={c.photos.events[i]} alt={e.t[lang]} width={800} height={533} sizes="(min-width:768px) 380px, 80vw" className="w-full aspect-[3/2] object-cover" />
                )}
                <div className="p-5">
                  <p className="font-sans text-xs text-gold uppercase tracking-widest">{e.w[lang]}</p>
                  <h3 className="mt-2 text-xl">{e.t[lang]}</h3>
                  <p className="body-sans text-muted mt-2">{e.d[lang]}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-16 text-center">
        <Reveal>
          <h2 className="h-section" style={{ whiteSpace: "normal" }}>{x.tonightTitle}</h2>
          <p className="text-muted font-sans mt-3">{x.tonightSub}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link href={`/${lang}/reservation`} className="inline-block bg-gold text-bg px-8 py-3 uppercase tracking-widest text-sm font-sans hover:brightness-110 transition">{t.cta}</Link>
            {call}
          </div>
        </Reveal>
      </section>
    </>
  );
}
