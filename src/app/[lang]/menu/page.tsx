import { Lang, T, MENU } from "@/lib/content";

export default async function Menu({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  return (
    <section className="py-16">
      <h1 className="h-section mb-10">{T[lang].menuTitle}</h1>
      {MENU.map((c) => (
        <div key={c.cat.en} className="mb-12">
          <h2 className="text-gold uppercase tracking-widest text-sm mb-4">{c.cat[lang]}</h2>
          <ul className="divide-y divide-white/10">
            {c.items.map((i) => (
              <li key={i.n} className="py-4 flex justify-between gap-6">
                <div><p>{i.n}</p><p className="text-sm text-muted">{i.d[lang]}</p></div>
                <p className="text-gold whitespace-nowrap">{i.p}k</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
