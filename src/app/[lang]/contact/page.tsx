import { FacebookIcon, InstagramIcon, MessengerIcon, ZaloIcon } from "@/components/Icons";
import { Lang, T, SITE } from "@/lib/content";

export default async function Contact({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const t = T[lang];
  const btn = "inline-flex items-center gap-2 px-5 py-2.5 text-white font-sans text-sm hover:brightness-110";
  const white = "[&_svg]:bg-white [&_svg]:rounded-sm [&_svg]:p-0.5";
  return (
    <section className="py-16">
      <h1 className="h-section mb-10">{t.contactTitle}</h1>
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <div><p className="text-gold uppercase tracking-widest text-xs mb-1 font-sans">{t.address}</p><p>{SITE.address}</p></div>
          <div><p className="text-gold uppercase tracking-widest text-xs mb-1 font-sans">{t.hours}</p><p>{SITE.hours}</p></div>
          <div className="flex flex-wrap gap-3">
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className={`${btn} ${white}`} style={{ background: "linear-gradient(45deg,#f58529,#dd2a7b,#8134af)" }}><InstagramIcon /> Instagram</a>
            <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" className={`${btn} ${white}`} style={{ background: "#1877F2" }}><FacebookIcon /> Facebook</a>
            <a href={SITE.messenger} target="_blank" rel="noopener noreferrer" className={`${btn} ${white}`} style={{ background: "linear-gradient(135deg,#00B2FF,#A334FA)" }}><MessengerIcon /> Messenger</a>
            <a href={SITE.zalo} target="_blank" rel="noopener noreferrer" className={btn} style={{ background: "#0068FF" }}><ZaloIcon /> Zalo</a>
          </div>
        </div>
        <iframe title={t.address} src={SITE.mapEmbed} className="w-full h-80 border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
    </section>
  );
}
