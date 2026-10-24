"use client";
import { useEffect, useState } from "react";

type Row = { id: string; createdAt: string; name: string; phone: string; date: string; time: string; guests: number; note: string; status: string };

export default function Admin() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    const r = await fetch("/api/admin");
    setRows(r.ok ? await r.json() : null);
  }
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/admin", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: pw }) });
    if (r.ok) { setErr(""); load(); } else setErr("Sai mật khẩu");
  }
  async function setStatus(id: string, status: string) {
    await fetch("/api/admin", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, status }) });
    load();
  }

  if (!rows) {
    return (
      <form onSubmit={login} className="mx-auto max-w-sm mt-32 grid gap-3 px-4">
        <h1 className="text-xl text-gold">Admin</h1>
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Mật khẩu" className="bg-card border border-white/15 px-3 py-2" />
        <button className="bg-gold text-bg py-2">Đăng nhập</button>
        {err && <p className="text-red-400">{err}</p>}
      </form>
    );
  }
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-xl text-gold mb-6">Đặt bàn ({rows.length})</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-muted"><tr><th className="p-2">Tên</th><th>SĐT</th><th>Ngày</th><th>Giờ</th><th>Khách</th><th>Ghi chú</th><th>Trạng thái</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10">
                <td className="p-2">{r.name}</td><td>{r.phone}</td><td>{r.date}</td><td>{r.time}</td><td>{r.guests}</td><td>{r.note}</td>
                <td>
                  <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)} className="bg-card border border-white/15 px-2 py-1">
                    <option value="new">Mới</option><option value="confirmed">Đã xác nhận</option><option value="cancelled">Huỷ</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
