import GalleryGrid from "@/components/GalleryGrid";
import { Lang, T } from "@/lib/content";

export default async function Gallery({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  return (
    <section className="py-16">
      <h1 className="h-section mb-10">{T[lang].galleryTitle}</h1>
      <GalleryGrid lang={lang} />
    </section>
  );
}
