export type Lang = "vi" | "en";
export const LANGS: Lang[] = ["vi", "en"];

export const SITE = {
  name: "Himitsu",
  tagline: "house of cocktail",
  address: "154 Bis Tran Quang Khai, Tan Dinh Ward, Ho Chi Minh City",
  hours: "17:00 – 02:00",
  email: "bar.himitsu@gmail.com",
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
  messenger: "https://m.me/",
  zalo: "https://zalo.me/",
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
      name: "Họ tên", phone: "Số điện thoại", email: "Email", date: "Ngày", time: "Giờ",
      guests: "Số khách", note: "Ghi chú", submit: "Gửi yêu cầu",
      ok: "Cảm ơn bạn! Chúng tôi sẽ liên hệ xác nhận sớm.", err: "Có lỗi xảy ra, vui lòng thử lại.",
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
      name: "Full name", phone: "Phone", email: "Email", date: "Date", time: "Time",
      guests: "Guests", note: "Notes", submit: "Send request",
      ok: "Thank you! We will confirm shortly.", err: "Something went wrong, please try again.",
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

export const GALLERY = ["#3b2a1e", "#5a3a2a", "#2a2f3b", "#4a2f3b", "#2f3b2a", "#3b3a2a", "#2a3b3b", "#3b2a3b", "#4a3a1e"];
