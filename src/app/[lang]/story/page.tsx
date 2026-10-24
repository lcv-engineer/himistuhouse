import Image from "next/image";
import Logo from "@/components/Logo";
import { Lang, T, PHOTOS } from "@/lib/content";

export default async function Story({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const t = T[lang];
  return (
    <section className="py-16 grid gap-10 md:grid-cols-2 items-start">
      <div>
        <h1 className="h-section mb-6">{t.storyTitle}</h1>
        <div className="mb-8"><Logo height={56} /></div>
        {t.storyBody.map((p, i) => <p key={i} className="mb-5 leading-relaxed">{p}</p>)}
      </div>
      <div className="grid gap-4">
        <Image src={PHOTOS.story1.src} width={PHOTOS.story1.w} height={PHOTOS.story1.h} sizes="(min-width:768px) 560px, 100vw"
          alt={lang === "vi" ? "Không gian Himitsu với tranh Nhật Bản" : "Himitsu interior with Japanese posters"} className="w-full h-auto" />
        <Image src={PHOTOS.story2.src} width={PHOTOS.story2.w} height={PHOTOS.story2.h} sizes="(min-width:768px) 560px, 100vw"
          alt={lang === "vi" ? "Bàn gỗ, đèn bàn và menu" : "Wooden table, lamp and menu"} className="w-full h-auto" />
      </div>
    </section>
  );
}
