// Các ly signature: lưới 2 cột ảnh dọc 4:5, tên ly và thành phần (chép từ ảnh) hiện dạng chữ ở góc trái bên dưới mỗi ảnh, không giá.
import Image from "next/image";

// Theo đúng thứ tự 4 ảnh trong content.photos.drinks.
const INFO = [
  { name: "“Yamato” Penicillin", mix: "Whisky, Osmanthus Honey, Wasabi, Tamarin Cordial" },
  { name: "Zen Leaf Sour", mix: "Pandan-infused Japanese Whisky, Matcha Agave, Coconut Whey" },
  { name: "Kōyō Boulevard", mix: "Calvados, Umeshu Amaro, House Rosso Vermouth, Rhubarb Bitter" },
  { name: "Shibuya Heat", mix: "Genmaicha Inf Monkey Shoulder, Red Bean, Rosso Vermouth, Red Miso, CO2" },
];

export default function Showcase({ images }: { images: string[] }) {
  return (
    <ul className="sig-deck">
      {images.map((src, i) => (
        <li key={src + i} className="sig-card">
          <div className="sig-pic">
            <Image src={src} alt={INFO[i]?.name ?? ""} fill sizes="(min-width:1024px) 490px, (min-width:768px) 45vw, 50vw" className="object-cover" />
          </div>
          {INFO[i] && (
            <div className="mt-3 text-left">
              <p className="serif text-lg md:text-xl leading-tight">{INFO[i].name}</p>
              <p className="text-xs md:text-sm text-fg/75 mt-1 leading-snug">{INFO[i].mix}</p>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
