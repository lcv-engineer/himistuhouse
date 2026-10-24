import GalleryGrid from "@/components/GalleryGrid";
import { Lang } from "@/lib/content";
import { getContent } from "@/lib/content-server";

export default async function Gallery({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const c = await getContent();
  return (
    <section className="py-16">
      <h1 className="h-section mb-10">{c.t[lang].galleryTitle}</h1>
      <GalleryGrid lang={lang} gallery={c.gallery} />
    </section>
  );
}
