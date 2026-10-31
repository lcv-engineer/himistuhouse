"use client";
// Các mục trong trang quản trị, theo bố cục bản cũ (14/10).
import { useEffect, useState } from "react";
import { ArrowIcon, PlusIcon, TrashIcon } from "../Icons";
import { EntityForm, Field, ImageField, ListEditor, slugify, uid, uploadImage } from "./Form";
import type { Save } from "./AdminApp";
import type { Bi, Content, EventItem, GalleryImage, Highlight, MenuCat, MenuItem, Moment, Promo, Secret } from "@/lib/content";
import type { PrivateHire, Reservation } from "@/lib/store";
import { DICT } from "@/lib/i18n";
import { addDays, mondayOf, vnNow, weekday } from "@/lib/time";

type P = { c: Content; save: Save };
const WD = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const DAYS = DICT.vi.days;
const dm = (d: string) => `${Number(d.slice(8))}/${Number(d.slice(5, 7))}`;
const viDate = (d: string) => `${WD[weekday(d)]}, ${dm(d)}`;
const bi = (s = ""): Bi => ({ vi: s, en: s });
const H1 = ({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) => (
  <div className="flex flex-wrap items-start justify-between gap-4 mb-8"><div>{children}</div>{right}</div>
);

/* ---------------- Sự kiện ---------------- */
const EVENT_FIELDS: Field[] = [
  { k: "title", label: "Tên sự kiện", type: "bi", required: true },
  { k: "slug", label: "Slug (đường dẫn)", type: "text", half: true, hint: "Để trống sẽ tự tạo từ tên." },
  { k: "date", label: "Ngày", type: "date", required: true, half: true },
  { k: "start", label: "Bắt đầu", type: "time", required: true, half: true },
  { k: "end", label: "Kết thúc", type: "time", required: true, half: true },
  { k: "price", label: "Giá / nhãn (vd Miễn phí)", type: "bi" },
  { k: "desc", label: "Mô tả", type: "bitext" },
  { k: "image", label: "Ảnh", type: "image" },
  { k: "published", label: "Đăng lên web", type: "check" },
  { k: "rsvp", label: "Mở giữ chỗ (RSVP)", type: "check" },
];
const HL_FIELDS: Field[] = [
  { k: "title", label: "Tên", type: "bi", required: true },
  { k: "desc", label: "Mô tả", type: "bitext" },
  { k: "image", label: "Ảnh", type: "image" },
];

export function EventsSection({ c, save }: P) {
  const events = [...c.events].sort((a, b) => b.date.localeCompare(a.date));
  // Số giữ chỗ (RSVP) của từng sự kiện, lấy từ danh sách đặt bàn.
  const [rsvp, setRsvp] = useState<Record<string, { n: number; g: number }>>({});
  useEffect(() => {
    fetch("/api/admin").then((r) => (r.ok ? r.json() : [])).then((rows: Reservation[]) => {
      const m: Record<string, { n: number; g: number }> = {};
      for (const r of rows) if (r.event && r.status !== "cancelled") { const x = m[r.event] ?? { n: 0, g: 0 }; m[r.event] = { n: x.n + 1, g: x.g + r.guests }; }
      setRsvp(m);
    }).catch(() => {});
  }, []);
  return (
    <>
      <ListEditor<EventItem>
        title="Sự kiện" items={events} fields={EVENT_FIELDS}
        blank={() => ({ id: uid(), slug: "", title: bi(), date: vnNow().date, start: "20:00", end: "23:00", price: { vi: "Miễn phí", en: "Free" }, desc: bi(), image: "", published: false, rsvp: true })}
        row={(e) => ({ title: e.title.vi, sub: `${viDate(e.date)} · ${e.start} · ${e.published ? "Đã đăng" : "Nháp"}${e.published && e.rsvp ? " · RSVP open" : ""}${rsvp[e.id] ? ` · ${rsvp[e.id].n} giữ chỗ (${rsvp[e.id].g} khách)` : ""}` })}
        searchText={(e) => `${e.title.vi} ${e.title.en}`}
        toggle={{ on: "Đã đăng", off: "Nháp", get: (e) => e.published, set: (e, v) => ({ ...e, published: v }) }}
        onChange={(items) => save({ ...c, events: items.map((e) => ({ ...e, slug: e.slug || slugify(`${e.title.vi}-${dm(e.date).replace("/", "-")}`) })) })}
      />
      <ListEditor<Highlight>
        title="Đêm nổi bật" items={c.highlights} fields={HL_FIELDS}
        blank={() => ({ id: uid(), title: bi(), desc: bi(), image: "" })}
        row={(h) => ({ title: h.title.vi, sub: h.desc.vi })}
        onChange={(items) => save({ ...c, highlights: items })}
      />
    </>
  );
}

/* ---------------- Menu ---------------- */
type CatRow = MenuCat & { order: number };
type ItemRow = MenuItem & { cat: string };
const money = (k: number) => `${(k * 1000).toLocaleString("vi-VN")}đ`;

export function MenuSection({ c, save }: P) {
  const cats: CatRow[] = c.menu.map((m, i) => ({ ...m, order: i }));
  const items: ItemRow[] = c.menu.flatMap((m) => m.items.map((i) => ({ ...i, cat: m.id })));
  const CAT_FIELDS: Field[] = [
    { k: "name", label: "Tên", type: "bi", required: true },
    { k: "slug", label: "Slug (đường dẫn)", type: "text", required: true, half: true },
    { k: "order", label: "Thứ tự", type: "number", half: true },
    { k: "mood", label: "Dòng chữ đậm dưới tên (vd Light · Fresh · Opening)", type: "bi" },
    { k: "note", label: "Mô tả danh mục", type: "bitext" },
    { k: "visible", label: "Hiển thị", type: "check" },
  ];
  const ITEM_FIELDS: Field[] = [
    { k: "cat", label: "Danh mục", type: "select", required: true, options: c.menu.map((m) => ({ v: m.id, label: m.name.vi })) },
    { k: "name", label: "Tên món", type: "text", required: true, half: true },
    { k: "price", label: "Giá (nghìn đồng, vd 260)", type: "number", required: true, half: true },
    { k: "bottle", label: "Giá chai (nếu có, vd 1380)", type: "number", half: true, hint: "Có giá chai thì menu hiện “250/1380”." },
    { k: "group", label: "Nhóm nhỏ (vd Vodka, Gin)", type: "text", half: true, hint: "Dùng cho Rượu mạnh: món cùng nhóm hiện dưới một tiêu đề." },
    { k: "desc", label: "Thành phần / mô tả", type: "bi" },
    { k: "tags", label: "Nhãn (cách nhau bằng dấu phẩy)", type: "tags" },
    { k: "image", label: "Ảnh (dùng cho món Signature ở trang chủ)", type: "image" },
    { k: "signature", label: "Signature (hiện ở trang chủ)", type: "check" },
    { k: "visible", label: "Hiển thị", type: "check" },
  ];

  const saveCats = (rows: CatRow[]) => {
    const menu: MenuCat[] = [...rows].sort((a, b) => a.order - b.order)
      .map((r) => ({ id: r.id, name: r.name, mood: r.mood, note: r.note, visible: r.visible, slug: r.slug || slugify(r.name.vi), items: r.items ?? [] }));
    return save({ ...c, menu });
  };
  const saveItems = (rows: ItemRow[]) =>
    save({ ...c, menu: c.menu.map((m) => ({ ...m, items: rows.filter((r) => r.cat === m.id).map(({ id, name, desc, price, bottle, group, tags, signature, image, visible }) => ({ id, name, desc, price, bottle: bottle || undefined, group: group?.trim() || undefined, tags, signature, image, visible })) })) });

  return (
    <>
      <ListEditor<CatRow>
        title="Danh mục menu" items={cats} fields={CAT_FIELDS}
        blank={() => ({ id: uid(), slug: "", name: bi(), visible: true, items: [], order: cats.length })}
        row={(m) => ({ title: m.name.vi, sub: `#${m.order} · ${m.slug}${m.visible ? "" : " · Ẩn"}` })}
        onChange={saveCats}
      />
      <ListEditor<ItemRow>
        title="Món" items={items} fields={ITEM_FIELDS}
        blank={() => ({ id: uid(), cat: c.menu[0]?.id ?? "", name: "", desc: bi(), price: 260, tags: [], signature: false, image: "", visible: true })}
        row={(i) => ({ title: <>{i.name}{i.signature && <span className="chip !text-[.6rem] ml-2">Signature</span>}</>, sub: `${c.menu.find((m) => m.id === i.cat)?.name.vi ?? "?"}${i.group ? ` · ${i.group}` : ""} · ${money(i.price)}${i.bottle ? ` / chai ${money(i.bottle)}` : ""}${i.visible ? "" : " · Ẩn"}` })}
        onChange={saveItems}
        searchText={(i) => `${i.name} ${i.desc.vi} ${i.group ?? ""} ${i.tags.join(" ")}`}
        toggle={{ on: "Hiện", off: "Ẩn", get: (i) => i.visible, set: (i, v) => ({ ...i, visible: v }) }}
      />
    </>
  );
}

/* ---------------- Ưu đãi ---------------- */
const PROMO_FIELDS: Field[] = [
  { k: "title", label: "Tên ưu đãi", type: "bi", required: true },
  { k: "weekday", label: "Ngày áp dụng", type: "select", half: true, options: [{ v: -1, label: "Mỗi ngày (Happy Hour)" }, ...DAYS.map((d, i) => ({ v: i, label: d }))] },
  { k: "discount", label: "Mức giảm (vd −30%)", type: "text", required: true, half: true },
  { k: "start", label: "Từ", type: "time", half: true },
  { k: "end", label: "Đến", type: "time", half: true },
  { k: "label", label: "Áp dụng cho (vd Aperitif)", type: "bi" },
  { k: "desc", label: "Mô tả", type: "bi" },
  { k: "image", label: "Ảnh", type: "image" },
  { k: "visible", label: "Hiển thị", type: "check" },
];

export function PromosSection({ c, save }: P) {
  return (
    <ListEditor<Promo>
      title="Ưu đãi" items={c.promos} fields={PROMO_FIELDS}
      blank={() => ({ id: uid(), title: bi(), weekday: 4, start: "20:00", end: "01:00", discount: "−30%", label: bi(), desc: bi(), image: "", visible: true })}
      row={(p) => ({ title: `${p.title.vi} ${p.weekday >= 0 ? p.discount : ""}`, sub: `${p.weekday < 0 ? "Mỗi ngày" : DAYS[p.weekday]} · ${p.start}–${p.end} · ${p.discount}${p.visible ? "" : " · Ẩn"}` })}
      onChange={(items) => save({ ...c, promos: items })}
      toggle={{ on: "Hiện", off: "Ẩn", get: (p) => p.visible, set: (p, v) => ({ ...p, visible: v }) }}
    />
  );
}

/* ---------------- Bí mật ---------------- */
const SECRET_FIELDS: Field[] = [
  { k: "week", label: "Tuần (chọn một ngày bất kỳ trong tuần)", type: "date", required: true, half: true },
  { k: "password", label: "Mật khẩu", type: "text", required: true, half: true },
  { k: "note", label: "Ghi chú cho nhân viên (mật khẩu mở khoá gì)", type: "textarea" },
];

export function SecretsSection({ c, save }: P) {
  const items = [...c.secrets].sort((a, b) => b.week.localeCompare(a.week));
  return (
    <>
      <ListEditor<Secret>
        title="Bí mật" items={items} fields={SECRET_FIELDS} empty="Chưa có mật khẩu nào."
        blank={() => ({ id: uid(), week: mondayOf(vnNow().date), password: "", note: "" })}
        row={(s) => ({ title: `Tuần ${dm(s.week)} – ${dm(addDays(s.week, 6))} · ${s.password}`, sub: s.note })}
        onChange={(rows) => save({ ...c, secrets: rows.map((s) => ({ ...s, week: mondayOf(s.week) })) })}
      />
      <p className="text-sm text-fg/70 -mt-10">Mật khẩu của tuần hiện tại hiện ở đầu trang “Tối nay” để nhân viên tra nhanh. Khách không thấy mục này.</p>
    </>
  );
}

/* ---------------- Trang ---------------- */
export function PagesSection({ c, save }: P) {
  const [key, setKey] = useState<"story" | "policies">("story");
  const tabs = [{ k: "story" as const, label: "Câu chuyện Himitsu", path: "/story" }, { k: "policies" as const, label: "Chính sách", path: "/policies" }];
  const page = c.pages[key];
  return (
    <>
      <h1 className="serif text-5xl mb-6">Trang nội dung</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <button key={t.k} type="button" className="pill !text-sm" aria-pressed={key === t.k} onClick={() => setKey(t.k)}>
            {t.label} <span className="opacity-60 ml-1">{t.path}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-fg/70 mb-3">## Tiêu đề · &gt; Trích dẫn · dòng trống = đoạn mới</p>
      <EntityForm
        key={key} title={tabs.find((t) => t.k === key)!.label}
        fields={[{ k: "title", label: "Tiêu đề", type: "bi", required: true }, { k: "body", label: "Nội dung", type: "bitext", required: true }]}
        value={page as unknown as Record<string, unknown>}
        onSave={(v) => save({ ...c, pages: { ...c.pages, [key]: v as unknown as typeof page } })}
      />
    </>
  );
}

/* ---------------- Khoảnh khắc (Gallery) ---------------- */
function MomentGroup({ m, onChange, onRemove }: { m: Moment; onChange: (m: Moment) => void; onRemove: () => void }) {
  const [busy, setBusy] = useState(false);
  const [title, setTitle] = useState(m.title);
  const g = m.images;
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= g.length) return;
    const next = [...g];
    [next[i], next[j]] = [next[j], next[i]];
    onChange({ ...m, images: next });
  };
  return (
    <section className="border border-line bg-card p-5 mb-8">
      <div className="flex flex-wrap items-end gap-3 mb-5">
        <div className="flex-1 min-w-[10rem]"><label className="label !text-sm">Tên nhóm (VI)</label><input className="field !py-2" value={title.vi} onChange={(e) => setTitle({ ...title, vi: e.target.value })} /></div>
        <div className="flex-1 min-w-[10rem]"><label className="label !text-sm">Tên nhóm (EN)</label><input className="field !py-2" value={title.en} onChange={(e) => setTitle({ ...title, en: e.target.value })} /></div>
        <button type="button" className="btn btn-ghost !py-2.5" disabled={title.vi === m.title.vi && title.en === m.title.en} onClick={() => onChange({ ...m, title })}>Lưu tên</button>
        <label className="cursor-pointer">
          <span className="sr-only">Thêm ảnh</span>
          <input type="file" accept="image/*" multiple className="hidden" onChange={async (e) => {
            const files = Array.from(e.target.files ?? []);
            if (!files.length) return;
            setBusy(true);
            try {
              const added: GalleryImage[] = [];
              for (const f of files) added.push({ ...(await uploadImage(f)), alt: bi(f.name.replace(/\.[^.]+$/, "")) });
              onChange({ ...m, images: [...g, ...added] });
            } catch (x) { alert((x as Error).message); } finally { setBusy(false); e.target.value = ""; }
          }} />
          <span className="btn btn-solid !py-2.5 !px-4 !text-[.7rem]"><PlusIcon className="w-4 h-4" />{busy ? "Đang tải…" : "Thêm ảnh"}</span>
        </label>
        <button type="button" aria-label="Xoá nhóm" className="p-2 hover:opacity-70" onClick={() => confirm(`Xoá nhóm “${m.title.vi}” và toàn bộ ảnh trong nhóm?`) && onRemove()}><TrashIcon className="w-4 h-4" /></button>
      </div>
      {g.length === 0 ? <p className="text-fg/75 text-sm">Chưa có ảnh.</p> : (
        <ul className="grid gap-3 grid-cols-2 md:grid-cols-4 xl:grid-cols-6">
          {g.map((im, i) => (
            <li key={im.src + i} className="border border-line bg-bg2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.src} alt={im.alt.vi} className="w-full aspect-square object-cover" />
              <div className="flex items-center justify-between px-2 py-1.5">
                <div className="flex">
                  <button type="button" aria-label="Lên trước" className="p-1.5 hover:opacity-70 disabled:opacity-20 rotate-180" disabled={i === 0} onClick={() => move(i, -1)}><ArrowIcon className="w-4 h-4" /></button>
                  <button type="button" aria-label="Ra sau" className="p-1.5 hover:opacity-70 disabled:opacity-20" disabled={i === g.length - 1} onClick={() => move(i, 1)}><ArrowIcon className="w-4 h-4" /></button>
                </div>
                <button type="button" aria-label="Xoá" className="p-1.5 hover:opacity-70" onClick={() => confirm("Xoá ảnh này?") && onChange({ ...m, images: g.filter((_, k) => k !== i) })}><TrashIcon className="w-4 h-4" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const PHOTO_FIELDS = [
  ["hero", "Ảnh nền đầu trang chủ"],
  ["door", "Ảnh không gian quán (mục Câu chuyện, trang chủ)"],
  ["offers", "Ảnh mục Ưu đãi & sự kiện (khi chưa có sự kiện sắp tới)"],
  ["privateHire", "Ảnh nền khối Thuê riêng (trang Liên hệ)"],
  ["closing", "Ảnh nền khối \"Hẹn gặp bạn tối nay\" (cuối trang chủ)"],
] as const;

export function GallerySection({ c, save }: P) {
  const [photos, setPhotos] = useState(c.photos);
  const set = (m: Moment) => save({ ...c, moments: c.moments.map((x) => (x.id === m.id ? m : x)) });
  return (
    <>
      <H1 right={<button type="button" className="btn btn-solid !py-2.5 !px-4 !text-[.7rem]" onClick={() => save({ ...c, moments: [...c.moments, { id: uid(), title: bi("Nhóm mới"), images: [] }] })}><PlusIcon className="w-4 h-4" />Thêm nhóm</button>}>
        <h1 className="serif text-5xl">Khoảnh khắc</h1>
        <p className="text-sm text-fg/75 mt-1">Mỗi nhóm là một hàng ảnh lướt ngang ở trang Khoảnh khắc (nên khoảng 6 ảnh). Trang chủ lấy 3 ảnh đầu của mỗi nhóm.</p>
      </H1>
      {c.moments.map((m) => <MomentGroup key={m.id} m={m} onChange={set} onRemove={() => save({ ...c, moments: c.moments.filter((x) => x.id !== m.id) })} />)}

      <section className="mt-16 border border-line bg-card p-6">
        <p className="eyebrow mb-6">Ảnh chính</p>
        <div className="space-y-6">
          {PHOTO_FIELDS.map(([k, label]) => (
            <div key={k}>
              <p className="label !text-sm">{label}</p>
              <ImageField value={photos[k]} onChange={(v) => setPhotos({ ...photos, [k]: v })} />
            </div>
          ))}
          <div>
            <p className="label !text-sm">Ảnh cocktail thêm cho mục Signature (hiện sau các món Signature, không kèm chữ)</p>
            <div className="space-y-3">
              {photos.drinks.map((src, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="flex-1"><ImageField value={src} onChange={(v) => setPhotos({ ...photos, drinks: photos.drinks.map((x, j) => (j === i ? v : x)) })} /></div>
                  <button type="button" aria-label="Bỏ ảnh" className="p-2 hover:opacity-70" onClick={() => setPhotos({ ...photos, drinks: photos.drinks.filter((_, j) => j !== i) })}><TrashIcon className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
            <button type="button" className="btn btn-ghost !py-2 !px-3 mt-3" onClick={() => setPhotos({ ...photos, drinks: [...photos.drinks, ""] })}><PlusIcon className="w-4 h-4" />Thêm ảnh</button>
          </div>
        </div>
        <div className="mt-6">
          <p className="label !text-sm">Ảnh trang Câu chuyện (ảnh đầu là banner ngang dưới tiêu đề, các ảnh sau xếp lưới dọc cuối trang)</p>
          <div className="space-y-3">
            {photos.story.map((src, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="flex-1"><ImageField value={src} onChange={(v) => setPhotos({ ...photos, story: photos.story.map((x, j) => (j === i ? v : x)) })} /></div>
                <button type="button" aria-label="Bỏ ảnh" className="p-2 hover:opacity-70" onClick={() => setPhotos({ ...photos, story: photos.story.filter((_, j) => j !== i) })}><TrashIcon className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
          <button type="button" className="btn btn-ghost !py-2 !px-3 mt-3" onClick={() => setPhotos({ ...photos, story: [...photos.story, ""] })}><PlusIcon className="w-4 h-4" />Thêm ảnh</button>
        </div>
        <button type="button" className="btn btn-solid !py-2.5 mt-6" onClick={() => save({ ...c, photos: { ...photos, drinks: photos.drinks.filter(Boolean), story: photos.story.filter(Boolean) } })}>Lưu</button>
      </section>
    </>
  );
}

/* ---------------- Thuê riêng ---------------- */
type PhFilter = "new" | "done" | "all";

export function PrivateSection({ flash, refresh }: { flash: (m: string) => void; refresh: () => void }) {
  const [rows, setRows] = useState<PrivateHire[] | null>(null);
  const [filter, setFilter] = useState<PhFilter>("new");
  useEffect(() => {
    fetch("/api/admin/private").then((r) => (r.ok ? r.json() : [])).then(setRows).catch(() => setRows([]));
  }, []);
  async function call(method: "PATCH" | "DELETE", body: object) {
    const r = await fetch("/api/admin/private", { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    if (!r.ok) flash("Không lưu được, thử lại.");
    else refresh();
    return r.ok;
  }
  const all = rows ?? [];
  const nNew = all.filter((r) => r.status === "new").length;
  const list = all.filter((r) => filter === "all" || r.status === filter).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const FILTERS_PH: { k: PhFilter; label: string; n: number }[] = [{ k: "new", label: "Mới", n: nNew }, { k: "done", label: "Đã xử lý", n: all.length - nNew }, { k: "all", label: "Tất cả", n: all.length }];
  return (
    <>
      <h1 className="serif text-5xl mb-2">Thuê riêng</h1>
      <p className="text-sm text-fg/75 mb-6">Yêu cầu gửi từ nút “Hỏi về thuê riêng” ở trang Liên hệ (cũng được báo về Telegram).</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS_PH.map((f) => <button key={f.k} type="button" className="pill !text-sm" aria-pressed={filter === f.k} onClick={() => setFilter(f.k)}>{f.label} <span className="opacity-60 ml-1">{f.n}</span></button>)}
      </div>
      {rows === null ? <p className="text-fg/75">Đang tải…</p> : list.length === 0 ? <p className="text-fg/75">{all.length === 0 ? "Chưa có yêu cầu nào." : "Không có yêu cầu nào trong mục này."}</p> : (
        <ul className="space-y-2">
          {list.map((r) => {
            const tel = r.phone.replace(/[^d+]/g, "");
            return (
              <li key={r.id} className={`border border-line bg-card px-4 py-4 flex flex-wrap items-center gap-4 ${r.status === "done" ? "opacity-50" : ""}`}>
                <div className="flex-1 min-w-[14rem]">
                  <p className="font-medium">{r.name} · {r.guests} khách{r.date ? ` · ${viDate(r.date)}/${r.date.slice(0, 4)}` : ""}</p>
                  <p className="text-sm text-fg/70">{tel && <a className="link" href={`tel:${tel}`}>{r.phone}</a>}{[r.type, r.note].filter(Boolean).map((x) => ` · ${x}`).join("")}</p>
                  <p className="text-xs text-fg/60 mt-0.5">Gửi lúc {new Date(r.createdAt).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</p>
                </div>
                <button type="button" className="btn btn-ghost !py-2 !px-4 !text-[.7rem]" onClick={async () => {
                  const status = r.status === "done" ? "new" : "done";
                  if (await call("PATCH", { id: r.id, status })) setRows(all.map((x) => (x.id === r.id ? { ...x, status } : x)));
                }}>{r.status === "done" ? "Mở lại" : "Đã xử lý"}</button>
                <button type="button" aria-label="Xoá" className="p-2 hover:opacity-70" onClick={async () => {
                  if (confirm("Xoá yêu cầu này?") && (await call("DELETE", { id: r.id }))) setRows(all.filter((x) => x.id !== r.id));
                }}><TrashIcon className="w-4 h-4" /></button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

/* ---------------- Cài đặt ---------------- */
const SITE_FIELDS: Field[] = [
  { k: "intro", label: "Câu giới thiệu dưới logo", type: "bi" },
  { k: "address", label: "Địa chỉ", type: "bi", required: true },
  { k: "directions", label: "Chỉ đường / lối vào", type: "bi" },
  { k: "phone", label: "Điện thoại", type: "text", required: true, half: true },
  { k: "email", label: "Email", type: "text", half: true },
  { k: "handle", label: "Instagram (handle)", type: "text", half: true },
  { k: "instagram", label: "Instagram URL", type: "text", half: true },
  { k: "facebook", label: "Facebook URL", type: "text", half: true },
  { k: "messenger", label: "Messenger URL", type: "text", half: true },
  { k: "zalo", label: "Zalo URL", type: "text", half: true },
  { k: "telegram", label: "Telegram (@username hoặc số có mã nước)", type: "text", half: true, hint: "Ưu tiên @username vì chắc chắn mở được chat; số điện thoại chỉ mở được nếu tài khoản cho phép tìm bằng số. Để trống sẽ ẩn nút." },
  { k: "mapsUrl", label: "Google Maps URL (nút Chỉ đường)", type: "text", half: true },
  { k: "mapEmbed", label: "Link nhúng bản đồ (để trống = tự tạo)", type: "text", half: true },
  { k: "menuPdf", label: "Menu PDF URL", type: "text", half: true },
];

export function SettingsSection({ c, save }: P) {
  const [hours, setHours] = useState(c.hours);
  const [test, setTest] = useState("");
  const setH = (i: number, k: string, v: string | boolean) => setHours(hours.map((h, j) => (j === i ? { ...h, [k]: v } : h)));
  return (
    <>
      <h1 className="serif text-5xl mb-8">Cài đặt</h1>
      <EntityForm title="Thông tin quán" fields={SITE_FIELDS} value={c.site as unknown as Record<string, unknown>}
        onSave={(v) => save({ ...c, site: { ...c.site, ...(v as unknown as Content["site"]), handle: String(v.handle ?? "").replace(/^@/, "") } })} />

      <h2 className="serif text-4xl mt-14 mb-4">Giờ mở cửa</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] text-sm">
          <thead><tr className="text-left text-fg/75"><th className="py-2 font-medium" /><th className="font-medium">Mở</th><th className="font-medium">Đóng</th><th className="font-medium">Nhận khách cuối</th><th className="font-medium">Nghỉ</th></tr></thead>
          <tbody>
            {hours.map((h, i) => (
              <tr key={i} className="border-t border-line">
                <td className="py-2 pr-4 font-medium">{DAYS[i]}</td>
                {(["open", "close", "last"] as const).map((k) => (
                  <td key={k} className="pr-3"><input type="time" className="field !py-2" value={h[k]} disabled={h.closed} onChange={(e) => setH(i, k, e.target.value)} /></td>
                ))}
                <td><input type="checkbox" className="w-5 h-5 accent-white" checked={h.closed} onChange={(e) => setH(i, "closed", e.target.checked)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-fg/70 mt-2">“Nhận khách cuối” cũng là khung giờ đặt bàn muộn nhất khách chọn được.</p>
      <button type="button" className="btn btn-solid !py-2.5 mt-4" onClick={() => save({ ...c, hours })}>Lưu giờ mở cửa</button>

      <div className="mt-16">
        <ListEditor<{ id: string; date: string; vi: string; en: string }>
          title="Ngày lễ" items={c.holidays.map((h) => ({ ...h, id: h.date }))}
          fields={[{ k: "date", label: "Ngày", type: "date", required: true, half: true }, { k: "vi", label: "Tên (VI)", type: "text", required: true, half: true }, { k: "en", label: "Tên (EN)", type: "text", half: true }]}
          blank={() => ({ id: uid(), date: vnNow().date, vi: "", en: "" })}
          row={(h) => ({ title: `${viDate(h.date)}/${h.date.slice(0, 4)} · ${h.vi}`, sub: h.en })}
          onChange={(rows) => save({ ...c, holidays: rows.map(({ date, vi, en }) => ({ date, vi, en })).sort((a, b) => a.date.localeCompare(b.date)) })}
        />
      </div>

      <section className="border border-line bg-card p-6">
        <p className="eyebrow mb-3">Thông báo đặt bàn</p>
        <p className="text-sm text-fg/80">Mỗi đặt bàn mới được gửi về Telegram (cấu hình trong file .env.local).</p>
        <button type="button" className="btn btn-ghost !py-2.5 mt-4" onClick={async () => {
          setTest("Đang gửi…");
          const j = await fetch("/api/admin?telegram=test").then((r) => r.json()).catch(() => ({ detail: "lỗi kết nối" }));
          setTest(j.detail);
        }}>Gửi tin thử</button>
        {test && <p className="text-sm mt-3">{test}</p>}
      </section>
    </>
  );
}
