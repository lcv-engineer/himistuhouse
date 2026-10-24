import Image from "next/image";
import Logo from "@/components/Logo";
import { Lang } from "@/lib/content";
import { getContent } from "@/lib/content-server";

export default async function Story({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const c = await getContent();
  const t = c.t[lang];
  return (
    <section className="py-16 grid gap-10 md:grid-cols-2 items-start">
      <div>
        <h1 className="h-section mb-6">{t.storyTitle}</h1>
        <div className="mb-8"><Logo height={56} /></div>
        {t.storyBody.map((p, i) => <p key={i} className="mb-5 leading-relaxed">{p}</p>)}
      </div>
      <div className="grid gap-4">
        {[c.photos.story1, c.photos.story2].filter(Boolean).map((src) => (
          <Image key={src} src={src} width={1400} height={933} sizes="(min-width:768px) 560px, 100vw" alt={c.site.name} className="w-full h-auto" />
        ))}
      </div>
    </section>
  );
}
