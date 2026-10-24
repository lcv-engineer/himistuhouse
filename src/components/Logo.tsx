import Image from "next/image";

export default function Logo({ height = 40 }: { height?: number }) {
  return (
    <Image
      src="/images/logo.png"
      alt="Himitsu – house of cocktail"
      width={640}
      height={197}
      priority
      style={{ height, width: "auto" }}
    />
  );
}
