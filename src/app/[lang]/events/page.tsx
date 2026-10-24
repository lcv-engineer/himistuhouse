import { Lang, T, EVENTS } from "@/lib/content";

export default async function Events({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  return (
    <section className="py-16">
      <h1 className="h-section mb-10">{T[lang].eventsPage}</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {EVENTS.map((e) => (
          <div key={e.t.en} className="bg-card border border-white/10 p-6">
            <p className="text-xs text-gold uppercase tracking-widest">{e.w[lang]}</p>
            <h2 className="mt-2 text-xl">{e.t[lang]}</h2>
            <p className="text-sm text-muted mt-3">{e.d[lang]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
