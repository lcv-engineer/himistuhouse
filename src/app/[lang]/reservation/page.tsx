import ReservationForm from "@/components/ReservationForm";
import { Lang, T } from "@/lib/content";

export default async function Reservation({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  return (
    <section className="py-16">
      <h1 className="h-section mb-10">{T[lang].reservation.title}</h1>
      <ReservationForm lang={lang} />
    </section>
  );
}
