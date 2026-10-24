import Link from "next/link";
import { Lang, T, MENU, EVENTS } from "@/lib/content";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const t = T[lang];
  const drinks = MENU[0].items;
  return (
    <>
      <section className="py-24 md:py-36 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-muted mb-6">{t.open} · 17:00 – 02:00</p>
        <h1 className="logo-script text-6xl md:text-8xl text-gold">Himitsu</h1>
        <p className="text-[0.7rem] tracking-[0.5em] uppercase text-muted mt-2">house of cocktail</p>
        <p className="mt-10 text-2xl md:text-3xl">{t.heroTitle}</p>
        <p className="mt-3 text-muted">{t.heroSub}</p>
        <Link href={`/${lang}/reservation`} className="inline-block mt-10 bg-gold text-bg px-8 py-3 uppercase tracking-widest text-sm">{t.cta}</Link>
      </section>

      <section className="py-12">
        <h2 className="h-section mb-8">{t.drinksTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {drinks.map((d) => (
            <div key={d.n} className="bg-card border border-white/10 p-5">
              <h3 className="text-gold">{d.n}</h3>
              <p className="text-sm text-muted mt-2">{d.d[lang]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12">
        <h2 className="h-section mb-8">{t.eventsTitle}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {EVENTS.map((e) => (
            <div key={e.t.en} className="bg-card border border-white/10 p-5">
              <p className="text-xs text-gold uppercase tracking-widest">{e.w[lang]}</p>
              <h3 className="mt-2 text-lg">{e.t[lang]}</h3>
              <p className="text-sm text-muted mt-2">{e.d[lang]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 text-center">
        <h2 className="h-section">{t.nightsTitle}</h2>
        <Link href={`/${lang}/menu`} className="inline-block mt-6 border border-gold text-gold px-6 py-2">{t.nav.menu}</Link>
      </section>
    </>
  );
}
