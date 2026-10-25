import { notFound } from "next/navigation";
import { LANGS, Lang } from "./content";

// Lấy ngôn ngữ từ URL; đường dẫn lạ (vd /wp-login.php, /robots.txt) trả 404 thay vì làm trang bị lỗi.
export async function getLang(params: Promise<{ lang: string }>): Promise<Lang> {
  const { lang } = await params;
  if (!LANGS.includes(lang as Lang)) notFound();
  return lang as Lang;
}
