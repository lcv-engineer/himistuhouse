export type Lang = "vi" | "en";
export const LANGS: Lang[] = ["vi", "en"];

export const SITE = {
  name: "Himitsu",
  tagline: "house of cocktail",
  address: "154 Bis Tran Quang Khai, Tan Dinh Ward, Ho Chi Minh City",
  hours: "17:00 – 02:00",
  zaloPhone: "0363561805", // TODO: điền số Zalo của quán (vd: 0901234567)
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/himistuhouse",
  messenger: "https://m.me/himistuhouse",
  get zalo() { return this.zaloPhone ? `https://zalo.me/${this.zaloPhone}` : "https://zalo.me/"; },
  mapEmbed:
    "https://www.google.com/maps?q=154+Bis+Tran+Quang+Khai,+Tan+Dinh,+Ho+Chi+Minh+City&output=embed",
};

export const T = {
  vi: {
    nav: { story: "Câu chuyện", menu: "Menu", events: "Sự kiện", press: "Báo chí", gallery: "Gallery", contact: "Liên hệ", reserve: "Đặt bàn" },
    open: "Mở cửa mỗi ngày",
    heroTitle: "Bí mật nằm sau cánh cửa",
    heroSub: "Quầy bar cocktail kín đáo giữa lòng Sài Gòn.",
    cta: "Đặt bàn ngay",
    drinksTitle: "Những ly cocktail làm nên Himitsu",
    eventsTitle: "Ưu đãi & sự kiện",
    nightsTitle: "Một lý do để đến mỗi tối",
    storyTitle: "Câu chuyện của Himitsu",
    storyBody: [
      "Himitsu – “bí mật” trong tiếng Nhật – là một quầy bar cocktail nhỏ ẩn mình trong một con hẻm yên tĩnh của Sài Gòn.",
      "Mỗi ly cocktail là một câu chuyện: nguyên liệu địa phương, kỹ thuật tinh tế và sự tiếp đón như ở nhà.",
      "Hãy đến, ngồi xuống và để chúng tôi kể bạn nghe bí mật của đêm nay.",
    ],
    menuTitle: "Menu",
    eventsPage: "Sự kiện",
    pressTitle: "Báo chí nói về Himitsu",
    galleryTitle: "Gallery",
    contactTitle: "Liên hệ",
    showMap: "Xem bản đồ",
    address: "Địa chỉ",
    hours: "Giờ mở cửa",
    reservation: {
      title: "Đặt bàn",
      name: "Họ tên", phone: "Số điện thoại (Zalo)", date: "Ngày", time: "Giờ",
      guests: "Số khách", note: "Ghi chú", submit: "Gửi yêu cầu",
      ok: "Cảm ơn bạn! Yêu cầu đã được ghi nhận.", zaloCta: "Nhắn xác nhận qua Zalo", copy: "Copy", copied: "Đã copy", zaloHint: "Gửi nội dung dưới đây cho quán qua Zalo để được xác nhận nhanh nhất:", msg: (n: string, p: string, d: string, tm: string, g: number, note: string) => `Chào Himitsu, mình là ${n} (SĐT/Zalo ${p}). Mình muốn đặt bàn ${g} khách vào ${tm} ngày ${d}.${note ? ` Ghi chú: ${note}` : ""}`, err: "Có lỗi xảy ra, vui lòng thử lại.",
    },
    follow: "Theo dõi",
    rights: "Bảo lưu mọi quyền.",
  },
  en: {
    nav: { story: "Our Story", menu: "Menu", events: "Events", press: "Press", gallery: "Gallery", contact: "Contact", reserve: "Reserve" },
    open: "Open every day",
    heroTitle: "A secret behind the door",
    heroSub: "A hidden cocktail bar in the heart of Saigon.",
    cta: "Reserve a table",
    drinksTitle: "The drinks that make Himitsu",
    eventsTitle: "Offers & events",
    nightsTitle: "A reason to come every night",
    storyTitle: "Our story",
    storyBody: [
      "Himitsu – “secret” in Japanese – is a small cocktail bar tucked away in a quiet Saigon alley.",
      "Every drink tells a story: local ingredients, refined technique and the warmth of home.",
      "Come in, sit down and let us share tonight’s secret with you.",
    ],
    menuTitle: "Menu",
    eventsPage: "Events",
    pressTitle: "Press about Himitsu",
    galleryTitle: "Gallery",
    contactTitle: "Contact",
    showMap: "Show map",
    address: "Address",
    hours: "Opening hours",
    reservation: {
      title: "Reserve a table",
      name: "Full name", phone: "Phone (Zalo)", date: "Date", time: "Time",
      guests: "Guests", note: "Notes", submit: "Send request",
      ok: "Thank you! Your request is saved.", zaloCta: "Confirm via Zalo", copy: "Copy", copied: "Copied", zaloHint: "Send the message below to us on Zalo for the fastest confirmation:", msg: (n: string, p: string, d: string, tm: string, g: number, note: string) => `Hi Himitsu, this is ${n} (phone/Zalo ${p}). I would like to book a table for ${g} at ${tm} on ${d}.${note ? ` Notes: ${note}` : ""}`, err: "Something went wrong, please try again.",
    },
    follow: "Follow",
    rights: "All rights reserved.",
  },
};

export const MENU = [
  { cat: { vi: "Signature", en: "Signature" }, items: [
    { n: "Himitsu Old Fashioned", d: { vi: "Bourbon, mật ong rang, bitters cam", en: "Bourbon, roasted honey, orange bitters" }, p: "180" },
    { n: "Saigon Garden", d: { vi: "Gin, lá húng, chanh dây, soda", en: "Gin, basil, passion fruit, soda" }, p: "170" },
    { n: "Midnight Matcha", d: { vi: "Rum, matcha, sữa dừa, vani", en: "Rum, matcha, coconut milk, vanilla" }, p: "180" },
    { n: "Smoked Pho", d: { vi: "Whisky khói, hồi, quế, gừng", en: "Smoky whisky, star anise, cinnamon, ginger" }, p: "200" },
  ]},
  { cat: { vi: "Classics", en: "Classics" }, items: [
    { n: "Negroni", d: { vi: "Gin, Campari, vermouth", en: "Gin, Campari, vermouth" }, p: "160" },
    { n: "Espresso Martini", d: { vi: "Vodka, cà phê, kahlúa", en: "Vodka, coffee, kahlúa" }, p: "160" },
    { n: "Margarita", d: { vi: "Tequila, triple sec, chanh", en: "Tequila, triple sec, lime" }, p: "150" },
  ]},
  { cat: { vi: "Không cồn", en: "Zero proof" }, items: [
    { n: "Yuzu Fizz", d: { vi: "Yuzu, mật ong, soda", en: "Yuzu, honey, soda" }, p: "100" },
    { n: "Jasmine Tonic", d: { vi: "Trà lài, tonic, chanh", en: "Jasmine tea, tonic, lime" }, p: "100" },
  ]},
];

export const EVENTS = [
  { t: { vi: "Jazz Night", en: "Jazz Night" }, w: { vi: "Thứ Sáu hàng tuần · 20:00", en: "Every Friday · 20:00" }, d: { vi: "Nhạc jazz sống cùng cocktail theo mùa.", en: "Live jazz with seasonal cocktails." } },
  { t: { vi: "Masterclass cocktail", en: "Cocktail masterclass" }, w: { vi: "Chủ Nhật · 16:00", en: "Sundays · 16:00" }, d: { vi: "Học pha chế cùng bartender của Himitsu.", en: "Learn to mix with our bartenders." } },
  { t: { vi: "Sự kiện riêng", en: "Private events" }, w: { vi: "Theo yêu cầu", en: "On request" }, d: { vi: "Sinh nhật, tiệc công ty, ra mắt sản phẩm.", en: "Birthdays, corporate parties, launches." } },
];

export const PRESS = [
  { s: "Saigoneer", t: { vi: "Những quầy bar ẩn mình đáng ghé ở Sài Gòn", en: "Hidden bars worth finding in Saigon" } },
  { s: "Time Out Vietnam", t: { vi: "Cocktail bar nên thử năm nay", en: "Cocktail bars to try this year" } },
  { s: "Foody", t: { vi: "Himitsu – bí mật giữa phố", en: "Himitsu – a secret in the city" } },
];

// Ảnh thật: thêm vào public/images/ rồi khai báo ở đây { src, alt: {vi,en}, w, h }. Rỗng => hiển thị ô giữ chỗ.
export type GalleryImage = { src: string; w: number; h: number; alt: { vi: string; en: string } };
const P = (n: string, w: number, h: number, vi: string, en: string): GalleryImage => ({ src: `/images/photos/${n}.webp`, w, h, alt: { vi, en } });
export const GALLERY: GalleryImage[] = [
  P("g253", 1400, 933, "Mặt tiền Himitsu về đêm", "Himitsu storefront at night"),
  P("g53", 1202, 1800, "Cocktail whisky trên hộp gỗ", "Whisky cocktail on a wooden box"),
  P("g58", 1202, 1800, "Cocktail matcha với xiên trái cây", "Matcha cocktail with a fruit skewer"),
  P("g155", 1400, 933, "Không gian với tranh Nhật Bản", "Interior with Japanese posters"),
  P("g83", 1202, 1800, "Highball hồng với anh đào", "Pink highball with cherry"),
  P("g71", 1202, 1800, "Cocktail cam kèm bánh dorayaki", "Orange cocktail with dorayaki"),
  P("g147", 1400, 1008, "Quầy rượu sau quầy bar", "The back bar"),
  P("g99", 1202, 1800, "Cocktail khói trong hộp gỗ", "Smoked cocktail in a wooden box"),
  P("g260", 1400, 933, "Khay martini rót tại quầy", "A tray of martinis"),
  P("g115", 1202, 1800, "Cocktail yuzu với khối đá trang trí", "Yuzu cocktail with a decorated ice cube"),
  P("g224", 1400, 933, "Góc phố với ánh đèn vàng", "The street corner with warm lights"),
  P("g124", 1202, 1800, "Khay đồ uống: vang, martini, whisky", "A tray of wine, martini and whisky"),
  P("g158", 1400, 933, "Bàn gỗ và đèn bàn", "Wooden table and lamp"),
  P("g191", 1200, 1800, "Cocktail vàng trong ly coupe", "Golden cocktail in a coupe"),
  P("g268", 1400, 933, "Quầy bar với nến vàng", "Bar counter with candlelight"),
  P("g25", 1202, 1800, "Cocktail matcha bọt mịn", "Matcha cocktail with silky foam"),
  P("g255", 1400, 863, "Cửa sổ phủ cây xanh", "Window framed by greenery"),
  P("g41", 1202, 1800, "Cocktail hồng trong ly martini", "Pink cocktail in a martini glass"),
  P("g142", 1200, 1800, "Biển hiệu himitsu", "The himitsu sign"),
  P("g14", 1202, 1800, "Cocktail cam trong ly vang", "Orange cocktail in a wine glass"),
  P("g263", 1400, 933, "Martini với ô-liu", "Martini with an olive"),
  P("g106", 1202, 1800, "Cầu đá trong hộp gỗ", "Ice sphere in a wooden box"),
];
export const PHOTOS = {
  hero: "/images/photos/hero.webp",
  story1: { src: "/images/photos/story1.webp", w: 1400, h: 937 },
  story2: { src: "/images/photos/story2.webp", w: 1400, h: 933 },
  drinks: ["g53", "g83", "g58", "g99"].map((n) => `/images/photos/${n}.webp`),
  events: ["g260", "g155", "g192"].map((n) => `/images/photos/${n}.webp`),
};
export const GALLERY_PLACEHOLDERS = ["#3b2a1e", "#5a3a2a", "#2a2f3b", "#4a2f3b", "#2f3b2a", "#3b3a2a", "#2a3b3b", "#3b2a3b", "#4a3a1e"];
