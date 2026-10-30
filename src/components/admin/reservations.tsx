"use client";
// Đặt bàn trong trang quản trị: "Tối nay" (theo ngày, theo tuần) và "Đặt bàn" (toàn bộ, tìm kiếm, xuất CSV).
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowIcon, PencilIcon, PlusIcon, TrashIcon } from "../Icons";
import { EntityForm, Field } from "./Form";
import type { Content } from "@/lib/content";
import type { Reservation, Status } from "@/lib/store";
import { addDays, mondayOf, nightDate, toMin, weekday } from "@/lib/time";

const WD = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const dm = (d: string) => `${Number(d.slice(8))}/${Number(d.slice(5, 7))}`;
const viDate = (d: string) => `${WD[weekday(d)]}, ${dm(d)}`;
const ST: Record<Status, string> = { new: "Mới", confirmed: "Đã xác nhận", cancelled: "Đã huỷ", arrived: "Đã đến", noshow: "No-show" };
const byTime = (a: Reservation, b: Reservation) => toMin(a.time) - toMin(b.time) || a.createdAt.localeCompare(b.createdAt);
const sum = (rs: Reservation[]) => rs.reduce((s, r) => s + r.guests, 0);
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase();
const digits = (s: string) => s.replace(/\D/g, "");

type Flash = (m: string) => void;
type Filter = "all" | "wait" | "arrived" | "noshow" | "cancelled";
const FILTERS: { k: Filter; label: string; test: (r: Reservation) => boolean }[] = [
  { k: "all", label: "Tất cả", test: () => true },
  { k: "wait", label: "Chưa đến", test: (r) => r.status === "confirmed" || r.status === "new" },
  { k: "arrived", label: "Đã đến", test: (r) => r.status === "arrived" },
  { k: "noshow", label: "No-show", test: (r) => r.status === "noshow" },
  { k: "cancelled", label: "Đã huỷ", test: (r) => r.status === "cancelled" },
];

/** Khớp tên, số điện thoại (bỏ dấu cách, dấu chấm), mã đặt bàn hoặc email. */
function matches(r: Reservation, q: string) {
  const t = q.trim();
  if (!t) return true;
  const d = digits(t);
  return norm(`${r.name} ${r.email ?? ""} ${r.code ?? ""} ${r.note}`).includes(norm(t)) || (d.length >= 3 && digits(r.phone).includes(d));
}

function useReservations(flash: Flash) {
  const [rows, setRows] = useState<Reservation[] | null>(null);
  const load = useCallback(() => {
    fetch("/api/admin").then((r) => (r.ok ? r.json() : null)).then((d) => d && setRows(d)).catch(() => {});
  }, []);
  useEffect(() => {
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, [load]);

  const replace = (row: Reservation) => setRows((x) => (x ?? []).map((y) => (y.id === row.id ? row : y)));
  async function call(url: string, method: string, body: object) {
    const res = await fetch(url, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    if (!res.ok) { flash("Không lưu được, thử lại."); return null; }
    return res.json();
  }
  return {
    rows,
    async setStatus(r: Reservation, status: Status) {
      if (status === "cancelled" && !confirm(`Huỷ đặt bàn của ${r.name}?`)) return;
      const j = await call("/api/admin", "PATCH", { id: r.id, status });
      if (j) { replace(j.row); flash("Đã lưu"); }
    },
    async edit(r: Reservation, patch: object) {
      const j = await call("/api/admin", "PATCH", { id: r.id, patch });
      if (j) { replace(j.row); flash("Đã lưu"); }
      return !!j;
    },
    async add(body: object) {
      const j = await call("/api/admin/reservations", "POST", body);
      if (j) { setRows((x) => [j.row, ...(x ?? [])]); flash("Đã thêm đặt bàn"); }
      return !!j;
    },
    async remove(r: Reservation) {
      if (!confirm(`Xoá hẳn đặt bàn của ${r.name}? Không khôi phục được.`)) return;
      if (await call("/api/admin", "DELETE", { id: r.id })) { setRows((x) => (x ?? []).filter((y) => y.id !== r.id)); flash("Đã xoá"); }
    },
  };
}
type Api = ReturnType<typeof useReservations>;

/* ---------- Form thêm / sửa ---------- */
const FORM_FIELDS: Field[] = [
  { k: "name", label: "Tên khách", type: "text", required: true, half: true },
  { k: "phone", label: "Số điện thoại", type: "text", half: true },
  { k: "date", label: "Ngày", type: "date", required: true, half: true },
  { k: "time", label: "Giờ", type: "time", required: true, half: true },
  { k: "guests", label: "Số khách", type: "number", required: true, half: true },
  { k: "seating", label: "Chỗ ngồi (vd Quầy bar)", type: "text", half: true },
  { k: "email", label: "Email", type: "text", half: true },
  { k: "occasion", label: "Dịp (vd Sinh nhật)", type: "text", half: true },
  { k: "note", label: "Ghi chú", type: "textarea" },
];

function ResForm({ title, value, onSave, onCancel }: { title: string; value: Partial<Reservation>; onSave: (v: Record<string, unknown>) => void; onCancel: () => void }) {
  return <EntityForm title={title} fields={FORM_FIELDS} value={value as Record<string, unknown>} onSave={onSave} onCancel={onCancel} />;
}

/* ---------- Một dòng đặt bàn ---------- */
const BTN = "btn btn-ghost !py-2 !px-4 !text-[.7rem]";

function ResRow({ r, api, showDate, onEdit }: { r: Reservation; api: Api; showDate?: boolean; onEdit: () => void }) {
  const tags = [r.occasion, r.seating, ...(r.taste ?? [])].filter(Boolean).join(" · ");
  const off = r.status === "cancelled";
  const done = r.status === "arrived" || r.status === "noshow";
  const tel = r.phone.replace(/[^\d+]/g, "");
  return (
    <li className={`border border-line bg-card px-4 py-4 flex flex-wrap items-center gap-4 ${off ? "opacity-50" : ""}`}>
      <span className="w-16">
        <span className="serif text-2xl block">{r.time}</span>
        {showDate && <span className="text-xs text-fg/70">{viDate(r.date)}</span>}
      </span>
      <div className="flex-1 min-w-[14rem]">
        <p className="font-medium">
          {r.name} · {r.guests} khách <span className="chip !text-[.65rem] ml-1 text-fg/80">{ST[r.status] ?? r.status}</span>
          {r.source === "admin" && <span className="chip !text-[.65rem] ml-1 text-fg/80">Nhập tay</span>}
        </p>
        <p className="text-sm text-fg/70">
          {tel && <a className="link" href={`tel:${tel}`}>{r.phone}</a>}
          {[r.code, r.eventTitle, r.email, r.note].filter(Boolean).map((x) => ` · ${x}`).join("")}
        </p>
        {tags && <p className="text-sm font-medium mt-0.5">{tags}</p>}
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        {off ? (
          <>
            <button type="button" className={BTN} onClick={() => api.setStatus(r, "confirmed")}>Khôi phục</button>
            <button type="button" aria-label="Xoá hẳn" className="p-2 hover:opacity-70" onClick={() => api.remove(r)}><TrashIcon className="w-4 h-4" /></button>
          </>
        ) : (
          <>
            <button type="button" className={BTN} disabled={r.status === "arrived"} onClick={() => api.setStatus(r, "arrived")}>Đã đến</button>
            <button type="button" className={BTN} disabled={r.status === "noshow"} onClick={() => api.setStatus(r, "noshow")}>No-show</button>
            {done && <button type="button" className={BTN} onClick={() => api.setStatus(r, "confirmed")}>Hoàn tác</button>}
            <button type="button" className="btn btn-danger !py-2 !px-4 !text-[.7rem]" onClick={() => api.setStatus(r, "cancelled")}>Huỷ</button>
            <button type="button" aria-label="Sửa" className="p-2 hover:opacity-70" onClick={onEdit}><PencilIcon className="w-4 h-4" /></button>
          </>
        )}
      </div>
    </li>
  );
}

/** Danh sách + form sửa dùng chung giữa hai mục. */
function useEditor(api: Api) {
  const [edit, setEdit] = useState<{ r?: Reservation; blank?: Partial<Reservation> } | null>(null);
  const form = edit && (
    <ResForm
      key={edit.r?.id ?? "new"} title={edit.r ? `Sửa đặt bàn · ${edit.r.name}` : "Thêm đặt bàn"}
      value={edit.r ?? edit.blank ?? {}} onCancel={() => setEdit(null)}
      onSave={async (v) => { if (await (edit.r ? api.edit(edit.r, v) : api.add(v))) setEdit(null); }}
    />
  );
  const open = (r?: Reservation, blank?: Partial<Reservation>) => { setEdit({ r, blank }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return { form, open };
}

function Chips({ rows, value, onChange }: { rows: Reservation[]; value: Filter; onChange: (f: Filter) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <button key={f.k} type="button" className="pill !text-sm" aria-pressed={value === f.k} onClick={() => onChange(f.k)}>
          {f.label} <span className="opacity-60 ml-1">{rows.filter(f.test).length}</span>
        </button>
      ))}
    </div>
  );
}

const Search = ({ value, onChange, id }: { value: string; onChange: (v: string) => void; id: string }) => (
  <div className="min-w-[14rem] flex-1 max-w-sm">
    <label className="label !text-sm" htmlFor={id}>Tìm đặt bàn</label>
    <input id={id} type="search" className="field !py-2" placeholder="Tên, số điện thoại, mã…" value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

/* ---------------- Tối nay ---------------- */
export function TonightSection({ c, flash }: { c: Content; flash: Flash }) {
  // Trang admin chỉ render ở trình duyệt (sau khi kiểm tra đăng nhập) nên đọc URL ngay được.
  const [date, setDate] = useState(() => new URLSearchParams(location.search).get("date") || nightDate());
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const api = useReservations(flash);
  const { form, open } = useEditor(api);
  const today = useMemo(() => nightDate(), []);
  const rows = api.rows ?? [];

  const pick = (d: string) => {
    setDate(d);
    history.replaceState(null, "", d === today ? "/admin" : `/admin?date=${d}`);
  };

  const week = Array.from({ length: 7 }, (_, i) => addDays(mondayOf(date), i));
  const live = rows.filter((r) => r.status !== "cancelled");
  const count = (d: string) => { const x = live.filter((r) => r.date === d); return { n: x.length, g: sum(x) }; };

  const day = rows.filter((r) => r.date === date).sort(byTime);
  const active = day.filter((r) => r.status !== "cancelled");
  const searching = q.trim() !== "";
  const test = FILTERS.find((f) => f.k === filter)!.test;
  const list = searching
    ? rows.filter((r) => matches(r, q) && test(r)).sort((a, b) => b.date.localeCompare(a.date) || byTime(a, b)).slice(0, 100)
    : day.filter(test);
  const bySlot = Object.entries(active.reduce<Record<string, number>>((m, r) => ({ ...m, [r.time]: (m[r.time] ?? 0) + r.guests }), {}))
    .sort((a, b) => toMin(a[0]) - toMin(b[0]));
  const secret = c.secrets.find((s) => s.week === mondayOf(date));

  async function copy() {
    const text = [`Himitsu · ${viDate(date)} · ${active.length} bàn · ${sum(active)} khách`, ...active.map((r) => `${r.time} ${r.name} x${r.guests}${r.phone ? ` ${r.phone}` : ""}${r.note ? ` (${r.note})` : ""}`)].join("\n");
    try { await navigator.clipboard.writeText(text); flash("Đã sao chép danh sách"); } catch { flash("Không sao chép được."); }
  }

  return (
    <>
      {form}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="serif text-5xl">{date === today ? "Tối nay" : `Ngày ${viDate(date)}`}</h1>
          <p className="text-sm text-fg/75 mt-1">{viDate(date)} · {active.length} bàn · {sum(active)} khách</p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="label !text-sm" htmlFor="ad-date">Chọn ngày</label>
            <input id="ad-date" type="date" className="field !py-2" value={date} onChange={(e) => e.target.value && pick(e.target.value)} />
          </div>
          <button type="button" className="btn btn-solid !py-2.5 !px-4 !text-[.7rem]" onClick={() => open(undefined, { date, time: "20:00", guests: 2, name: "" })}><PlusIcon className="w-4 h-4" />Thêm đặt bàn</button>
        </div>
      </div>

      <div className="flex items-stretch gap-1 mb-6 overflow-x-auto" role="group" aria-label="Tuần này">
        <button type="button" aria-label="Tuần trước" className="px-2 hover:opacity-70 rotate-180" onClick={() => pick(addDays(date, -7))}><ArrowIcon className="w-4 h-4" /></button>
        {week.map((d) => {
          const { n, g } = count(d);
          return (
            <button key={d} type="button" aria-pressed={d === date} onClick={() => pick(d)}
              className={`flex-1 min-w-[4.4rem] border px-2 py-2 text-center ${d === date ? "border-fg bg-white/[.07]" : "border-line hover:bg-white/[.04]"}`}>
              <span className="block text-[.7rem] text-fg/70">{WD[weekday(d)]}{d === today && " · nay"}</span>
              <span className="block font-medium">{dm(d)}</span>
              <span className="block text-[.7rem] text-fg/70">{n ? `${n} bàn · ${g}` : "—"}</span>
            </button>
          );
        })}
        <button type="button" aria-label="Tuần sau" className="px-2 hover:opacity-70" onClick={() => pick(addDays(date, 7))}><ArrowIcon className="w-4 h-4" /></button>
      </div>

      <div className="grid gap-3 grid-cols-2 md:grid-cols-4 mb-6">
        {([["Đặt bàn", active.length], ["Khách", sum(active)], ["Đã đến", day.filter((r) => r.status === "arrived").length], ["No-show", day.filter((r) => r.status === "noshow").length]] as const).map(([label, n]) => (
          <div key={label} className="border border-line bg-card px-4 py-3">
            <p className="text-xs text-fg/70">{label}</p>
            <p className="serif text-3xl">{n}</p>
          </div>
        ))}
      </div>

      <div className="border border-line bg-card px-4 py-4 mb-6">
        <p className="eyebrow text-red !text-[.65rem]">Mật khẩu tuần này</p>
        {secret ? <p className="mt-1"><span className="serif text-2xl mr-3">{secret.password}</span><span className="text-sm text-fg/75">{secret.note}</span></p> : <p className="text-sm text-fg/80 mt-1">Chưa có mật khẩu cho tuần này.</p>}
      </div>

      {bySlot.length > 0 && (
        <div className="mb-6">
          <p className="eyebrow !text-[.65rem] text-fg/80 mb-2">Theo khung giờ</p>
          <div className="flex flex-wrap gap-2">{bySlot.map(([t, n]) => <span key={t} className="chip !text-[.7rem]">{t} · {n}</span>)}</div>
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
        <Search id="ad-q" value={q} onChange={setQ} />
        <div className="flex flex-wrap items-center gap-3">
          <Chips rows={searching ? rows.filter((r) => matches(r, q)) : day} value={filter} onChange={setFilter} />
          {!searching && active.length > 0 && <button type="button" className="link text-sm" onClick={copy}>Sao chép danh sách</button>}
        </div>
      </div>

      {api.rows === null ? <p className="text-fg/75">Đang tải…</p>
        : list.length === 0 ? <p className="text-fg/75">{searching ? "Không tìm thấy đặt bàn nào." : day.length ? "Không có đặt bàn nào trong bộ lọc này." : "Chưa có đặt bàn nào cho ngày này."}</p>
        : (
          <ul className="space-y-2">
            {list.map((r) => <ResRow key={r.id} r={r} api={api} showDate={searching} onEdit={() => open(r)} />)}
          </ul>
        )}
      {searching && list.length === 100 && <p className="text-xs text-fg/70 mt-3">Chỉ hiện 100 kết quả mới nhất, hãy gõ cụ thể hơn.</p>}
      <div className="mt-8 flex gap-3 text-sm">
        <button type="button" className="link" onClick={() => pick(addDays(date, -1))}>← Ngày trước</button>
        <button type="button" className="link" onClick={() => pick(addDays(date, 1))}>Ngày sau →</button>
      </div>
    </>
  );
}

/* ---------------- Toàn bộ đặt bàn ---------------- */
type Range = "upcoming" | "past" | "all";
const RANGES: { k: Range; label: string }[] = [{ k: "upcoming", label: "Sắp tới" }, { k: "past", label: "Đã qua" }, { k: "all", label: "Tất cả" }];
const csv = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

function exportCsv(rs: Reservation[]) {
  const head = ["Mã", "Ngày", "Giờ", "Tên", "SĐT", "Email", "Số khách", "Trạng thái", "Dịp", "Chỗ ngồi", "Sự kiện", "Ghi chú", "Tạo lúc"];
  const body = rs.map((r) => [r.code, r.date, r.time, r.name, r.phone, r.email, r.guests, ST[r.status], r.occasion, r.seating, r.eventTitle, r.note, r.createdAt].map(csv).join(","));
  // BOM để Excel đọc đúng tiếng Việt.
  const blob = new Blob(["﻿" + [head.map(csv).join(","), ...body].join("\r\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `dat-ban-${nightDate()}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function ReservationsSection({ flash }: { flash: Flash }) {
  const [range, setRange] = useState<Range>("upcoming");
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(60);
  const api = useReservations(flash);
  const { form, open } = useEditor(api);
  const today = useMemo(() => nightDate(), []);
  const rows = api.rows ?? [];

  const inRange = rows.filter((r) => matches(r, q) && (range === "all" || (range === "upcoming" ? r.date >= today : r.date < today)));
  const test = FILTERS.find((f) => f.k === filter)!.test;
  const list = inRange.filter(test).sort((a, b) => (range === "past" || range === "all" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)) || byTime(a, b));
  const shown = list.slice(0, limit);
  const groups = shown.reduce<[string, Reservation[]][]>((g, r) => (g.at(-1)?.[0] === r.date ? (g.at(-1)![1].push(r), g) : [...g, [r.date, [r]]]), []);

  return (
    <>
      {form}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="serif text-5xl">Đặt bàn</h1>
          <p className="text-sm text-fg/75 mt-1">{list.length} đặt bàn · {sum(list.filter((r) => r.status !== "cancelled"))} khách (không tính đã huỷ)</p>
        </div>
        <div className="flex gap-3">
          <button type="button" className="btn btn-ghost !py-2.5 !px-4 !text-[.7rem]" disabled={!list.length} onClick={() => exportCsv(list)}>Xuất CSV</button>
          <button type="button" className="btn btn-solid !py-2.5 !px-4 !text-[.7rem]" onClick={() => open(undefined, { date: today, time: "20:00", guests: 2, name: "" })}><PlusIcon className="w-4 h-4" />Thêm đặt bàn</button>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4 mb-4">
        <Search id="ad-q2" value={q} onChange={(v) => { setQ(v); setLimit(60); }} />
        <div className="flex gap-2">
          {RANGES.map((x) => <button key={x.k} type="button" className="pill !text-sm" aria-pressed={range === x.k} onClick={() => { setRange(x.k); setLimit(60); }}>{x.label}</button>)}
        </div>
      </div>
      <div className="mb-6"><Chips rows={inRange} value={filter} onChange={(f) => { setFilter(f); setLimit(60); }} /></div>

      {api.rows === null ? <p className="text-fg/75">Đang tải…</p> : groups.length === 0 ? <p className="text-fg/75">Không có đặt bàn nào.</p> : groups.map(([d, rs]) => (
        <section key={d} className="mb-8">
          <h2 className="serif text-2xl mb-3">{viDate(d)}/{d.slice(0, 4)}{d === today && " · tối nay"} <span className="text-sm text-fg/70 font-sans">{rs.length} bàn · {sum(rs.filter((r) => r.status !== "cancelled"))} khách</span></h2>
          <ul className="space-y-2">{rs.map((r) => <ResRow key={r.id} r={r} api={api} onEdit={() => open(r)} />)}</ul>
        </section>
      ))}
      {list.length > limit && <button type="button" className="btn btn-ghost !py-2.5" onClick={() => setLimit(limit + 60)}>Xem thêm ({list.length - limit})</button>}
    </>
  );
}
