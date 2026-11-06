// Mô tả sự kiện thường dán cả bản Việt lẫn bản Anh vào một ô, ngăn bằng một dòng gạch (____ hoặc ----).
// Hàm này lấy đúng phần theo ngôn ngữ đang xem, dựa vào việc đoạn đó có nhiều chữ tiếng Việt có dấu hay không.
import type { Lang } from "./content";

const SEP = /\n[ \t]*[_\-=*~]{4,}[ \t]*\n/;
const VN = /[ăâđêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/gi;

export function pickLang(text: string, lang: Lang): string {
  const parts = text.split(SEP).map((p) => p.trim()).filter(Boolean);
  if (parts.length < 2) return text.trim();
  const score = (p: string) => (p.match(VN) ?? []).length / Math.max(p.length, 1);
  const ranked = [...parts].sort((a, b) => score(b) - score(a));
  return lang === "vi" ? ranked[0] : ranked[ranked.length - 1];
}
