import Image from "next/image";
import { Lang } from "@/lib/content";
import { getContent } from "@/lib/content-server";

export default async function Events({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const c = await getContent();
  const x = c.t[lang].x;
  return (
    <section className="py-16">
      <h1 className="h-section mb-3">{x.eventsHeading}</h1>
      <p className="text-muted font-sans text-sm mb-10">{x.everyWeek}</p>
      <div className="grid gap-4 md:grid-cols-3">
        {c.events.map((e, i) => (
          <div key={i} className="card overflow-hidden">
            {c.photos.events[i] && (
              <Image src={c.photos.events[i]} alt={e.t[lang]} width={800} height={533} sizes="(min-width:768px) 380px, 100vw" className="w-full aspect-[3/2] object-cover" />
            )}
            <div className="p-6">
              <p className="text-xs text-gold uppercase tracking-widest font-sans">{e.w[lang]}</p>
              <h2 className="mt-2 text-xl">{e.t[lang]}</h2>
              <p className="text-sm text-muted mt-3 font-sans">{e.d[lang]}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="card mt-6 p-6 max-w-md">
        <p className="font-sans text-sm text-muted">{x.eventsEmpty.replace("{handle}", c.site.handle)}</p>
        <a href={c.site.instagram} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 font-sans text-sm underline">{c.site.handle} →</a>
      </div>
    </section>
  );
}
