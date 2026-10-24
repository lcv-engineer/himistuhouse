import { Lang, T, GALLERY } from "@/lib/content";

export default async function Gallery({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  return (
    <section className="py-16">
      <h1 className="h-section mb-10">{T[lang].galleryTitle}</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {GALLERY.map((c, i) => (
          <div key={i} className="aspect-square" style={{ background: `linear-gradient(135deg, ${c}, #0d0a08)` }} />
        ))}
      </div>
    </section>
  );
}
