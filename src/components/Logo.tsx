export default function Logo({ size = "text-3xl" }: { size?: string }) {
  return (
    <span className="inline-flex flex-col items-start leading-none">
      <span className={`logo-script ${size} text-gold`}>Himitsu</span>
      <span className="text-[0.6rem] tracking-[0.3em] uppercase text-muted mt-1">house of cocktail</span>
    </span>
  );
}
