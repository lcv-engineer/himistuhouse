import Reveal from "@/components/Reveal";
import Desc from "@/components/Desc";
import EventPhotos from "@/components/EventPhotos";
import EventRsvp from "@/components/EventRsvp";
import PastEvents from "@/components/PastEvents";
import { PageHead, Wrap } from "@/components/ui";
import { evImages, type EventItem, type Lang } from "@/lib/content";
import { DICT } from "@/lib/i18n";
import { pickLang } from "@/lib/text";
import { getLang } from "@/lib/lang";
import { getContent } from "@/lib/content-server";
import { fmt12, fmtDate, vnNow } from "@/lib/time";

function DateBlock({ date }: { date: string }) {
  return (
    <div className="text-center">
      <p className="serif text-4xl md:text-5xl leading-none">{date.slice(8)}</p>
      <p className="eyebrow mt-2">{fmtDate(date, "en", { month: "short" })}</p>
    </div>
  );
}

const Meta = ({ e, lang, ended }: { e: EventItem; lang: Lang; ended?: string }) => (
  <p className="text-sm text-fg/85 mt-2 flex flex-wrap items-center gap-3">
    {fmt12(e.start)}–{fmt12(e.end)}
    {tx(e.price, lang) && <span className="chip">{tx(e.price, lang)}</span>}
    {ended && <span className="text-fg/70">{ended}</span>}
  </p>
);

// Bản dịch còn trống thì dùng bản ngôn ngữ kia, để không hiện chỗ trống.
const tx = (b: { vi: string; en: string }, lang: Lang) => b[lang] || b.vi || b.en;

// Đọc nội dung mới ở mỗi lượt truy cập, xem [lang]/layout.tsx.
export const instant = false;

export default async function Events({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await getLang(params);
  const c = await getContent();
  const t = DICT[lang];
  const s = c.site;
  const today = vnNow().date;
  const pub = c.events.filter((e) => e.published);
  const upcoming = pub.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = pub.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHead title={t.eventsEyebrow} />
      <Wrap className="py-20">
        {upcoming.length > 0 && (
          <div className="space-y-16 mb-16">
            {upcoming.map((e) => (
              <Reveal key={e.id} className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-[minmax(0,520px)_minmax(0,1fr)] items-start">
                <EventPhotos images={evImages(e)} alt={tx(e.title, lang)} />
                {/* Điện thoại: ngày bên cạnh tên, phần mô tả và nút giữ chỗ trải rộng hết bề ngang bên dưới. */}
                <div className="grid grid-cols-[3rem_minmax(0,1fr)] md:grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 md:gap-x-8 min-w-0">
                  <DateBlock date={e.date} />
                  <div className="min-w-0">
                    <h2 className="serif text-[1.65rem] leading-tight sm:text-3xl md:text-4xl break-words">{tx(e.title, lang)}</h2>
                    <Meta e={e} lang={lang} />
                  </div>
                  <div className="col-span-2 md:col-span-1 md:col-start-2 min-w-0">
                    <Desc text={pickLang(tx(e.desc, lang), lang)} lang={lang} lines={6} className="text-fg/80 mt-5 text-base md:text-lg" />
                    {e.rsvp && <div className="mt-6"><EventRsvp lang={lang} phone={s.phone} handle={s.handle} instagram={s.instagram} address={s.address[lang]} ev={{ id: e.id, title: tx(e.title, lang), date: e.date, start: e.start, end: e.end }} /></div>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {upcoming.length === 0 && <p className="text-lg text-fg/80 mb-16">{t.noEvent}</p>}

        {past.length > 0 && (
          <>
            <Reveal className="mt-24">
              <PastEvents slides={past.flatMap((e) => {
                const base = { title: tx(e.title, lang), day: e.date.slice(8), month: fmtDate(e.date, "en", { month: "short" }), time: `${fmt12(e.start)}–${fmt12(e.end)}`, price: tx(e.price, lang), ended: t.ended };
                const imgs = evImages(e);
                return (imgs.length ? imgs : [""]).map((img) => ({ ...base, img }));
              })} />
            </Reveal>
          </>
        )}

        {c.highlights.length > 0 && (
          <section className="mt-32">
            <p className="eyebrow">{t.hlEyebrow}</p>
            <h2 className="serif text-4xl md:text-5xl mt-4">{t.hlTitle}</h2>
            <p className="text-fg/75 mt-2">{t.hlSub}</p>
            <div className="mt-12 grid gap-10 md:grid-cols-12">
              {c.highlights.map((h, i) => {
                // Bố cục so le như bản cũ: rộng – hẹp, hẹp – rộng.
                const wide = i % 4 === 0 || i % 4 === 3;
                return (
                  <Reveal key={h.id} delay={(i % 2) * 120} className={wide ? "md:col-span-7" : "md:col-span-5"}>
                    <EventPhotos images={evImages(h)} alt={h.title[lang]} aspect={wide ? "aspect-[3/2]" : "aspect-[4/5]"} sizes="(min-width:768px) 700px, 100vw" />
                    <h3 className="serif text-3xl mt-6">{h.title[lang]}</h3>
                    <p className="text-fg/80 mt-3 max-w-lg">{h.desc[lang]}</p>
                  </Reveal>
                );
              })}
            </div>
          </section>
        )}
      </Wrap>
    </>
  );
}
