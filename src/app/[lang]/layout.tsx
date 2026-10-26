import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Intro from "@/components/Intro";
import Motion from "@/components/Motion";
import { LANGS, Lang } from "@/lib/content";
import { DICT } from "@/lib/i18n";
import { getContent } from "@/lib/content-server";

// Nội dung đọc từ data/content.json ở mỗi lượt truy cập (sửa trong /admin là có ngay), nên không dùng instant navigation.
export const instant = false;

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!LANGS.includes(lang as Lang)) notFound();
  const c = await getContent();
  const l = lang as Lang;
  return (
    <>
      <Intro lang={l} />
      <Motion />
      <Header lang={l} nav={DICT[l].nav} instagram={c.site.instagram} facebook={c.site.facebook} />
      <main className="page-in">{children}</main>
      <Footer lang={l} c={c} />
    </>
  );
}
