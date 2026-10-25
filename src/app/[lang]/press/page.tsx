import { PageHead, Wrap } from "@/components/ui";
import { DICT } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { getContent } from "@/lib/content-server";

// Đọc nội dung mới ở mỗi lượt truy cập, xem [lang]/layout.tsx.
export const instant = false;

export default async function Press({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await getLang(params);
  const c = await getContent();
  const t = DICT[lang];
  return (
    <>
      <PageHead eyebrow={t.pressEyebrow} title={t.pressTitle} />
      <Wrap className="py-20">
        <p className="text-lg text-fg/80 max-w-xl">
          {t.pressEmpty}{" "}
          <a href={`mailto:${c.site.email}`} className="link">{c.site.email}</a>
        </p>
      </Wrap>
    </>
  );
}
