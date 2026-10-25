import Image from "next/image";
import Link from "next/link";
import { Lang, telHref } from "@/lib/content";
import { getContent } from "@/lib/content-server";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const c = await getContent();
  const t = c.t[lang];
  const drinks = c.menu[0]?.items.slice(0, 4) ?? [];
  const heroStyle = { "--hero": `url("${c.photos.hero}")` } as React.CSSProperties;
  return (
    <>
      <section className="hero -mx-4 px-4 py-24 md:py-40 text-center flex flex-col items-center" style={heroStyle}>
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted">{t.open}</p>
        <p className="font-sans text-xs text-muted/80 mt-2 mb-8">{c.site.address}</p>
        <h1 className="text-5xl md:text-7xl text-gold font-medium">{c.site.name}</h1>
        <p className="font-sans text-[0.7rem] tracking-[0.5em] uppercase text-muted mt-2">{c.site.tagline}</p>
        <p className="mt-10 text-2xl md:text-4xl">{t.heroTitle}</p>
        <p className="mt-3 text-muted font-sans text-base">{t.heroSub}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
          <Link href={`/${lang}/reservation`} className="inline-block bg-gold text-bg px-8 py-3 uppercase tracking-widest text-sm font-sans hover:brightness-110">{t.cta}</Link>
          <span className="font-sans text-sm text-muted">{t.orCall} <a href={telHref(c.site)} className="text-fg underline">{c.site.hotline}</a></span>
        </div>
      </section>

      <section className="py-14">
        <h2 className="h-section mb-8">{t.drinksTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {drinks.map((d, i) => (
            <div key={d.n + i} className="card overflow-hidden">
              {c.photos.drinks[i] && (
                <Image src={c.photos.drinks[i]} alt={d.n} width={600} height={800} sizes="(min-width:1024px) 280px, (min-width:640px) 45vw, 100vw" className="w-full aspect-[4/5] object-cover" />
              )}
              <div className="p-5">
                <h3 className="text-gold text-xl">{d.n}</h3>
                <p className="body-sans text-muted mt-2">{d.d[lang]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14">
        <h2 className="h-section mb-8">{t.eventsTitle}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {c.events.map((e, i) => (
            <div key={e.t.en + i} className="card overflow-hidden">
              {c.photos.events[i] && (
                <Image src={c.photos.events[i]} alt={e.t[lang]} width={800} height={533} sizes="(min-width:768px) 380px, 100vw" className="w-full aspect-[3/2] object-cover" />
              )}
              <div className="p-5">
                <p className="font-sans text-xs text-gold uppercase tracking-widest">{e.w[lang]}</p>
                <h3 className="mt-2 text-xl">{e.t[lang]}</h3>
                <p className="body-sans text-muted mt-2">{e.d[lang]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 text-center">
        <h2 className="h-section">{t.nightsTitle}</h2>
        <Link href={`/${lang}/menu`} className="inline-block mt-6 border border-gold text-gold px-6 py-2 font-sans hover:bg-gold hover:text-bg">{t.nav.menu}</Link>
      </section>
    </>
  );
}
