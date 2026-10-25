import { Lang } from "@/lib/content";
import { getContent } from "@/lib/content-server";

export default async function Menu({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const c = await getContent();
  return (
    <section className="py-16">
      <h1 className="h-section mb-10">{c.t[lang].menuTitle}</h1>
      {c.menu.map((cat, ci) => (
        <div key={ci} className="mb-12">
          <h2 className="text-gold uppercase tracking-widest text-sm mb-4 font-sans">{cat.cat[lang]}</h2>
          <ul className="divide-y divide-white/10">
            {cat.items.map((i, ii) => (
              <li key={ii} className="py-4 flex justify-between gap-6">
                <div><p>{i.n}</p><p className="text-sm text-muted font-sans">{i.d[lang]}</p></div>
                <p className="text-gold whitespace-nowrap font-sans">{i.p}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <p className="text-sm text-muted font-sans">{c.t[lang].menuNote}</p>
    </section>
  );
}
