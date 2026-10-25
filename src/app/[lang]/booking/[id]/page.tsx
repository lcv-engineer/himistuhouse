import BookingStatus from "@/components/BookingStatus";
import { Lang, zaloUrl, telHref } from "@/lib/content";
import { getContent } from "@/lib/content-server";

export default async function Booking({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang: l, id } = await params;
  const lang = l as Lang;
  const c = await getContent();
  const t = c.t[lang];
  return (
    <section className="py-16">
      <h1 className="h-section mb-10">{t.x.bkTitle}</h1>
      <BookingStatus id={id} lang={lang} r={t.reservation} x={t.x} zalo={zaloUrl(c.site)} hotline={c.site.hotline} tel={telHref(c.site)} />
    </section>
  );
}
