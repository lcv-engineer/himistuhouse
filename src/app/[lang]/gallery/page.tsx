import Reveal from "@/components/Reveal";
import { PageHead, PhotoRow, Wrap } from "@/components/ui";
import { DICT } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { getContent } from "@/lib/content-server";

// Đọc nội dung mới ở mỗi lượt truy cập, xem [lang]/layout.tsx.
export const instant = false;

// Trang Khoảnh khắc: mỗi nhóm (Bartender khách mời, Sự kiện, Giải trí) là một hàng ảnh lướt ngang.
export default async function Gallery({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await getLang(params);
  const c = await getContent();
  const t = DICT[lang];
  return (
    <>
      <PageHead eyebrow={t.galleryEyebrow} title={t.moments} />
      <Wrap className="py-16 space-y-24">
        {c.moments.filter((m) => m.images.length).map((m) => (
          <section key={m.id}>
            <Reveal><h2 className="serif text-3xl md:text-5xl mb-8">{m.title[lang]}</h2></Reveal>
            <PhotoRow images={m.images} lang={lang} />
          </section>
        ))}
      </Wrap>
    </>
  );
}
