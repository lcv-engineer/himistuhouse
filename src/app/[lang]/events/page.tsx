import Image from "next/image";
import Reveal from "@/components/Reveal";
import EventRsvp from "@/components/EventRsvp";
import { PageHead, Wrap } from "@/components/ui";
import { evImages, type EventItem, type Lang } from "@/lib/content";
import { DICT } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { getContent } from "@/lib/content-server";
import { fmt12, fmtDate, vnNow } from "@/lib/time";

function DateBlock({ date }: { date: string }) {
  return (
    <div className="text-center shrink-0 w-14">
      <p className="serif text-5xl leading-none">{date.slice(8)}</p>
      <p className="eyebrow mt-2">{fmtDate(date, "en", { month: "short" })}</p>
    </div>
  );
}

// Ảnh bìa lớn, các ảnh còn lại (tối đa 4) xếp thành lưới nhỏ bên dưới.
function Photos({ images, alt }: { images: string[]; alt: string }) {
  const [cover, ...rest] = images;
  if (!cover) return null;
  return (
    <div>
      <div className="relative aspect-[3/2] overflow-hidden img-zoom"><Image src={cover} alt={alt} fill sizes="(min-width:768px) 520px, 100vw" className="object-cover" /></div>
      {rest.length > 0 && (
        <div className="mt-2 grid grid-cols-4 gap-2">
          {rest.map((src, i) => <div key={src + i} className="relative aspect-[4/3] overflow-hidden img-zoom"><Image src={src} alt="" fill sizes="(min-width:768px) 130px, 25vw" className="object-cover" /></div>)}
        </div>
      )}
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
              <Reveal key={e.id} className="grid gap-8 md:grid-cols-[minmax(0,520px)_1fr] items-start">
                <Photos images={evImages(e)} alt={tx(e.title, lang)} />
                <div className="flex gap-8">
                  <DateBlock date={e.date} />
                  <div>
                    <h2 className="serif text-3xl md:text-4xl">{tx(e.title, lang)}</h2>
                    <Meta e={e} lang={lang} />
                    {tx(e.desc, lang) && <p className="text-fg/80 mt-5 text-lg">{tx(e.desc, lang)}</p>}
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
            <div className="mt-24 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((e) => (
                <Reveal key={e.id}>
                  {evImages(e)[0] && <div className="relative aspect-[3/2] overflow-hidden"><Image src={evImages(e)[0]} alt={tx(e.title, lang)} fill sizes="400px" className="object-cover opacity-80" /></div>}
                  <div className="flex gap-6 mt-5">
                    <DateBlock date={e.date} />
                    <div>
                      <h3 className="serif text-2xl">{tx(e.title, lang)}</h3>
                      <Meta e={e} lang={lang} ended={t.ended} />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
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
                    {h.image && (
                      <div className={`relative overflow-hidden img-zoom ${wide ? "aspect-[3/2]" : "aspect-[4/5]"}`}>
                        <Image src={h.image} alt={h.title[lang]} fill sizes="(min-width:768px) 700px, 100vw" className="object-cover" />
                      </div>
                    )}
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
