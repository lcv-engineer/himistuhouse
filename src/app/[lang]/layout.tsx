import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LANGS, Lang, zaloUrl } from "@/lib/content";
import { getContent } from "@/lib/content-server";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!LANGS.includes(lang as Lang)) notFound();
  const c = await getContent();
  const s = c.site;
  return (
    <>
      <Header lang={lang as Lang} nav={c.t[lang as Lang].nav} links={{ instagram: s.instagram, facebook: s.facebook, messenger: s.messenger, zalo: zaloUrl(s) }} />
      <main className="page-in mx-auto max-w-6xl px-4">{children}</main>
      <Footer lang={lang as Lang} c={c} />
    </>
  );
}
