// Các ly signature: lưới 2 cột ảnh dọc 4:5. Tên và thành phần đã nằm trong ảnh nên không có chữ phủ thêm, không giá.
import Image from "next/image";

export default function Showcase({ images }: { images: string[] }) {
  return (
    <ul className="sig-deck">
      {images.map((src, i) => (
        <li key={src + i} className="sig-card">
          <div className="sig-pic">
            <Image src={src} alt="" fill sizes="(min-width:1024px) 490px, (min-width:768px) 45vw, 50vw" className="object-cover" />
          </div>
        </li>
      ))}
    </ul>
  );
}
