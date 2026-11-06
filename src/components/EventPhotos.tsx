"use client";
// Ảnh sự kiện ở trang Sự kiện: ảnh lớn ở trên, các ảnh nhỏ bên dưới; bấm ảnh nhỏ thì hiện bản lớn.
import Image from "next/image";
import { useState } from "react";

export default function EventPhotos({ images, alt }: { images: string[]; alt: string }) {
  const [cur, setCur] = useState(0);
  if (!images.length) return null;
  const big = images[Math.min(cur, images.length - 1)];
  return (
    <div>
      <div className="relative aspect-[3/2] overflow-hidden">
        <Image key={big} src={big} alt={alt} fill sizes="(min-width:768px) 520px, 100vw" className="object-cover" priority={cur === 0} />
      </div>
      {images.length > 1 && (
        <div className="mt-2 grid grid-cols-5 gap-2" role="tablist" aria-label={alt}>
          {images.map((src, i) => (
            <button key={src + i} type="button" role="tab" aria-selected={i === cur} aria-label={`${alt} ${i + 1}`} onClick={() => setCur(i)}
              className={`relative aspect-[4/3] overflow-hidden border transition-opacity ${i === cur ? "border-fg" : "border-transparent opacity-60 hover:opacity-100"}`}>
              <Image src={src} alt="" fill sizes="(min-width:768px) 100px, 20vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
