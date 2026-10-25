import Image from "next/image";

// logo.png màu vàng; lọc thành trắng như bản cũ.
export default function Logo({ height = 40, className = "" }: { height?: number; className?: string }) {
  return (
    <Image
      src="/images/logo.png"
      alt="Himitsu – house of cocktail"
      width={640}
      height={197}
      priority
      className={className}
      style={{ height, width: "auto", filter: "brightness(0) invert(1)" }}
    />
  );
}
