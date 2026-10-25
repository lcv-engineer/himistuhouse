import Image from "next/image";
import Reveal from "@/components/Reveal";
import { PageHead, Wrap } from "@/components/ui";
import { DICT } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { getContent } from "@/lib/content-server";

// Đọc nội dung mới ở mỗi lượt truy cập, xem [lang]/layout.tsx.
export const instant = false;

export default async function Gallery({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await getLang(params);
  const c = await getContent();
  const t = DICT[lang];
  return (
    <>
      <PageHead eyebrow={t.galleryEyebrow} title={t.moments} kanji="乾杯" />
      <Wrap className="py-16">
        <div className="grid gap-2 grid-cols-2 md:grid-cols-3">
          {c.gallery.map((g, i) => (
            <Reveal key={g.src + i} delay={(i % 3) * 80} className="img-zoom">
              <Image src={g.src} alt={g.alt[lang]} width={g.w} height={g.h} sizes="(min-width:768px) 420px, 50vw" className="w-full aspect-[4/5] object-cover" />
            </Reveal>
          ))}
        </div>
      </Wrap>
    </>
  );
}
