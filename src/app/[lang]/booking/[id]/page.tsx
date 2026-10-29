import BookingView from "@/components/BookingView";
import { Wrap } from "@/components/ui";
import { telHref } from "@/lib/content";
import { DICT } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { getContent } from "@/lib/content-server";

// Đọc nội dung mới ở mỗi lượt truy cập, xem [lang]/layout.tsx.
export const instant = false;

export default async function Booking({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { id } = await params;
  const lang = await getLang(params);
  const c = await getContent();
  const t = DICT[lang];
  const code = decodeURIComponent(id);
  return (
    <Wrap className="py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        <p className="eyebrow">{t.reserveEyebrow}</p>
        {/* Không in tiêu đề và mã đặt bàn ra trang (khách thấy thừa); tiêu đề chỉ còn cho trình đọc màn hình. */}
        <h1 className="sr-only">{t.reservation}</h1>
        <BookingView code={code} lang={lang} phone={c.site.phone} tel={telHref(c.site.phone)} telegram={c.site.telegram} />
      </div>
    </Wrap>
  );
}
