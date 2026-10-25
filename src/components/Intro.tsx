// Màn chào 秘 – chỉ hiện ở lần mở trang đầu tiên trong phiên.
// Script chạy trước khi trình duyệt vẽ trang: đã xem rồi thì gắn class "no-intro" lên <html> để ẩn ngay, không bị nháy.
const SCRIPT = `try{if(sessionStorage.getItem("intro"))document.documentElement.classList.add("no-intro");else sessionStorage.setItem("intro","1")}catch(e){}`;

export default function Intro() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
      <div className="intro" aria-hidden="true">
        <span className="line" />
        <span className="seal kanji">秘</span>
      </div>
    </>
  );
}
