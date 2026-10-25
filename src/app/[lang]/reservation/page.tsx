import ReservationForm from "@/components/ReservationForm";
import { Lang, zaloUrl, telHref } from "@/lib/content";
import { getContent } from "@/lib/content-server";

export default async function Reservation({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const c = await getContent();
  const r = c.t[lang].reservation;
  return (
    <section className="py-16">
      <h1 className="h-section mb-10">{r.title}</h1>
      <ReservationForm
        lang={lang} r={r} x={c.t[lang].x} zalo={zaloUrl(c.site)} hotline={c.site.hotline} tel={telHref(c.site)}
        lastOrder={c.site.lastOrder} holidays={c.holidays.map((h) => ({ date: h.date, label: h[lang] }))}
      />
    </section>
  );
}
