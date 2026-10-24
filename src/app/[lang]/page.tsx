import Image from "next/image";
import Link from "next/link";
import { Lang, T, MENU, EVENTS, SITE, PHOTOS } from "@/lib/content";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const t = T[lang];
  const drinks = MENU[0].items;
  return (
    <>
      <section className="hero -mx-4 px-4 py-24 md:py-40 text-center flex flex-col items-center">
        <p className="font-sans text-xs uppercase tracking-[0.4em] text-muted mb-8">{t.open} · {SITE.hours}</p>
        <h1 className="text-5xl md:text-7xl text-gold font-medium">Himitsu</h1>
        <p className="font-sans text-[0.7rem] tracking-[0.5em] uppercase text-muted mt-2">house of cocktail</p>
        <p className="mt-10 text-2xl md:text-4xl">{t.heroTitle}</p>
        <p className="mt-3 text-muted font-sans text-base">{t.heroSub}</p>
        <Link href={`/${lang}/reservation`} className="inline-block mt-10 bg-gold text-bg px-8 py-3 uppercase tracking-widest text-sm font-sans hover:brightness-110">{t.cta}</Link>
      </section>

      <section className="py-14">
        <h2 className="h-section mb-8">{t.drinksTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {drinks.map((d, i) => (
            <div key={d.n} className="card overflow-hidden">
              <Image src={PHOTOS.drinks[i]} alt={d.n} width={600} height={800} sizes="(min-width:1024px) 280px, (min-width:640px) 45vw, 100vw" className="w-full aspect-[4/5] object-cover" />
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
          {EVENTS.map((e, i) => (
            <div key={e.t.en} className="card overflow-hidden">
              <Image src={PHOTOS.events[i]} alt={e.t[lang]} width={800} height={533} sizes="(min-width:768px) 380px, 100vw" className="w-full aspect-[3/2] object-cover" />
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
