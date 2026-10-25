"use client";
import { useCallback, useEffect, useState } from "react";
import type { Content } from "@/lib/content";

import SeatingMap from "@/components/SeatingMap";

type Row = { id: string; createdAt: string; name: string; phone: string; date: string; time: string; guests: number; note: string; status: string; table?: string };
type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

const TABS = [
  { id: "res", label: "Đặt bàn" },
  { id: "map", label: "Sơ đồ chỗ ngồi" },
  { id: "site", label: "Thông tin chung" },
  { id: "t.en", label: "Chữ trên web (English)" },
  { id: "t.vi", label: "Chữ trên web (Tiếng Việt)" },
  { id: "menu", label: "Menu" },
  { id: "events", label: "Sự kiện" },
  { id: "gallery", label: "Gallery" },
  { id: "photos", label: "Ảnh trang chủ" },
] as const;

const COMMON: Record<string, string> = {
  vi: "Tiếng Việt", en: "English",
};
const LABELS: Record<string, Record<string, string>> = {
  site: {
    name: "Tên quán", tagline: "Dòng phụ dưới tên quán", address: "Địa chỉ", hours: "Giờ mở cửa", hotline: "Hotline (hiện cạnh nút đặt bàn)", zaloPhone: "Số Zalo (dùng cho nút đặt bàn)",
    instagram: "Link Instagram", facebook: "Link Facebook", messenger: "Link Messenger",
    mapEmbed: "Link nhúng Google Maps (để trống = tự tạo từ địa chỉ)",
  },
  t: {
    nav: "Tên các mục trên thanh menu", story: "Câu chuyện", menu: "Menu", events: "Sự kiện", gallery: "Gallery", contact: "Liên hệ", reserve: "Đặt bàn",
    open: "Dòng “mở cửa” ở đầu trang", orCall: "Chữ “hoặc gọi”", hotline: "Nhãn “Hotline”", menuNote: "Ghi chú giá dưới Menu", holdNote: "Ghi chú giữ bàn (dùng {hotline})", heroTitle: "Tiêu đề lớn trang chủ", heroSub: "Dòng mô tả trang chủ", cta: "Nút đặt bàn",
    drinksTitle: "Tiêu đề mục đồ uống", eventsTitle: "Tiêu đề mục ưu đãi & sự kiện", nightsTitle: "Tiêu đề mục cuối trang chủ",
    storyTitle: "Tiêu đề trang Câu chuyện", storyBody: "Các đoạn nội dung Câu chuyện", menuTitle: "Tiêu đề trang Menu", eventsPage: "Tiêu đề trang Sự kiện",
    galleryTitle: "Tiêu đề trang Gallery", contactTitle: "Tiêu đề trang Liên hệ", showMap: "Chữ “xem bản đồ”",
    address: "Nhãn “Địa chỉ”", hours: "Nhãn “Giờ mở cửa”", follow: "Nhãn “Theo dõi”", rights: "Dòng bản quyền",
    reservation: "Trang đặt bàn", title: "Tiêu đề", name: "Nhãn họ tên", phone: "Nhãn số điện thoại", date: "Nhãn ngày", time: "Nhãn giờ", guests: "Nhãn số khách",
    note: "Nhãn ghi chú", submit: "Nút gửi", ok: "Thông báo thành công", zaloCta: "Nút Zalo", copy: "Nút copy", copied: "Chữ sau khi copy", zaloHint: "Hướng dẫn gửi Zalo",
    err: "Thông báo lỗi", msgTpl: "Mẫu tin nhắn Zalo (dùng {name} {phone} {guests} {time} {date} {note})", noteTpl: "Mẫu phần ghi chú (dùng {note})",
  },
  menu: { cat: "Tên nhóm", items: "Các món", n: "Tên món", d: "Mô tả", p: "Giá (nghìn đồng, vd 180)" },
  events: { t: "Tên sự kiện", w: "Thời gian", d: "Mô tả" },
  gallery: { src: "Ảnh", w: "Rộng (px)", h: "Cao (px)", alt: "Mô tả ảnh (cho người khiếm thị / SEO)" },
  photos: {
    hero: "Ảnh nền đầu trang chủ", story1: "Ảnh Câu chuyện 1", story2: "Ảnh Câu chuyện 2",
    drinks: "Ảnh các thẻ đồ uống (theo thứ tự món đầu tiên trong Menu)", events: "Ảnh các thẻ sự kiện (theo thứ tự sự kiện)",
  },
};

const isImg = (s: string) => /^\/(images|api\/media)\//.test(s);
const blank = (v: Json): Json =>
  typeof v === "string" ? "" : typeof v === "number" ? 0 : Array.isArray(v) ? [] : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, blank(x)])) : v;

function ImageField({ value, onChange, onUploaded }: { value: string; onChange: (v: string) => void; onUploaded?: (src: string, w: number, h: number) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function upload(f: File) {
    setBusy(true); setErr("");
    try {
      const bmp = await createImageBitmap(f);
      const fd = new FormData(); fd.append("file", f);
      const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "lỗi tải ảnh");
      if (onUploaded) onUploaded(j.src, bmp.width, bmp.height); else onChange(j.src);
    } catch (e) { setErr((e as Error).message); }
    setBusy(false);
  }
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {value ? <img src={value} alt="" className="h-16 w-16 object-cover border border-white/15" /> : <div className="h-16 w-16 border border-dashed border-white/25" />}
      <input value={value} onChange={(e) => onChange(e.target.value)} className="inp flex-1 min-w-48" placeholder="/images/..." />
      <label className="btn cursor-pointer">{busy ? "Đang tải…" : "Tải ảnh mới"}
        <input type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      </label>
      {err && <span className="text-red-400 text-sm">{err}</span>}
    </div>
  );
}

function Node({ v, onChange, sec, k }: { v: Json; onChange: (v: Json) => void; sec: string; k: string }) {
  const label = LABELS[sec]?.[k] ?? COMMON[k] ?? k;
  if (typeof v === "string") {
    if (isImg(v) || k === "src" || sec === "photos") {
      return <Row label={label}><ImageField value={v} onChange={onChange} /></Row>;
    }
    return <Row label={label}>{v.length > 70 || v.includes("\n") ? <textarea className="inp" rows={Math.min(8, Math.ceil(v.length / 70) + 1)} value={v} onChange={(e) => onChange(e.target.value)} /> : <input className="inp" value={v} onChange={(e) => onChange(e.target.value)} />}</Row>;
  }
  if (typeof v === "number") return <Row label={label}><input type="number" className="inp w-32" value={v} onChange={(e) => onChange(Number(e.target.value))} /></Row>;
  if (Array.isArray(v)) {
    const tpl = v.length ? blank(v[0]) : "";
    const move = (i: number, d: number) => { const a = [...v]; const j = i + d; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; onChange(a); };
    return (
      <fieldset className="box">
        <legend className="px-2 text-gold">{label} ({v.length})</legend>
        {v.map((it, i) => (
          <div key={i} className="item">
            <div className="flex justify-between mb-2 text-sm text-muted">
              <span>#{i + 1}</span>
              <span className="flex gap-2">
                <button type="button" className="btn" onClick={() => move(i, -1)}>↑</button>
                <button type="button" className="btn" onClick={() => move(i, 1)}>↓</button>
                <button type="button" className="btn text-red-400" onClick={() => confirm("Xoá mục này?") && onChange(v.filter((_, j) => j !== i))}>Xoá</button>
              </span>
            </div>
            <Node v={it} sec={sec} k="" onChange={(nv) => onChange(v.map((x, j) => (j === i ? nv : x)))} />
          </div>
        ))}
        <button type="button" className="btn mt-2" onClick={() => onChange([...v, tpl])}>+ Thêm</button>
      </fieldset>
    );
  }
  if (v && typeof v === "object") {
    const obj = v as { [k: string]: Json };
    const setUp = (src: string, w: number, h: number) => onChange({ ...obj, src, w, h });
    return (
      <fieldset className="box">
        {k && <legend className="px-2 text-gold">{label}</legend>}
        {Object.keys(obj).map((ck) => {
          if (ck === "src" && "w" in obj && "h" in obj) {
            return <Row key={ck} label={LABELS[sec]?.src ?? "Ảnh"}><ImageField value={String(obj.src)} onChange={(s) => onChange({ ...obj, src: s })} onUploaded={setUp} /></Row>;
          }
          return <Node key={ck} v={obj[ck]} sec={sec} k={ck} onChange={(nv) => onChange({ ...obj, [ck]: nv })} />;
        })}
      </fieldset>
    );
  }
  return null;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block mb-3"><span className="block text-sm text-muted mb-1">{label}</span>{children}</label>;
}

export default function Admin() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("res");
  const [rows, setRows] = useState<Row[]>([]);
  const [content, setContent] = useState<Content | null>(null);
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState("");

  const loadRows = useCallback(async () => {
    const r = await fetch("/api/admin");
    if (!r.ok) { setAuthed(false); return; }
    setRows(await r.json()); setAuthed(true);
  }, []);
  const loadContent = useCallback(async () => {
    const r = await fetch("/api/admin/content");
    if (r.ok) { setContent(await r.json()); setDirty(false); }
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRows().then(loadContent);
  }, [loadRows, loadContent]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/admin", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (r.ok) { setErr(""); await loadRows(); await loadContent(); } else setErr("Sai mật khẩu");
  }
  async function setStatus(id: string, status: string) {
    await fetch("/api/admin", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, status }) });
    loadRows();
  }
  async function setTable(id: string, table: string) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, table } : r)));
    await fetch("/api/admin", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, table }) });
  }
  async function testTelegram() {
    setMsg("Đang gửi tin thử…");
    const r = await fetch("/api/admin?telegram=test");
    const j = await r.json();
    setMsg(j.ok ? `Đã gửi tin thử (${j.detail}). Kiểm tra điện thoại.` : `Chưa hoạt động: ${j.error}`);
  }
  async function del(id: string) {
    if (!confirm("Xoá đặt bàn này?")) return;
    await fetch("/api/admin", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ id }) });
    loadRows();
  }
  async function save() {
    setMsg("Đang lưu…");
    const r = await fetch("/api/admin/content", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(content) });
    if (r.ok) { setDirty(false); setMsg("Đã lưu. Trang web đã cập nhật."); } else setMsg("Lưu thất bại.");
  }
  async function reset() {
    if (!confirm("Khôi phục TOÀN BỘ nội dung về mặc định? Mọi chỉnh sửa sẽ mất.")) return;
    const r = await fetch("/api/admin/content", { method: "DELETE" });
    if (r.ok) { setContent(await r.json()); setDirty(false); setMsg("Đã khôi phục mặc định."); }
  }

  const style = (
    <style>{`.inp{width:100%;background:#17120e;border:1px solid rgb(255 255 255/.15);padding:.45rem .6rem;color:inherit;font-family:var(--font-sans),sans-serif;font-size:.9rem}
    .inp:focus{border-color:#c9a15b;outline:none}.btn{border:1px solid rgb(201 161 91/.6);padding:.25rem .7rem;font-size:.8rem;font-family:var(--font-sans),sans-serif}
    .btn:hover{background:rgb(201 161 91/.15)}.box{border:1px solid rgb(255 255 255/.12);padding:.8rem 1rem;margin-bottom:1rem}
    .item{border-top:1px dashed rgb(255 255 255/.12);padding-top:.8rem;margin-top:.8rem}`}</style>
  );

  if (authed === null) return <div className="p-10 text-muted">Đang tải…</div>;
  if (!authed) {
    return (
      <form onSubmit={login} className="mx-auto max-w-sm mt-32 grid gap-3 px-4">
        {style}
        <h1 className="text-xl text-gold">Admin Himitsu</h1>
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Mật khẩu" className="inp" autoFocus />
        <button className="bg-gold text-bg py-2">Đăng nhập</button>
        {err && <p className="text-red-400">{err}</p>}
      </form>
    );
  }

  const [top, sub] = tab.split(".");
  const data = content as unknown as Record<string, Json> | null;
  const section = data ? (sub ? (data[top] as { [k: string]: Json })[sub] : data[top]) : null;
  const setSection = (nv: Json) => {
    if (!content) return;
    const next = structuredClone(content) as unknown as Record<string, Json>;
    if (sub) (next[top] as { [k: string]: Json })[sub] = nv; else next[top] = nv;
    setContent(next as unknown as Content); setDirty(true); setMsg("");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 font-sans">
      {style}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h1 className="text-xl text-gold">Admin Himitsu</h1>
        <div className="flex gap-3 text-sm"><a className="underline" href="/en" target="_blank">Xem web (EN)</a><a className="underline" href="/vi" target="_blank">Xem web (VI)</a></div>
      </div>
      <nav className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => { setTab(t.id); setMsg(""); if (t.id === "res" || t.id === "map") loadRows(); }} className={`btn ${tab === t.id ? "bg-gold text-bg" : ""}`} style={tab === t.id ? { background: "#c9a15b", color: "#0d0a08" } : undefined}>{t.label}</button>
        ))}
      </nav>

      {tab === "map" ? (
        <SeatingMap rows={rows} onTable={setTable} />
      ) : tab === "res" ? (
        <div className="overflow-x-auto">
          <div className="mb-3 flex items-center gap-3 flex-wrap">
            <p className="text-muted">Tổng: {rows.length} yêu cầu đặt bàn</p>
            <button className="btn" onClick={testTelegram}>Gửi tin thử thông báo</button>
            {msg && <span className="text-sm text-yellow-400">{msg}</span>}
          </div>
          <table className="w-full text-sm text-left">
            <thead className="text-muted"><tr><th className="p-2">Tên</th><th>SĐT / Zalo</th><th>Ngày</th><th>Giờ</th><th>Khách</th><th>Ghi chú</th><th>Bàn</th><th>Trạng thái</th><th /></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-white/10">
                  <td className="p-2">{r.name}</td><td><a className="underline" href={`https://zalo.me/${r.phone.replace(/\s+/g, "")}`} target="_blank">{r.phone}</a></td><td>{r.date}</td><td>{r.time}</td><td>{r.guests}</td><td>{r.note}</td>
                  <td><input key={r.table ?? ""} defaultValue={r.table ?? ""} placeholder="vd B3, B4" onBlur={(e) => e.target.value !== (r.table ?? "") && setTable(r.id, e.target.value)} className="inp w-28" /></td>
                  <td>
                    <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)} className="inp w-auto">
                      <option value="new">Mới</option><option value="confirmed">Đã xác nhận</option><option value="cancelled">Huỷ</option>
                    </select>
                  </td>
                  <td><button className="btn text-red-400" onClick={() => del(r.id)}>Xoá</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : section !== null && section !== undefined ? (
        <>
          <Node v={section} sec={top} k="" onChange={setSection} />
          <div className="sticky bottom-0 bg-bg/95 border-t border-white/10 py-3 flex items-center gap-3 flex-wrap">
            <button className="bg-gold text-bg px-6 py-2 disabled:opacity-50" onClick={save} disabled={!dirty}>Lưu thay đổi</button>
            <button className="btn" onClick={reset}>Khôi phục mặc định</button>
            {dirty && <span className="text-yellow-400 text-sm">Có thay đổi chưa lưu</span>}
            {msg && <span className="text-green-400 text-sm">{msg}</span>}
          </div>
        </>
      ) : <p className="text-muted">Đang tải nội dung…</p>}
    </div>
  );
}
