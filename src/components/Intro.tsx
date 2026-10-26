import Logo from "./Logo";

// Màn chào: logo Himitsu trên nền sóng Nhật, rồi hai cánh cửa mở sang hai bên – chỉ hiện ở lần mở trang đầu tiên trong phiên.
// Script chạy trước khi trình duyệt vẽ trang: đã xem rồi thì gắn class "no-intro" lên <html> để ẩn ngay, không bị nháy.
const SCRIPT = `try{if(sessionStorage.getItem("intro"))document.documentElement.classList.add("no-intro");else sessionStorage.setItem("intro","1")}catch(e){}`;

export default function Intro() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
      <div className="intro" aria-hidden="true">
        <span className="door l" />
        <span className="door r" />
        <span className="line" />
        <span className="mark"><Logo height={88} className="max-w-[70vw] h-auto" /></span>
      </div>
    </>
  );
}
