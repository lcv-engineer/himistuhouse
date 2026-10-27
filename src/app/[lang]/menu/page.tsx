import { PageHead, Wrap } from "@/components/ui";
import { happyHourOf, MenuItem } from "@/lib/content";
import { DICT, fill } from "@/lib/i18n";
import { getLang } from "@/lib/lang";
import { getContent } from "@/lib/content-server";
import { fmt12 } from "@/lib/time";

// Đọc nội dung mới ở mỗi lượt truy cập, xem [lang]/layout.tsx.
export const instant = false;

// Giá theo nghìn đồng, không kèm chữ "k"; có giá chai thì hiện "ly/chai".
const price = (i: MenuItem) => (i.bottle ? `${i.price}/${i.bottle}` : String(i.price));

// Gom món theo nhóm nhỏ (vd Vodka, Gin) giữ nguyên thứ tự xuất hiện; món không có nhóm nằm chung một khối.
function byGroup(items: MenuItem[]) {
  const out: { group: string; items: MenuItem[] }[] = [];
  for (const i of items) {
    const g = i.group?.trim() ?? "";
    const last = out.find((x) => x.group === g);
    if (last) last.items.push(i); else out.push({ group: g, items: [i] });
  }
  return out;
}

export default async function Menu({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await getLang(params);
  const c = await getContent();
  const t = DICT[lang];
  const hh = happyHourOf(c);
  const cats = c.menu.filter((m) => m.visible && m.items.some((i) => i.visible));
  return (
    <>
      <PageHead eyebrow={t.drinksFood} title={t.menuTitle}>
        {hh && (
          <p className="inline-flex items-center gap-2 border border-red/80 rounded-full px-4 py-2 text-sm font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-red" />
            {fill(t.hhPill, { d: hh.discount, s: fmt12(hh.start), e: fmt12(hh.end) })}
          </p>
        )}
      </PageHead>
      <Wrap className="py-16">
        <div className="max-w-3xl">
          {cats.map((cat) => (
            <section key={cat.id} id={cat.slug} className="pt-16 pb-12 scroll-mt-24">
              <header className="mb-10 md:mb-12">
                <h2 className="serif text-4xl md:text-5xl">{cat.name[lang]}</h2>
                {cat.mood?.[lang] && <p className="mt-4 text-sm font-semibold uppercase tracking-[.12em] text-red">{cat.mood[lang]}</p>}
                {cat.note?.[lang] && <p className="mt-3 max-w-2xl text-fg/75 leading-relaxed">{cat.note[lang]}</p>}
                {/* Danh mục có giá chai (Vang, Sake): ghi rõ cột giá là ly / chai. */}
                {cat.items.some((i) => i.visible && i.bottle) && <p className="mt-6 text-right text-xs font-semibold uppercase tracking-[.12em] text-fg/60">{t.glassBottle}</p>}
              </header>
              {byGroup(cat.items.filter((i) => i.visible)).map(({ group, items }) => (
                <div key={group || "_"} className="mb-10 last:mb-0">
                  {group && <h3 className="eyebrow text-muted mb-6">{group}</h3>}
                  <ul className="space-y-8">
                    {items.map((i) => (
                      <li key={i.id} className="menu-row">
                        <div className="flex items-baseline gap-3">
                          <span className="serif text-xl md:text-2xl min-w-0">{i.name}</span>
                          {i.tags.map((tag) => <span key={tag} className="chip shrink-0">{tag}</span>)}
                          <span className="leader" aria-hidden="true" />
                          <span className="font-semibold shrink-0">{price(i)}</span>
                        </div>
                        {i.desc[lang] && <p className="text-sm text-fg/75 mt-1.5 whitespace-pre-line">{i.desc[lang]}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ))}
          <p className="text-sm text-muted mt-8">{t.menuNote}</p>
        </div>
      </Wrap>
    </>
  );
}
