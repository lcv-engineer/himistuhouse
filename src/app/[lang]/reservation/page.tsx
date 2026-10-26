import ReserveFlow from "@/components/ReserveFlow";
import { Wrap } from "@/components/ui";
import { happyHourOf, telHref } from "@/lib/content";
import { DICT } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { getContent } from "@/lib/content-server";

// Đọc nội dung mới ở mỗi lượt truy cập, xem [lang]/layout.tsx.
export const instant = false;

export default async function Reservation({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await getLang(params);
  const c = await getContent();
  const t = DICT[lang];
  const s = c.site;
  return (
    <Wrap className="py-16 md:py-24 grid gap-14 grid-cols-1 lg:grid-cols-[5fr_7fr]">
      <div className="lg:sticky lg:top-32 self-start">
        <p className="eyebrow fx-up">{t.reserveEyebrow}</p>
        <h1 className="serif text-5xl md:text-6xl mt-6 leading-[1.1] fx-up" style={{ "--d": ".1s" } as React.CSSProperties}>{t.reserveTitle}</h1>
        <p className="text-lg text-fg/80 mt-6 max-w-sm leading-relaxed">{t.reserveSub}</p>
        <p className="text-sm text-fg/80 mt-6">{t.orCall} <a href={telHref(s.phone)} className="hover:underline">{s.phone}</a></p>
      </div>
      <ReserveFlow
        lang={lang} hours={c.hours} happyHour={happyHourOf(c) ?? null} phone={s.phone} address={s.address[lang]} mapsUrl={s.mapsUrl}
        holidays={c.holidays.map((h) => ({ date: h.date, label: h[lang] }))}
      />
    </Wrap>
  );
}
