import ReservationForm from "@/components/ReservationForm";
import { Lang, zaloUrl } from "@/lib/content";
import { getContent } from "@/lib/content-server";

export default async function Reservation({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const c = await getContent();
  const r = c.t[lang].reservation;
  return (
    <section className="py-16">
      <h1 className="h-section mb-10">{r.title}</h1>
      <ReservationForm r={r} zalo={zaloUrl(c.site)} />
    </section>
  );
}
