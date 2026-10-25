import { PageHead, Prose, Wrap } from "@/components/ui";
import { DICT } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { getContent } from "@/lib/content-server";

// Đọc nội dung mới ở mỗi lượt truy cập, xem [lang]/layout.tsx.
export const instant = false;

export default async function Policies({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await getLang(params);
  const c = await getContent();
  const p = c.pages.policies;
  return (
    <>
      <PageHead eyebrow={DICT[lang].policies} title={p.title[lang]} />
      <Wrap className="py-12">
        <div className="max-w-2xl"><Prose text={p.body[lang]} /></div>
      </Wrap>
    </>
  );
}
