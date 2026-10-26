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
  return (
    <>
      <Wrap className="pt-16 md:pt-20">
        <div className="fx-up"><Logo height={130} className="max-w-[80vw] h-auto" /></div>
        <p className="eyebrow mt-10 fx-up" style={{ "--d": ".1s" } as React.CSSProperties}>{t.ourStory}</p>
        <h1 className="serif text-5xl md:text-8xl mt-6 leading-[1.05] max-w-2xl fx-up" style={{ "--d": ".2s" } as React.CSSProperties}>{p.title[lang]}</h1>
      </Wrap>
      <Wrap className="pt-16">
        <div className="max-w-3xl mx-auto">
          <Prose text={p.body[lang]} />
        </div>
      </Wrap>
    </>
  );
}
