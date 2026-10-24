import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LANGS, Lang } from "@/lib/content";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!LANGS.includes(lang as Lang)) notFound();
  return (
    <>
      <Header lang={lang as Lang} />
      <main className="mx-auto max-w-6xl px-4">{children}</main>
      <Footer lang={lang as Lang} />
    </>
  );
}
