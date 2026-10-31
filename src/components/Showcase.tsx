// Các ly signature: lưới thẻ 2 cột, ảnh dọc 4:5, tên và thành phần nằm dưới ảnh. Không giá, không nhãn đè trên ảnh (góp ý 23.10).
// Ảnh chưa có tên (cocktail thêm) chỉ hiện ảnh.
import Image from "next/image";

export type Exhibit = { key: string; image: string; name?: string; notes?: string[] };

export default function Showcase({ items }: { items: Exhibit[] }) {
  return (
    <ul className="sig-deck">
      {items.map((it) => (
        <li key={it.key} className="sig-card">
          <div className="sig-pic">
            <Image src={it.image} alt={it.name ?? ""} fill sizes="(min-width:1024px) 490px, (min-width:768px) 45vw, 50vw" className="object-cover" />
          </div>
          {it.name && (
            <div className="sig-meta">
              <h3 className="sig-name serif">{it.name}</h3>
              {it.notes && it.notes.length > 0 && <p className="sig-notes">{it.notes.join(" · ")}</p>}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
