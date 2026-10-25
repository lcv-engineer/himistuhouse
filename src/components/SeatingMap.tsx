"use client";
import { useMemo, useState } from "react";

export type MapRes = { id: string; name: string; phone: string; date: string; time: string; guests: number; note: string; status: string; table?: string };

export type Seat = { id: string; kind: "circle" | "rect"; cx?: number; cy?: number; r?: number; x?: number; y?: number; w?: number; h?: number; cap: string; label?: string };
type Deco = { x: number; y: number; w: number; h: number; text?: string; style?: "wall" | "bar" | "zone" | "dash" | "green" | "window"; vertical?: boolean; gold?: boolean };

const stool = (id: string, cx: number, cy: number): Seat => ({ id, kind: "circle", cx, cy, r: 40, cap: "1" });
const box = (id: string, x: number, y: number, w: number, h: number, cap: string): Seat => ({ id, kind: "rect", x, y, w, h, cap });

export const FLOORS = {
  f1: {
    title: "Tầng 1",
    seats: [
      stool("B1", 1223, 653), stool("B2", 1127, 653), stool("B3", 1030, 653), stool("B4", 933, 653), stool("B5", 837, 653),
      stool("B6", 743, 740), stool("B7", 743, 834), stool("B8", 743, 929), stool("B9", 743, 1024), stool("B10", 743, 1119),
      stool("B11", 1179, 1193), stool("B12", 1288, 1193), stool("B13", 1396, 1193),
      box("W1", 481, 678, 137, 104, "2"), box("W2", 481, 1063, 137, 103, "2"),
      box("O1", 319, 734, 82, 81, "2"), box("O2", 319, 903, 82, 82, "2"),
    ] as Seat[],
    deco: [
      { x: 141, y: 510, w: 279, h: 733, style: "dash", text: "NGOÀI TRỜI", vertical: true },
      { x: 358, y: 437, w: 809, h: 66, style: "green" }, { x: 141, y: 1250, w: 279, h: 88, style: "green" },
      { x: 420, y: 505, w: 1435, h: 837, style: "wall" },
      { x: 418, y: 605, w: 16, h: 508, style: "window" },
      { x: 785, y: 695, w: 700, h: 458, style: "bar", text: "QUẦY BAR" },
      { x: 1655, y: 517, w: 187, h: 421, style: "zone", text: "BẾP", vertical: true },
      { x: 1655, y: 945, w: 187, h: 385, style: "zone", text: "CẦU THANG ↑ T2", vertical: true, gold: true },
      { x: 1322, y: 498, w: 150, h: 16, style: "zone", text: "" },
    ] as Deco[],
  },
  f2: {
    title: "Tầng 2",
    seats: [
      box("U2", 422, 542, 242, 112, "4"), box("U3", 770, 542, 243, 112, "4"), box("U4", 367, 773, 112, 299, "2"),
      box("U1", 1217, 983, 145, 234, "6–8"),
    ] as Seat[],
    deco: [
      { x: 152, y: 483, w: 153, h: 887, style: "green" },
      { x: 313, y: 478, w: 1542, h: 899, style: "wall" },
      { x: 586, y: 806, w: 486, h: 556, style: "zone", text: "THÔNG TẦNG" },
      { x: 1098, y: 883, w: 90, h: 467, style: "bar" }, { x: 1391, y: 883, w: 91, h: 467, style: "bar" }, { x: 1188, y: 1257, w: 203, h: 93, style: "bar" },
      { x: 1640, y: 742, w: 189, h: 367, style: "zone", text: "CẦU THANG", vertical: true, gold: true },
      { x: 1484, y: 1116, w: 356, h: 246, style: "zone", text: "VỆ SINH" },
      { x: 367, y: 1270, w: 208, h: 82, style: "zone", text: "QUẦY PHỤC VỤ" },
      { x: 1093, y: 503, w: 407, h: 183, style: "zone" },
    ] as Deco[],
  },
} as const;

const tablesOf = (r: MapRes) => (r.table ?? "").split(/[,\s]+/).map((s) => s.trim().toUpperCase()).filter(Boolean);

export default function SeatingMap({ rows, onTable }: { rows: MapRes[]; onTable: (id: string, table: string) => void }) {
  const [floor, setFloor] = useState<"f1" | "f2">("f1");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [sel, setSel] = useState<string | null>(null);

  const day = useMemo(() => rows.filter((r) => r.date === date && r.status !== "cancelled").sort((a, b) => a.time.localeCompare(b.time)), [rows, date]);
  const byTable = useMemo(() => {
    const m: Record<string, MapRes[]> = {};
    for (const r of day) for (const t of tablesOf(r)) (m[t] ??= []).push(r);
    return m;
  }, [day]);
  const unassigned = day.filter((r) => tablesOf(r).length === 0);
  const F = FLOORS[floor];

  const assign = (r: MapRes, id: string) => onTable(r.id, [...tablesOf(r), id].join(", "));
  const unassign = (r: MapRes, id: string) => onTable(r.id, tablesOf(r).filter((t) => t !== id).join(", "));

  const fill = (id: string) => (byTable[id]?.length ? "#c9a15b" : sel === id ? "#5a4a35" : "#3c3731");
  const txt = (id: string) => (byTable[id]?.length ? "#0d0a08" : "#efe6d8");

  return (
    <div className="font-sans">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {(["f1", "f2"] as const).map((f) => (
          <button key={f} className="btn" style={floor === f ? { background: "#c9a15b", color: "#0d0a08" } : undefined} onClick={() => { setFloor(f); setSel(null); }}>{FLOORS[f].title}</button>
        ))}
        <label className="flex items-center gap-2 text-sm text-muted">Ngày
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="inp w-auto" />
        </label>
        <span className="text-sm text-muted">{day.length} đặt bàn, {unassigned.length} chưa xếp bàn</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <svg viewBox="100 380 1800 1030" className="w-full bg-[#141210] border border-white/10 rounded" role="img" aria-label={`Sơ đồ chỗ ngồi ${F.title}`}>
          {F.deco.map((d, i) => {
            const common = { x: d.x, y: d.y, width: d.w, height: d.h };
            const st = d.style;
            const rect = st === "wall" ? <rect {...common} fill="none" stroke="#d8cfc0" strokeWidth={14} />
              : st === "bar" ? <rect {...common} fill="#2c2822" stroke="#6b6254" strokeWidth={3} rx={6} />
              : st === "green" ? <rect {...common} fill="#101a14" stroke="#1d2b22" strokeWidth={2} />
              : st === "dash" ? <rect {...common} fill="none" stroke="#6b6254" strokeWidth={3} strokeDasharray="22 14" />
              : st === "window" ? <rect {...common} fill="#1a262d" stroke="#d8cfc0" strokeWidth={3} />
              : <rect {...common} fill="#171512" stroke="#4a443a" strokeWidth={3} />;
            return (
              <g key={i}>
                {rect}
                {d.text && (
                  <text x={d.x + d.w / 2} y={d.y + d.h / 2} textAnchor="middle" dominantBaseline="middle" fill={d.gold ? "#d9a04a" : "#7d7466"}
                    fontSize={st === "bar" && d.w > 600 ? 56 : 36} letterSpacing={6} transform={d.vertical ? `rotate(-90 ${d.x + d.w / 2} ${d.y + d.h / 2})` : undefined}>{d.text}</text>
                )}
              </g>
            );
          })}
          {floor === "f1" && <g><text x={1397} y={410} textAnchor="middle" fill="#d9a04a" fontSize={32} letterSpacing={5}>LỐI VÀO</text><path d="M1397 440 V 540 M1380 520 L1397 560 L1414 520 Z" stroke="#d9a04a" strokeWidth={5} fill="#d9a04a" /></g>}
          {F.seats.map((s) => {
            const booked = byTable[s.id]?.length;
            const cls = { cursor: "pointer" } as const;
            const label = (cx: number, cy: number) => (
              <>
                <text x={cx} y={cy - (s.kind === "rect" ? 6 : 0)} textAnchor="middle" dominantBaseline="middle" fill={txt(s.id)} fontSize={s.kind === "circle" ? 26 : 34} fontWeight={700}>{s.id}</text>
                {s.kind === "rect" && <text x={cx} y={cy + 28} textAnchor="middle" fill={booked ? "#0d0a08" : "#9b8f80"} fontSize={22} letterSpacing={2}>{s.cap} KHÁCH</text>}
              </>
            );
            return s.kind === "circle" ? (
              <g key={s.id} style={cls} onClick={() => setSel(s.id)}>
                <circle cx={s.cx} cy={s.cy} r={s.r} fill={fill(s.id)} stroke={sel === s.id ? "#fff" : "#7d7466"} strokeWidth={sel === s.id ? 6 : 3} />
                {label(s.cx!, s.cy!)}
                <title>{s.id}{booked ? `: ${byTable[s.id].map((r) => `${r.time} ${r.name}`).join("; ")}` : " – trống"}</title>
              </g>
            ) : (
              <g key={s.id} style={cls} onClick={() => setSel(s.id)}>
                <rect x={s.x} y={s.y} width={s.w} height={s.h} rx={10} fill={fill(s.id)} stroke={sel === s.id ? "#fff" : "#7d7466"} strokeWidth={sel === s.id ? 6 : 3} />
                {label(s.x! + s.w! / 2, s.y! + s.h! / 2)}
                <title>{s.id}{booked ? `: ${byTable[s.id].map((r) => `${r.time} ${r.name}`).join("; ")}` : " – trống"}</title>
              </g>
            );
          })}
        </svg>

        <aside className="text-sm space-y-4">
          <div className="flex gap-3 text-xs text-muted">
            <span><span className="inline-block w-3 h-3 align-middle mr-1" style={{ background: "#c9a15b" }} />Đã có khách</span>
            <span><span className="inline-block w-3 h-3 align-middle mr-1" style={{ background: "#3c3731" }} />Trống</span>
          </div>
          {sel ? (
            <div className="box">
              <p className="text-gold mb-2">Bàn {sel}</p>
              {(byTable[sel] ?? []).map((r) => (
                <div key={r.id} className="mb-2 flex justify-between gap-2"><span>{r.time} · {r.name} ({r.guests}) · {r.phone}</span><button className="btn text-red-400" onClick={() => unassign(r, sel)}>Bỏ</button></div>
              ))}
              {!byTable[sel]?.length && <p className="text-muted mb-2">Chưa có khách ngày này.</p>}
              {unassigned.length > 0 && <p className="text-muted mt-3 mb-1">Xếp khách chưa có bàn vào {sel}:</p>}
              {unassigned.map((r) => (
                <button key={r.id} className="btn block w-full text-left mb-1" onClick={() => assign(r, sel)}>{r.time} · {r.name} ({r.guests} khách)</button>
              ))}
            </div>
          ) : <p className="text-muted">Bấm vào một bàn để xem khách và xếp bàn.</p>}
          <div>
            <p className="text-muted mb-1">Đặt bàn ngày {date}</p>
            {day.length === 0 && <p className="text-muted">Không có.</p>}
            {day.map((r) => (
              <p key={r.id} className="mb-1">{r.time} · {r.name} ({r.guests}) <span className="text-gold">{r.table ? `→ ${r.table}` : "· chưa xếp"}</span></p>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
