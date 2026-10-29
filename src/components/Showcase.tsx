// Phòng trưng bày các ly signature: mỗi ly một khối ảnh lớn kèm tên và thành phần, cuộn bình thường (không hiệu ứng chuyển cảnh); ly lơ lửng nhẹ.
import Image from "next/image";

export type Exhibit = { key: string; image: string; name?: string; notes?: string[] };

export default function Showcase({ items }: { items: Exhibit[] }) {
  return (
    <div className="sig-deck">
      {items.map((it) => (
        <article key={it.key} className={`sig-card${it.name ? "" : " sig-wide"}`}>
          <div className="sig-stage">
            <div className="sig-pic">
              <div className="sig-float">
                <Image src={it.image} alt={it.name ?? ""} fill sizes="(min-width:768px) 60vw, 100vw" className="object-cover" />
              </div>
              <span className="sig-beam" aria-hidden="true" />
            </div>
            {it.name && (
              <div className="sig-meta">
                <h3 className="sig-name">{it.name}</h3>
                {it.notes && it.notes.length > 0 && (
                  <ul className="sig-notes">
                    {it.notes.map((n) => <li key={n}>{n}</li>)}
                  </ul>
                )}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
