import Image from "next/image";
import Logo from "@/components/Logo";
import { Prose, Wrap } from "@/components/ui";
import { DICT } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { getContent } from "@/lib/content-server";

// Đọc nội dung mới ở mỗi lượt truy cập, xem [lang]/layout.tsx.
export const instant = false;

export default async function Story({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await getLang(params);
  const c = await getContent();
  const t = DICT[lang];
  const p = c.pages.story;
  // Ảnh đầu là banner ngang dưới tiêu đề, các ảnh sau xếp lưới dọc cuối trang.
  const [banner, ...grid] = c.photos.story.filter(Boolean);
  return (
    <>
      <Wrap className="pt-16 md:pt-20">
        <div className="fx-up"><Logo height={130} className="max-w-[80vw] h-auto" /></div>
        <p className="eyebrow mt-10 fx-up" style={{ "--d": ".1s" } as React.CSSProperties}>{t.ourStory}</p>
        <h1 className="serif text-5xl md:text-8xl mt-6 leading-[1.05] max-w-2xl fx-up" style={{ "--d": ".2s" } as React.CSSProperties}>{p.title[lang]}</h1>
      </Wrap>
      {banner && (
        <Wrap className="pt-12 md:pt-16">
          <div className="relative aspect-[4/3] md:aspect-[21/9] overflow-hidden bg-black">
            <Image src={banner} alt="" fill sizes="(min-width:1280px) 1200px, 100vw" className="object-cover" />
          </div>
        </Wrap>
      )}
      <Wrap className="pt-16">
        <div className="max-w-3xl mx-auto">
          <Prose text={p.body[lang]} />
        </div>
      </Wrap>
      {grid.length > 0 && (
        <Wrap className="pb-20 md:pb-28">
          <ul className={`grid grid-cols-2 gap-3 md:gap-5 ${grid.length % 3 === 0 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {grid.map((src, i) => {
              // Số ảnh lẻ thì ảnh đầu chiếm trọn hàng trên điện thoại để lưới không bị hụt.
              const wide = grid.length % 2 === 1 && i === 0;
              return (
                <li key={src + i} className={`relative overflow-hidden bg-black ${wide ? "col-span-2 aspect-[4/5] md:col-span-1" : "aspect-[4/5]"}`}>
                  <Image src={src} alt="" fill sizes="(min-width:768px) 400px, 50vw" className="object-cover" />
                </li>
              );
            })}
          </ul>
        </Wrap>
      )}
    </>
  );
}
