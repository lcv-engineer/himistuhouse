import { FacebookIcon, InstagramIcon, MessengerIcon, ZaloIcon } from "@/components/Icons";
import { Lang, zaloUrl, mapSrc } from "@/lib/content";
import { getContent } from "@/lib/content-server";

export default async function Contact({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const c = await getContent();
  const t = c.t[lang];
  const s = c.site;
  const btn = "inline-flex items-center gap-2 px-5 py-2.5 text-white font-sans text-sm hover:brightness-110";
  const white = "[&_svg]:bg-white [&_svg]:rounded-sm [&_svg]:p-0.5";
  return (
    <section className="py-16">
      <h1 className="h-section mb-10">{t.contactTitle}</h1>
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <div><p className="text-gold uppercase tracking-widest text-xs mb-1 font-sans">{t.address}</p><p>{s.address}</p></div>
          <div><p className="text-gold uppercase tracking-widest text-xs mb-1 font-sans">{t.hours}</p><p>{s.hours}</p></div>
          {s.zaloPhone && <div><p className="text-gold uppercase tracking-widest text-xs mb-1 font-sans">Zalo</p><p>{s.zaloPhone}</p></div>}
          <div className="flex flex-wrap gap-3">
            <a href={s.instagram} target="_blank" rel="noopener noreferrer" className={`${btn} ${white}`} style={{ background: "linear-gradient(45deg,#f58529,#dd2a7b,#8134af)" }}><InstagramIcon /> Instagram</a>
            <a href={s.facebook} target="_blank" rel="noopener noreferrer" className={`${btn} ${white}`} style={{ background: "#1877F2" }}><FacebookIcon /> Facebook</a>
            <a href={s.messenger} target="_blank" rel="noopener noreferrer" className={`${btn} ${white}`} style={{ background: "linear-gradient(135deg,#00B2FF,#A334FA)" }}><MessengerIcon /> Messenger</a>
            <a href={zaloUrl(s)} target="_blank" rel="noopener noreferrer" className={btn} style={{ background: "#0068FF" }}><ZaloIcon /> Zalo</a>
          </div>
        </div>
        <iframe title={t.address} src={mapSrc(s)} className="w-full h-80 border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
    </section>
  );
}
