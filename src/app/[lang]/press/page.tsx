import { Lang, T, PRESS } from "@/lib/content";

export default async function Press({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  return (
    <section className="py-16 max-w-2xl">
      <h1 className="h-section mb-10">{T[lang].pressTitle}</h1>
      <ul className="divide-y divide-white/10">
        {PRESS.map((p) => (
          <li key={p.s} className="py-5">
            <p className="text-xs text-gold uppercase tracking-widest">{p.s}</p>
            <p className="mt-1 text-lg">{p.t[lang]}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
