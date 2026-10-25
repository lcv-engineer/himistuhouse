// Dữ liệu mặc định của website. Mọi thứ ở đây đều chỉnh được trong trang /admin
// (lưu ở data/content.json, ghi đè lên giá trị mặc định này). File này an toàn để import ở client.
export type Lang = "vi" | "en";
export const LANGS: Lang[] = ["vi", "en"];

type Bi = { vi: string; en: string };
export type GalleryImage = { src: string; w: number; h: number; alt: Bi };

export type Texts = {
  nav: { story: string; menu: string; events: string; gallery: string; contact: string; reserve: string };
  open: string; heroTitle: string; heroSub: string; cta: string; orCall: string; menuNote: string; hotline: string;
  drinksTitle: string; eventsTitle: string; nightsTitle: string;
  storyTitle: string; storyBody: string[];
  menuTitle: string; eventsPage: string; galleryTitle: string; contactTitle: string;
  showMap: string; address: string; hours: string; follow: string; rights: string;
  reservation: {
    title: string; name: string; phone: string; date: string; time: string; guests: string; note: string; submit: string;
    ok: string; zaloCta: string; copy: string; copied: string; zaloHint: string; err: string; holdNote: string;
    mapTitle: string; mapHint: string; floor1: string; floor2: string; mapSelected: string; mapNone: string; mapClear: string; mapTaken: string; mapTakenErr: string; mapLegendFree: string; mapLegendPick: string; mapLegendTaken: string;
    msgTpl: string; noteTpl: string;
  };
  /** Các dòng chữ còn lại (trang chủ, sự kiện, liên hệ, private hire, đặt bàn, trang xác nhận). */
  x: Record<string, string>;
};

export type Content = {
  site: {
    name: string; tagline: string; address: string; hours: string; lastOrder: string; hotline: string; zaloPhone: string; handle: string;
    instagram: string; facebook: string; messenger: string; mapEmbed: string;
  };
  t: Record<Lang, Texts>;
  menu: { cat: Bi; items: { n: string; d: Bi; p: string }[] }[];
  events: { t: Bi; w: Bi; d: Bi }[];
  moments: { title: Bi; images: GalleryImage[] }[];
  holidays: { date: string; vi: string; en: string }[];
  photos: { hero: string; story1: string; story2: string; door: string; drinks: string[]; events: string[] };
};

const P = (n: string, w: number, h: number, vi: string, en: string): GalleryImage => ({ src: `/images/photos/${n}.webp`, w, h, alt: { vi, en } });
const ph = (n: string) => `/images/photos/${n}.webp`;
const same = (s: string): Bi => ({ vi: s, en: s });

export const DEFAULTS: Content = {
  site: {
    name: "Himitsu",
    tagline: "house of cocktail",
    address: "154 Bis Tran Quang Khai, Tan Dinh Ward, Ho Chi Minh City",
    hours: "5PM – 1AM",
    lastOrder: "00:30",
    hotline: "096 318 14 79",
    zaloPhone: "0363561805",
    handle: "@himitsu__house",
    instagram: "https://www.instagram.com/himitsu__house/",
    facebook: "https://www.facebook.com/himistuhouse",
    messenger: "https://m.me/himistuhouse",
    mapEmbed: "",
  },
  t: {
    vi: {
      nav: { story: "Câu chuyện", menu: "Menu", events: "Sự kiện", gallery: "Khoảnh khắc", contact: "Liên hệ", reserve: "Đặt bàn" },
      open: "Mỗi ngày, Himitsu mở cửa lúc 5PM",
      orCall: "hoặc gọi",
      hotline: "Hotline",
      menuNote: "Giá menu tính theo ’000 VND – Chưa bao gồm thuế và phí dịch vụ",
      heroTitle: "Bí mật nằm sau cánh cửa",
      heroSub: "Quầy bar cocktail kín đáo giữa lòng Sài Gòn.",
      cta: "Đặt bàn",
      drinksTitle: "Signature",
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
      galleryTitle: "Khoảnh khắc",
      contactTitle: "Liên hệ",
      showMap: "Xem bản đồ",
      address: "Địa chỉ",
      hours: "Giờ mở cửa",
      follow: "Theo dõi",
      rights: "Bảo lưu mọi quyền.",
      reservation: {
        title: "Đặt bàn",
        name: "Họ tên", phone: "Số điện thoại (Zalo)", date: "Ngày", time: "Giờ",
        guests: "Số khách", note: "Ghi chú", submit: "Gửi yêu cầu",
        ok: "Cảm ơn bạn! Yêu cầu đã được ghi nhận.", zaloCta: "Nhắn xác nhận qua Zalo", copy: "Copy", copied: "Đã copy",
        zaloHint: "Gửi nội dung dưới đây cho quán qua Zalo để được xác nhận nhanh nhất:",
        msgTpl: "Chào Himitsu, mình là {name} (SĐT/Zalo {phone}). Mình muốn đặt bàn {guests} khách vào {time} ngày {date}.{note}",
        noteTpl: " Ghi chú: {note}",
        err: "Có lỗi xảy ra, vui lòng thử lại.",
        holdNote: "Chúng tôi sẽ giữ bàn trong vòng 30 phút sau thời gian đặt. Nếu có thay đổi, vui lòng gọi hotline {hotline}.",
        mapTitle: "Khu vực quán – chọn vị trí ngồi (không bắt buộc)",
        mapHint: "Bấm vào chỗ ngồi trên sơ đồ để chọn. Chọn ngày và giờ trước để xem chỗ nào đã có khách.",
        floor1: "Tầng 1", floor2: "Tầng 2",
        mapSelected: "Đã chọn", mapNone: "Chưa chọn vị trí (quán sẽ xếp giúp bạn)", mapClear: "Bỏ chọn",
        mapTaken: "đã có khách", mapTakenErr: "Một số chỗ bạn chọn vừa có người đặt, vui lòng chọn lại.",
        mapLegendFree: "Còn trống", mapLegendPick: "Bạn chọn", mapLegendTaken: "Đã có khách",
      },
      x: {
        seeMenu: "Xem menu",
        signatureSub: "Những ly cocktail làm nên Himitsu.",
        tonightTitle: "Hẹn gặp bạn tối nay.",
        tonightSub: "Giữ một chỗ ở quầy bar hoặc một góc yên tĩnh.",
        doorTitle: "Cánh cửa mở mỗi đêm.",
        findDoorTitle: "Tìm cánh cửa",
        findDoorText: "Hãy tìm biển “himitsu” thẳng đứng có đèn sáng ở mặt tiền.",
        eventsHeading: "Những đêm nhỏ tại Himitsu",
        eventsEmpty: "Chưa có sự kiện mới. Theo dõi {handle} để không bỏ lỡ sự kiện tiếp theo.",
        everyWeek: "Mỗi tuần",
        phTag: "Thuê riêng",
        phTitle: "Cả quầy bar, chỉ dành cho bạn",
        phBody: "Sinh nhật, họp mặt, ra mắt sản phẩm: chúng tôi dọn không gian, lên menu riêng và giữ chỗ cho nhóm của bạn.",
        phCta: "Hỏi về thuê riêng",
        phName: "Họ tên", phPhone: "Số điện thoại (Zalo)", phDate: "Ngày dự kiến", phGuests: "Số khách", phType: "Loại sự kiện (sinh nhật, họp mặt…)",
        phNote: "Ghi chú", phSubmit: "Gửi yêu cầu", phOk: "Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm.", phErr: "Có lỗi xảy ra, vui lòng thử lại.", phClose: "Đóng",
        rvDateTitle: "Chọn ngày", rvPickAnother: "Chọn ngày khác", rvTimeTitle: "Chọn giờ", rvGuestsTitle: "Số khách",
        rvLegendHH: "HH = trong Happy Hour", rvLegendLO: "L.O = last order (gọi món cuối)", rvHoliday: "Ngày lễ", rvPickTime: "Vui lòng chọn giờ.",
        bkTitle: "Đặt bàn của bạn", bkReceived: "Đã nhận", bkConfirmed: "Đã xác nhận", bkCancelled: "Đã huỷ",
        bkWhen: "Thời gian", bkGuests: "Số khách", bkName: "Tên", bkSeat: "Chỗ ngồi", bkSeatAny: "Quán sẽ xếp",
        bkCancel: "Huỷ đặt bàn", bkCancelAsk: "Bạn chắc chắn muốn huỷ đặt bàn này?", bkNotFound: "Không tìm thấy đặt bàn.", bkLoading: "Đang tải…",
        bkNewBooking: "Đặt bàn mới",
      },
    },
    en: {
      nav: { story: "Our Story", menu: "Menu", events: "Events", gallery: "Moments", contact: "Contact", reserve: "Reserve" },
      open: "Everyday, Himitsu open at 5PM",
      orCall: "or call",
      hotline: "Hotline",
      menuNote: "Menu price is in ’000 VND – Tax and service charges are not included",
      heroTitle: "A secret behind the door",
      heroSub: "A hidden cocktail bar in the heart of Saigon.",
      cta: "Reserve",
      drinksTitle: "Signature",
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
      galleryTitle: "Moments",
      contactTitle: "Contact",
      showMap: "Show map",
      address: "Address",
      hours: "Opening hours",
      follow: "Follow",
      rights: "All rights reserved.",
      reservation: {
        title: "Reserve a table",
        name: "Full name", phone: "Phone (Zalo)", date: "Date", time: "Time",
        guests: "Guests", note: "Notes", submit: "Send request",
        ok: "Thank you! Your request is saved.", zaloCta: "Confirm via Zalo", copy: "Copy", copied: "Copied",
        zaloHint: "Send the message below to us on Zalo for the fastest confirmation:",
        msgTpl: "Hi Himitsu, this is {name} (phone/Zalo {phone}). I would like to book a table for {guests} at {time} on {date}.{note}",
        noteTpl: " Notes: {note}",
        err: "Something went wrong, please try again.",
        holdNote: "We will hold your table for 30 minutes after your booking time. If anything changes, please call our hotline {hotline}.",
        mapTitle: "Venue area – choose your seat (optional)",
        mapHint: "Tap a seat on the map to select it. Pick a date and time first to see which seats are already taken.",
        floor1: "Ground floor", floor2: "Upper floor",
        mapSelected: "Selected", mapNone: "No seat chosen (we will seat you)", mapClear: "Clear",
        mapTaken: "taken", mapTakenErr: "Some seats you picked were just taken, please choose again.",
        mapLegendFree: "Available", mapLegendPick: "Your pick", mapLegendTaken: "Taken",
      },
      x: {
        seeMenu: "See the menu",
        signatureSub: "The drinks that make Himitsu.",
        tonightTitle: "See you tonight.",
        tonightSub: "Save a seat at the bar or a quiet corner.",
        doorTitle: "The door is open every night.",
        findDoorTitle: "Finding the door",
        findDoorText: "Look for the lit vertical “himitsu” sign at the front.",
        eventsHeading: "Small nights at Himitsu",
        eventsEmpty: "No new events yet. Follow {handle} so you don’t miss the next one.",
        everyWeek: "Every week",
        phTag: "Private hire",
        phTitle: "The whole bar, just for you",
        phBody: "Birthdays, get-togethers, launches: we set the room, make a menu for you and keep the space for your group.",
        phCta: "Ask about private hire",
        phName: "Full name", phPhone: "Phone (Zalo)", phDate: "Preferred date", phGuests: "Guests", phType: "Type of event (birthday, get-together…)",
        phNote: "Notes", phSubmit: "Send request", phOk: "Thank you! We will get back to you shortly.", phErr: "Something went wrong, please try again.", phClose: "Close",
        rvDateTitle: "Pick a date", rvPickAnother: "Pick another date", rvTimeTitle: "Time", rvGuestsTitle: "Guests",
        rvLegendHH: "HH = during Happy Hour", rvLegendLO: "L.O = last order", rvHoliday: "Holiday", rvPickTime: "Please choose a time.",
        bkTitle: "Your reservation", bkReceived: "Received", bkConfirmed: "Confirmed", bkCancelled: "Cancelled",
        bkWhen: "When", bkGuests: "Guests", bkName: "Name", bkSeat: "Seat", bkSeatAny: "We will seat you",
        bkCancel: "Cancel reservation", bkCancelAsk: "Are you sure you want to cancel this reservation?", bkNotFound: "Reservation not found.", bkLoading: "Loading…",
        bkNewBooking: "New reservation",
      },
    },
  },
  // Menu lấy từ ảnh chụp bản cũ (file CHỈNH SỬA WEBSITE 23.10). Mô tả một số món bị cắt trong ảnh nên cần xác nhận lại.
  menu: [
    { cat: same("Signature"), items: [
      { n: "Zen Leaf Sour", d: same("Pandan-infused Japanese whisky · Matcha · Agave · Coconut"), p: "290" },
      { n: "Koyo Boulevard", d: same("Whisky · Umeshu amaro · House rosso vermouth · Rhubarb bitters"), p: "290" },
    ]},
    { cat: same("Aperitif"), items: [
      { n: "Kyoho Zen Fizz", d: same("Gin · Kyoho · Tantakatan shiso · Greek yogurt"), p: "290" },
      { n: "Shibuya Heat", d: same("Genmaicha tea-infused whisky · Red bean · Rosso vermouth"), p: "290" },
      { n: "Gin Tonic", d: same("Gin · Lime wedge · Tonic"), p: "250" },
      { n: "Chu-High", d: same(""), p: "250" },
    ]},
    { cat: same("Vodka"), items: [
      { n: "Absolut", d: same(""), p: "250" },
      { n: "Tito’s", d: same(""), p: "300" },
    ]},
    { cat: { vi: "Không cồn", en: "Zero-alc" }, items: [
      { n: "Hugo Spritz (Cantine Sgarzi Luigi)", d: same("Elderflower · Citrus · Mint"), p: "200" },
      { n: "Coco · Cha", d: same("Coconut · Yuzu · Matcha creamy"), p: "200" },
      { n: "Midori Fizz", d: same("Grape · Miso · Melon CO2"), p: "200" },
      { n: "San Pellegrino (sparkling)", d: same("Italy"), p: "90" },
      { n: "Acqua Panna (still)", d: same("Italy"), p: "90" },
    ]},
    { cat: same("Bar Bites"), items: [
      { n: "Charcuterie platter", d: same("Ham · Mortadella · Salami · Olives · Brie · Elemental · Apricots"), p: "300" },
      { n: "Tipsy Bites", d: same("Mixed olives · Sunrise tomato · Smoked paprika"), p: "120" },
      { n: "Salt & Smoke", d: same("Cured meat · Mixed olives · Sunrise tomato · Smoked paprika"), p: "160" },
      { n: "Sweet & Salt", d: same("Prosciutto · Mango · Basil · Balsamic"), p: "160" },
      { n: "Housemade raisin butter", d: same("Raisin · Plum · Walnut · Dried cranberry · Cream cheese · Butter"), p: "180" },
    ]},
  ],
  // Ưu đãi lấy từ ảnh bản cũ: Happy Hour −50% 5–8PM mỗi ngày, thứ Hai −30% Aperitif, thứ Năm −30% rượu ly.
  events: [
    { t: { vi: "Happy Hour −50%", en: "Happy Hour −50%" }, w: { vi: "5PM–8PM mỗi ngày", en: "5PM–8PM every day" }, d: { vi: "Giảm 50% tất cả đồ uống.", en: "50% off all drinks." } },
    { t: { vi: "Thứ Hai −30% Aperitif", en: "Monday −30% Aperitif" }, w: { vi: "Mỗi tuần", en: "Every week" }, d: { vi: "Giảm 30% các món Aperitif.", en: "30% off Aperitif." } },
    { t: { vi: "Thứ Năm −30% rượu ly", en: "Thursday −30% By Glass" }, w: { vi: "Mỗi tuần", en: "Every week" }, d: { vi: "Giảm 30% rượu vang và sake bán theo ly.", en: "30% off wine and sake by the glass." } },
  ],
  moments: [
    { title: { vi: "Bartender khách mời", en: "Guest bartender" }, images: [
      P("m171", 1400, 933, "Bartender lắc cocktail", "Bartender shaking a cocktail"),
      P("m174", 1400, 933, "Bartender rót cocktail", "Bartender straining a cocktail"),
      P("m233", 1400, 933, "Bartender tại quầy", "Bartender at the bar"),
      P("m246", 1400, 933, "Bartender làm việc", "Bartender at work"),
      P("m247", 1200, 1800, "Bartender lắc shaker", "Bartender with a shaker"),
      P("m249", 1259, 1800, "Bartender sau quầy", "Behind the bar"),
    ]},
    { title: { vi: "Sự kiện", en: "Event" }, images: [
      P("m134", 1400, 933, "Khách tại quầy bar", "Guests at the bar"),
      P("m145", 1400, 933, "Quầy bar đông khách", "A busy bar"),
      P("m183", 1400, 933, "Không gian quán có khách", "The bar with guests"),
      P("m219", 1400, 933, "Một đêm tại Himitsu", "A night at Himitsu"),
      P("m275", 1400, 933, "Khách nhìn từ tầng 2", "Guests seen from above"),
      P("m276", 1400, 964, "Quầy bar nhìn từ tầng 2", "The bar from upstairs"),
    ]},
    { title: { vi: "Giải trí", en: "Entertainment" }, images: [
      P("m135", 1400, 965, "Khay martini", "A tray of martinis"),
      P("m259", 1400, 977, "Rót martini", "Pouring martinis"),
      P("m262", 1200, 1800, "Martini ô-liu", "Olive martinis"),
      P("m264", 1200, 1800, "Ly martini", "A martini glass"),
      P("m168", 1400, 933, "Không gian quầy bar", "Bar atmosphere"),
      P("m150", 1196, 1800, "Khách bên cửa sổ", "A guest by the window"),
    ]},
  ],
  // Ngày lễ được làm nổi bật trong lịch đặt bàn. Chỉnh trong admin (tab Ngày lễ).
  holidays: [
    { date: "2026-12-24", vi: "Đêm Giáng sinh", en: "Christmas Eve" },
    { date: "2026-12-25", vi: "Giáng sinh", en: "Christmas Day" },
    { date: "2026-12-31", vi: "Đêm giao thừa Dương lịch", en: "New Year’s Eve" },
    { date: "2027-01-01", vi: "Tết Dương lịch", en: "New Year’s Day" },
    { date: "2027-02-06", vi: "Mùng 1 Tết Nguyên đán", en: "Lunar New Year’s Day" },
    { date: "2027-02-14", vi: "Valentine", en: "Valentine’s Day" },
    { date: "2027-03-08", vi: "Quốc tế Phụ nữ", en: "International Women’s Day" },
  ],
  photos: {
    hero: ph("hero"),
    story1: ph("story1"),
    story2: ph("story2"),
    door: ph("g142"),
    drinks: ["g58", "g53"].map(ph),
    events: ["g192", "g14", "g263"].map(ph),
  },
};

export const zaloUrl = (site: Content["site"]) => (site.zaloPhone ? `https://zalo.me/${site.zaloPhone.replace(/\s+/g, "")}` : "https://zalo.me/");
export const telHref = (site: Content["site"]) => `tel:${site.hotline.replace(/[^\d+]/g, "")}`;
export const mapSrc = (site: Content["site"]) =>
  site.mapEmbed || `https://www.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`;
