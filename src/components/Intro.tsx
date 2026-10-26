import Logo from "./Logo";
import IntroFx from "./IntroFx";
import type { Lang } from "@/lib/content";
import { DICT } from "@/lib/i18n";

// Màn chào – chỉ hiện ở lần mở trang đầu tiên trong phiên:
// gợn sóng lan trên nền sóng Nhật, bụi sao xoáy lại thành logo, khe cửa bừng sáng rồi hai cánh cửa mở ra.
// Script chạy trước khi trình duyệt vẽ trang: đã xem rồi (hoặc máy tắt hiệu ứng) thì gắn "no-intro" để ẩn ngay;
// chưa xem thì gắn "intro-on" để hoạt ảnh ở hero chờ cửa mở. Sau 9 giây tự gỡ phòng khi JS không chạy.
const SCRIPT = `try{var d=document.documentElement;if(sessionStorage.getItem("intro")||matchMedia("(prefers-reduced-motion: reduce)").matches)d.classList.add("no-intro");else{sessionStorage.setItem("intro","1");d.classList.add("intro-on");setTimeout(function(){d.classList.remove("intro-on")},9000)}}catch(e){}`;

export default function Intro({ lang }: { lang: Lang }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
      <div className="intro" aria-hidden="true" data-phase="wait">
        <span className="door l" />
        <span className="door r" />
        <span className="ripple" />
        <span className="line" />
        <span className="halo" />
        <canvas className="intro-cv" />
        <span className="mark"><Logo height={120} className="max-w-[78vw] h-auto" /></span>
        <span className="streak" />
        <span className="seam" />
        <button type="button" className="enter" tabIndex={-1}>{DICT[lang].introEnter}</button>
      </div>
      <IntroFx />
    </>
  );
}
