"use client";
// Form và danh sách dùng chung cho các mục trong /admin.
import { useState } from "react";
import { PencilIcon, PlusIcon, TrashIcon } from "../Icons";
import type { Bi } from "@/lib/content";

export type Field = {
  k: string; label: string; required?: boolean; half?: boolean; hint?: string;
  type: "text" | "bi" | "bitext" | "number" | "date" | "time" | "check" | "image" | "select" | "tags" | "textarea";
  options?: { v: string | number; label: string }[];
};
type Obj = Record<string, unknown>;

export const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
export const uid = () => Math.random().toString(36).slice(2, 10);

export async function uploadImage(file: File): Promise<{ src: string; w: number; h: number }> {
  const fd = new FormData();
  fd.append("file", file);
  const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Tải ảnh thất bại");
  const size = await new Promise<{ w: number; h: number }>((res) => {
    const img = new window.Image();
    img.onload = () => res({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => res({ w: 1200, h: 1200 });
    img.src = j.src;
  });
  return { src: j.src, ...size };
}

export function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  return (
    <div className="flex items-start gap-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {value ? <img src={value} alt="" className="w-28 h-20 object-cover border border-line" /> : <div className="w-28 h-20 border border-dashed border-line grid place-items-center text-xs text-muted">Chưa có ảnh</div>}
      <div className="flex-1 space-y-2">
        <input className="field !py-2 text-sm" value={value} placeholder="/images/photos/… hoặc tải ảnh lên" onChange={(e) => onChange(e.target.value)} />
        <label className="btn btn-ghost !py-2 !px-3 cursor-pointer">
          {busy ? "Đang tải…" : "Tải ảnh lên"}
          <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
            const f = e.target.files?.[0];
            if (!f) return;
            setBusy(true); setErr("");
            try { onChange((await uploadImage(f)).src); } catch (x) { setErr((x as Error).message); } finally { setBusy(false); e.target.value = ""; }
          }} />
        </label>
        {err && <p className="text-xs text-[#e36b6f]">{err}</p>}
      </div>
    </div>
  );
}

/** Form tạo mới / chỉnh sửa một đối tượng. Trường song ngữ có nút VI / EN như bản cũ. */
export function EntityForm({ title, fields, value, onSave, onCancel }: { title: string; fields: Field[]; value: Obj; onSave: (v: Obj) => void; onCancel?: () => void }) {
  const [v, setV] = useState<Obj>(value);
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [err, setErr] = useState("");
  const set = (k: string, x: unknown) => setV((o) => ({ ...o, [k]: x }));
  const bi = fields.filter((f) => f.type === "bi" || f.type === "bitext");
  const enEmpty = bi.some((f) => !((v[f.k] as Bi)?.en ?? "").trim() && ((v[f.k] as Bi)?.vi ?? "").trim());

  function submit(e: React.FormEvent) {
    e.preventDefault();
    for (const f of fields) {
      if (!f.required) continue;
      const x = v[f.k];
      const empty = f.type === "bi" || f.type === "bitext" ? !((x as Bi)?.vi ?? "").trim() : x === undefined || String(x).trim() === "";
      if (empty) return setErr(`Vui lòng nhập “${f.label}”.`);
    }
    onSave(v);
  }

  return (
    <form onSubmit={submit} className="border border-line bg-card p-6 mb-8">
      <p className="eyebrow mb-5">{title}</p>
      {bi.length > 0 && (
        <div className="flex items-center gap-4 mb-6">
          <div className="inline-flex border border-line">
            {(["vi", "en"] as const).map((l) => (
              <button key={l} type="button" onClick={() => setLang(l)} className={`px-4 py-2 text-xs font-semibold ${lang === l ? "bg-fg text-[#111]" : ""}`}>{l.toUpperCase()}</button>
            ))}
          </div>
          {enEmpty && <span className="text-sm text-[#e36b6f]">● Bản tiếng Anh đang trống.</span>}
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-2">
        {fields.map((f) => {
          const x = v[f.k];
          const lab = (
            <label className="label !text-sm" htmlFor={`f-${f.k}`}>
              {f.label}{f.required && " *"}{(f.type === "bi" || f.type === "bitext") && <span className="text-muted font-normal"> ({lang.toUpperCase()})</span>}
            </label>
          );
          const full = !f.half || f.type === "bitext" || f.type === "textarea" || f.type === "image";
          let input: React.ReactNode;
          switch (f.type) {
            case "bi":
              input = <input id={`f-${f.k}`} className="field" value={(x as Bi)?.[lang] ?? ""} onChange={(e) => set(f.k, { ...((x as Bi) ?? { vi: "", en: "" }), [lang]: e.target.value })} />;
              break;
            case "bitext":
              input = <textarea id={`f-${f.k}`} className="field min-h-40" value={(x as Bi)?.[lang] ?? ""} onChange={(e) => set(f.k, { ...((x as Bi) ?? { vi: "", en: "" }), [lang]: e.target.value })} />;
              break;
            case "textarea":
              input = <textarea id={`f-${f.k}`} className="field min-h-28" value={String(x ?? "")} onChange={(e) => set(f.k, e.target.value)} />;
              break;
            case "number":
              input = <input id={`f-${f.k}`} type="number" className="field" value={Number(x ?? 0)} onChange={(e) => set(f.k, Number(e.target.value))} />;
              break;
            case "check":
              return (
                <label key={f.k} className="flex items-center gap-3 text-sm font-medium cursor-pointer md:col-span-1">
                  <input type="checkbox" className="w-5 h-5 accent-white" checked={Boolean(x)} onChange={(e) => set(f.k, e.target.checked)} />{f.label}
                </label>
              );
            case "image":
              input = <ImageField value={String(x ?? "")} onChange={(s) => set(f.k, s)} />;
              break;
            case "select":
              input = (
                <select id={`f-${f.k}`} className="field" value={String(x ?? "")} onChange={(e) => {
                  const o = f.options?.find((o) => String(o.v) === e.target.value);
                  set(f.k, o ? o.v : e.target.value);
                }}>
                  {f.options?.map((o) => <option key={String(o.v)} value={String(o.v)}>{o.label}</option>)}
                </select>
              );
              break;
            case "tags":
              input = <input id={`f-${f.k}`} className="field" value={((x as string[]) ?? []).join(", ")} onChange={(e) => set(f.k, e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />;
              break;
            default:
              input = <input id={`f-${f.k}`} type={f.type} className="field" value={String(x ?? "")} onChange={(e) => set(f.k, e.target.value)} />;
          }
          return (
            <div key={f.k} className={full ? "md:col-span-2" : ""}>
              {lab}{input}
              {f.hint && <p className="text-xs text-muted mt-1.5">{f.hint}</p>}
            </div>
          );
        })}
      </div>
      {err && <p className="text-sm text-[#e36b6f] mt-4">{err}</p>}
      <div className="mt-6 flex gap-3">
        <button className="btn btn-solid !py-2.5">Lưu</button>
        {onCancel && <button type="button" className="btn btn-ghost !py-2.5" onClick={onCancel}>Huỷ</button>}
      </div>
    </form>
  );
}

export const AddButton = ({ onClick }: { onClick: () => void }) => (
  <button type="button" onClick={onClick} className="btn btn-solid !py-2.5 !px-4 !text-[.7rem]"><PlusIcon className="w-4 h-4" />Thêm mới</button>
);

/** Danh sách có nút sửa / xoá, form hiện ở đầu danh sách. */
/** Nút bật/tắt nhanh ngay trên dòng (vd Hiện/Ẩn món, Đã đăng/Nháp) không cần mở form. */
export type Toggle<T> = { on: string; off: string; get: (it: T) => boolean; set: (it: T, v: boolean) => T };

export function ListEditor<T extends { id: string }>({ title, items, fields, blank, row, onChange, empty = "Chưa có gì ở đây.", searchText, toggle }: {
  title: string; items: T[]; fields: Field[]; blank: () => T; row: (it: T) => { title: React.ReactNode; sub?: React.ReactNode };
  onChange: (items: T[]) => void; empty?: string;
  /** Có hàm này và danh sách dài hơn 6 mục thì hiện ô tìm kiếm. */
  searchText?: (it: T) => string; toggle?: Toggle<T>;
}) {
  const [editing, setEditing] = useState<{ v: T; isNew: boolean } | null>(null);
  const [q, setQ] = useState("");
  const fold = (x: string) => x.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase();
  const shown = searchText && q.trim() ? items.filter((it) => fold(searchText(it)).includes(fold(q.trim()))) : items;
  return (
    <section className="mb-16">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="serif text-4xl md:text-5xl">{title}</h2>
        {!editing && <AddButton onClick={() => setEditing({ v: blank(), isNew: true })} />}
      </div>
      {editing && (
        <EntityForm
          key={editing.v.id} title={editing.isNew ? "Tạo mới" : "Chỉnh sửa"} fields={fields} value={editing.v as unknown as Obj}
          onCancel={() => setEditing(null)}
          onSave={(v) => {
            const x = v as unknown as T;
            onChange(editing.isNew ? [...items, x] : items.map((i) => (i.id === x.id ? x : i)));
            setEditing(null);
          }}
        />
      )}
      {searchText && items.length > 6 && (
        <input type="search" aria-label={`Tìm trong ${title}`} className="field !py-2 mb-4 max-w-sm" placeholder="Tìm…" value={q} onChange={(e) => setQ(e.target.value)} />
      )}
      {items.length === 0 ? <p className="text-fg/75">{empty}</p> : shown.length === 0 ? <p className="text-fg/75">Không tìm thấy.</p> : (
        <ul className="border-t border-line">
          {shown.map((it) => {
            const r = row(it);
            return (
              <li key={it.id} className="flex items-center gap-4 border-b border-line py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{r.title}</p>
                  {r.sub && <p className="text-sm text-fg/70 truncate">{r.sub}</p>}
                </div>
                {toggle && (() => {
                  const on = toggle.get(it);
                  return <button type="button" className="pill !text-[.7rem]" aria-pressed={on} onClick={() => onChange(items.map((i) => (i.id === it.id ? toggle.set(i, !on) : i)))}>{on ? toggle.on : toggle.off}</button>;
                })()}
                <button type="button" aria-label="Sửa" className="p-2 hover:opacity-70" onClick={() => { setEditing({ v: it, isNew: false }); window.scrollTo({ top: 0, behavior: "smooth" }); }}><PencilIcon className="w-4 h-4" /></button>
                <button type="button" aria-label="Xoá" className="p-2 hover:opacity-70" onClick={() => confirm("Xoá mục này?") && onChange(items.filter((i) => i.id !== it.id))}><TrashIcon className="w-4 h-4" /></button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
