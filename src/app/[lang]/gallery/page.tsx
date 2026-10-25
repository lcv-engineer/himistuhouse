import GalleryGrid from "@/components/GalleryGrid";
import { getLang } from "@/lib/lang";
import { getContent } from "@/lib/content-server";

export default async function Gallery({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await getLang(params);
  const c = await getContent();
  return (
    <section className="py-16">
      <h1 className="h-section mb-10">{c.t[lang].galleryTitle}</h1>
      <GalleryGrid lang={lang} sections={c.moments} />
    </section>
  );
}
