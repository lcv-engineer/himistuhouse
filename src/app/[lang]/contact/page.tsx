import { Lang, T, SITE } from "@/lib/content";

export default async function Contact({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const t = T[lang];
  const btn = "px-5 py-2.5 text-white";
  return (
    <section className="py-16">
      <h1 className="h-section mb-10">{t.contactTitle}</h1>
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <div><p className="text-gold uppercase tracking-widest text-xs mb-1">{t.address}</p><p>{SITE.address}</p></div>
          <div><p className="text-gold uppercase tracking-widest text-xs mb-1">{t.hours}</p><p>{SITE.hours}</p></div>
          <div className="flex flex-wrap gap-3">
            <a href={SITE.instagram} className={btn} style={{ background: "linear-gradient(45deg,#f58529,#dd2a7b,#8134af)" }}>Instagram</a>
            <a href={SITE.facebook} className={btn} style={{ background: "#1877F2" }}>Facebook</a>
            <a href={SITE.messenger} className={btn} style={{ background: "linear-gradient(135deg,#00B2FF,#A334FA)" }}>Messenger</a>
            <a href={SITE.zalo} className={btn} style={{ background: "#0068FF" }}>Zalo</a>
            <a href={`mailto:${SITE.email}`} className={btn} style={{ background: "#EA4335" }}>Email</a>
          </div>
        </div>
        <iframe title="map" src={SITE.mapEmbed} className="w-full h-80 border-0" loading="lazy" />
      </div>
    </section>
  );
}
