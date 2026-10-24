import { Lang, T } from "@/lib/content";

export default async function Story({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const t = T[lang];
  return (
    <section className="py-16 max-w-2xl">
      <h1 className="h-section mb-6">{t.storyTitle}</h1>
      <p className="logo-script text-5xl text-gold">Himitsu</p>
      <p className="text-[0.65rem] tracking-[0.4em] uppercase text-muted mb-8">house of cocktail</p>
      {t.storyBody.map((p, i) => <p key={i} className="mb-5 leading-relaxed">{p}</p>)}
    </section>
  );
}
