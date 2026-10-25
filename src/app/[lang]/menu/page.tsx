import { OpenStatus } from "@/components/fx";
import { PageHead, Wrap } from "@/components/ui";
import { happyHourOf } from "@/lib/content";
import { DICT, fill } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { getContent } from "@/lib/content-server";
import { fmt12 } from "@/lib/time";

// Đọc nội dung mới ở mỗi lượt truy cập, xem [lang]/layout.tsx.
export const instant = false;

export default async function Menu({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await getLang(params);
  const c = await getContent();
  const t = DICT[lang];
  const hh = happyHourOf(c);
  const cats = c.menu.filter((m) => m.visible && m.items.some((i) => i.visible));
  return (
    <>
      <PageHead eyebrow={t.drinksFood} title={t.menuTitle} kanji="本日">
        <OpenStatus hours={c.hours} lang={lang} />
        {hh && (
          <p className="mt-4 inline-flex items-center gap-2 border border-red/80 rounded-full px-4 py-2 text-sm font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-red" />
            {fill(t.hhPill, { d: hh.discount, s: fmt12(hh.start), e: fmt12(hh.end) })}
          </p>
        )}
      </PageHead>
      <Wrap className="py-16">
        <div className="max-w-3xl">
          {cats.map((cat) => (
            <section key={cat.id} id={cat.slug} className="pt-16 pb-12 scroll-mt-24">
              <h2 className="serif text-5xl mb-12">{cat.name[lang]}</h2>
              <ul className="space-y-8">
                {cat.items.filter((i) => i.visible).map((i) => (
                  <li key={i.id}>
                    <div className="flex items-baseline gap-3">
                      <span className="serif text-2xl">{i.name}</span>
                      {i.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}
                      <span className="leader" aria-hidden="true" />
                      <span className="font-semibold">{i.price}k</span>
                    </div>
                    {i.desc[lang] && <p className="text-sm text-fg/75 mt-1.5">{i.desc[lang]}</p>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <p className="text-sm text-muted mt-8">{t.menuNote}</p>
          {c.site.menuPdf && <a href={c.site.menuPdf} target="_blank" rel="noopener noreferrer" className="link inline-block mt-4 text-sm">{t.menuPdf}</a>}
        </div>
      </Wrap>
    </>
  );
}
