import { Lang } from "@/lib/content";
import { getContent } from "@/lib/content-server";

export default async function Press({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const c = await getContent();
  return (
    <section className="py-16 max-w-2xl">
      <h1 className="h-section mb-10">{c.t[lang].pressTitle}</h1>
      <ul className="divide-y divide-white/10">
        {c.press.map((p, i) => (
          <li key={i} className="py-5">
            <p className="text-xs text-gold uppercase tracking-widest font-sans">{p.s}</p>
            <p className="mt-1 text-lg">{p.t[lang]}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
