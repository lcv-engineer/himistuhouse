// Dữ liệu mặc định của website. Mọi thứ ở đây đều chỉnh được trong trang /admin
// (lưu ở data/content.json, ghi đè lên giá trị mặc định này). File này an toàn để import ở client.
export type Lang = "vi" | "en";
export const LANGS: Lang[] = ["vi", "en"];

export type Bi = { vi: string; en: string };
export type GalleryImage = { src: string; w: number; h: number; alt: Bi };

export type MenuItem = { id: string; name: string; desc: Bi; price: number; tags: string[]; signature: boolean; image: string; visible: boolean };
export type MenuCat = { id: string; slug: string; name: Bi; visible: boolean; items: MenuItem[] };
/** weekday: -1 = mỗi ngày, 0 = Thứ Hai … 6 = Chủ nhật */
export type Promo = { id: string; title: Bi; weekday: number; start: string; end: string; discount: string; label: Bi; desc: Bi; image: string; visible: boolean };
export type EventItem = { id: string; slug: string; title: Bi; date: string; start: string; end: string; price: Bi; desc: Bi; image: string; published: boolean; rsvp: boolean };
export type Highlight = { id: string; title: Bi; desc: Bi; image: string };
/** Mật khẩu bí mật theo tuần; week là ngày Thứ Hai đầu tuần (YYYY-MM-DD). */
export type Secret = { id: string; week: string; password: string; note: string };
/** Giờ mở cửa theo thứ (0 = Thứ Hai). last = giờ nhận khách cuối, cũng là khung giờ đặt bàn cuối. */
export type Hours = { open: string; close: string; last: string; closed: boolean };

export type Content = {
  site: {
    name: string; intro: Bi; address: Bi; directions: Bi; phone: string; email: string;
    handle: string; instagram: string; facebook: string; messenger: string; zalo: string;
    mapsUrl: string; mapEmbed: string; menuPdf: string;
  };
  hours: Hours[];
  menu: MenuCat[];
  promos: Promo[];
  events: EventItem[];
  highlights: Highlight[];
  secrets: Secret[];
  pages: { story: { title: Bi; body: Bi }; policies: { title: Bi; body: Bi } };
  gallery: GalleryImage[];
  photos: { hero: string; door: string; offers: string };
  holidays: { date: string; vi: string; en: string }[];
};

const ph = (n: string) => `/images/photos/${n}.webp`;
const P = (n: string, w: number, h: number, vi: string, en: string): GalleryImage => ({ src: ph(n), w, h, alt: { vi, en } });
const same = (s: string): Bi => ({ vi: s, en: s });

let seq = 0;
const item = (name: string, desc: string, price: number, extra: Partial<MenuItem> = {}): MenuItem => ({
  id: `i${++seq}`, name, desc: same(desc), price, tags: [], signature: false, image: "", visible: true, ...extra,
});
const light = { tags: ["Light"] };
const H = (closed = false): Hours => ({ open: "17:00", close: "01:00", last: "23:00", closed });

export const DEFAULTS: Content = {
  site: {
    name: "Himitsu",
    intro: { vi: "Chúng tôi pha cocktail thật ngon và trò chuyện cùng mọi người.", en: "We make really good cocktails & talk to people." },
    address: {
      vi: "154 Bis Trần Quang Khải, Phường Tân Định (Quận 1 cũ), TP. Hồ Chí Minh",
      en: "154 Bis Tran Quang Khai, Tan Dinh Ward (former District 1), Ho Chi Minh City",
    },
    directions: { vi: "Tìm biển “himitsu” thẳng đứng có đèn sáng ở mặt tiền.", en: "Look for the lit vertical “himitsu” sign at the front." },
    phone: "096 318 14 79",
    email: "bar.himitsu@gmail.com",
    handle: "himitsu__house",
    instagram: "https://www.instagram.com/himitsu__house/",
    facebook: "https://www.facebook.com/himistuhouse",
    messenger: "https://m.me/himistuhouse",
    zalo: "https://zalo.me/0363561805",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Himitsu+House+154+Bis+Tr%E1%BA%A7n+Quang+Kh%E1%BA%A3i+T%C3%A2n+%C4%90%E1%BB%8Bnh",
    mapEmbed: "",
    menuPdf: "",
  },
  hours: [H(), H(), H(), H(), H(), H(), H()],
  // Món đọc được từ video bản cũ (14/10). Vang, Sake chưa có món; Rượu mạnh, Không cồn, Đồ ăn lấy từ menu góp ý 23.10.
  menu: [
    { id: "c1", slug: "aperitif", name: same("Aperitif"), visible: true, items: [
      item("Kyoho Zen Fizz", "Gin · Kyoho · Tantakatan shiso · Greek yogurt · Indian tonic", 290, light),
      item("Shibuya Heat", "Genmaicha tea-infused whisky · Red bean · Rosso vermouth · Red miso · CO2", 290),
      item("Gin Tonic", "Gin · Lime wedge · Tonic", 250, light),
      item("Chu-High", "Shochu · Lime wedge · Soda", 250, light),
      item("Umeshu Shiso Sonic", "Tantakatan shiso · Lime wedge · Sonic", 250, light),
      item("Spumoni", "Campari · Grapefruit · Tonic water", 250, light),
      item("Cuba Libre", "Rum · Lime wedge · Coke", 250, light),
      item("Whisky Highball", "Whisky · Soda", 250, light),
    ]},
    { id: "c2", slug: "all-night", name: same("All Night"), visible: true, items: [
      item("Zen Leaf Sour", "Pandan-infused Japanese whisky · Matcha · Agave · Coconut whey", 290, { signature: true, image: ph("g58") }),
      item("Koyo Boulevard", "Whisky · Umeshu amaro · House rosso vermouth · Rhubarb bitters", 290, { signature: true, image: ph("g53") }),
      item("Lychee Martini", "Gin · House vodka · House blanc vermouth · Lychee", 260),
      item("Tropic Thunder", "Gin · Apricot · Pineapple · Lemon", 260),
      item("Twentieth Century", "Gin · House blanc vermouth · Cacao white · Lemon · Orange bitter", 260),
      item("Paradise", "Gin · Apricot · Orange · Lemon", 260),
      item("Banana Calling", "Gin · Banana · Fino sherry · Lemon", 260),
      item("Aviation", "Gin · Violet · Luxardo maraschino · Lemon", 260),
      item("Hemingway Daiquiri", "Rum · Grapefruit · Lime · Luxardo maraschino", 260),
      item("Tommy’s Margarita", "Tequila · Agave syrup · Lime", 260),
    ]},
    { id: "c3", slug: "after", name: same("After"), visible: true, items: [
      item("Pink Squirrel", "Crème de noyaux · Crème de cacao · Cream", 260),
      item("Golden Cadillac", "Galliano · Crème de cacao · Cream", 260),
    ]},
    { id: "c4", slug: "wine", name: { vi: "Vang", en: "Wine" }, visible: true, items: [] },
    { id: "c5", slug: "sake", name: same("Sake"), visible: true, items: [] },
    { id: "c6", slug: "spirits", name: { vi: "Rượu mạnh & Shots", en: "Spirits & Shots" }, visible: true, items: [
      item("Absolut", "Vodka", 250),
      item("Tito’s", "Vodka", 300),
    ]},
    { id: "c7", slug: "zero-alc", name: { vi: "Không cồn", en: "Zero-alc" }, visible: true, items: [
      item("Hugo Spritz (Cantine Sgarzi Luigi)", "Elderflower · Citrus · Mint", 200),
      item("Coco · Cha", "Coconut · Yuzu · Matcha creamy", 200),
      item("Midori Fizz", "Grape · Miso · Melon CO2", 200),
      item("San Pellegrino (sparkling)", "Italy", 90),
      item("Acqua Panna (still)", "Italy", 90),
    ]},
    { id: "c8", slug: "food", name: { vi: "Đồ ăn", en: "Bar Bites" }, visible: true, items: [
      item("Charcuterie platter", "Ham · Mortadella · Salami · Olives · Brie · Apricots", 300),
      item("Tipsy Bites", "Mixed olives · Sunrise tomato · Smoked paprika", 120),
      item("Salt & Smoke", "Cured meat · Mixed olives · Sunrise tomato · Smoked paprika", 160),
      item("Sweet & Salt", "Prosciutto · Mango · Basil · Balsamic", 160),
      item("Housemade raisin butter", "Raisin · Plum · Walnut · Dried cranberry · Cream cheese · Butter", 180),
    ]},
  ],
  promos: [
    { id: "p1", title: same("Happy Hour"), weekday: -1, start: "17:00", end: "20:00", discount: "−50%", label: { vi: "Tất cả đồ uống", en: "All drinks" },
      desc: { vi: "5PM – 8PM mỗi ngày: giảm 50% tất cả đồ uống.", en: "5PM – 8PM every day: 50% off all drinks." }, image: ph("g268"), visible: true },
    { id: "p2", title: { vi: "Thứ Hai · Aperitif", en: "Monday · Aperitif" }, weekday: 0, start: "20:00", end: "01:00", discount: "−30%", label: same("Aperitif"), desc: same(""), image: ph("g14"), visible: true },
    { id: "p3", title: { vi: "Thứ Ba · All Night", en: "Tuesday · All Night" }, weekday: 1, start: "20:00", end: "01:00", discount: "−30%", label: same("All Night"), desc: same(""), image: ph("cherry-martini"), visible: true },
    { id: "p4", title: { vi: "Thứ Tư · After", en: "Wednesday · After" }, weekday: 2, start: "20:00", end: "01:00", discount: "−30%", label: same("After"), desc: same(""), image: ph("red-highball"), visible: true },
    { id: "p5", title: { vi: "Thứ Năm · Theo ly", en: "Thursday · By Glass" }, weekday: 3, start: "20:00", end: "01:00", discount: "−30%", label: { vi: "Theo ly", en: "By Glass" }, desc: same(""), image: ph("g124"), visible: true },
  ],
  events: [
    { id: "e1", slug: "dem-tarot-16-10", title: { vi: "Trải bài Tarot miễn phí", en: "Free Tarot reading night" }, date: "2026-10-16", start: "20:00", end: "23:00",
      price: { vi: "Miễn phí", en: "Free" }, desc: { vi: "Một ly cocktail, một lá bài, một câu chuyện. Trải bài Tarot miễn phí cho khách ngồi quầy.", en: "A cocktail, a card, a story. Free Tarot readings for guests at the bar." },
      image: ph("front-tarot"), published: true, rsvp: true },
    { id: "e2", slug: "dem-tarot-09-10", title: { vi: "Trải bài Tarot miễn phí", en: "Free Tarot reading night" }, date: "2026-10-09", start: "20:00", end: "23:00",
      price: { vi: "Miễn phí", en: "Free" }, desc: { vi: "Một ly cocktail, một lá bài, một câu chuyện.", en: "A cocktail, a card, a story." },
      image: ph("bar-green-chairs"), published: true, rsvp: false },
  ],
  highlights: [
    { id: "h1", title: same("Midnight Drinker"), desc: { vi: "Một đêm muộn với oden nóng và xiên que bên quầy, cùng một ly thật ngon.", en: "A late night of hot oden and skewers at the bar, with one very good drink." }, image: ph("midnight") },
    { id: "h2", title: { vi: "Valentine & 8/3", en: "Valentine’s & March 8th" }, desc: { vi: "Menu theo mùa với những ly đỏ thẫm cài dâu hình trái tim, dành cho hai dịp này.", en: "A seasonal menu of deep-red drinks with strawberry hearts, made for the two occasions." }, image: ph("valentine") },
    { id: "h3", title: { vi: "Giáng sinh", en: "Christmas" }, desc: { vi: "Mặt tiền quấn đèn và nơ đỏ, ánh sáng ấm hắt qua ô cửa.", en: "The front wrapped in fairy lights and red bows, warm light through the windows." }, image: ph("christmas-front") },
  ],
  secrets: [],
  pages: {
    story: {
      title: { vi: "Câu chuyện Himitsu", en: "The Himitsu story" },
      body: {
        vi: "Himitsu (秘密) nghĩa là *bí mật*.\n\nẨn mình giữa những con phố nhộn nhịp của Sài Gòn, Himitsu House là nơi của những cuộc trò chuyện chậm rãi và những ly cocktail được chăm chút, lấy cảm hứng từ sự tối giản Nhật Bản: ánh sáng thấp, riêng tư, tinh tế.\n\n> Một nơi để gặp gỡ. Một nơi để thư giãn. Và đôi khi, là một nơi để tạm trốn khỏi thành phố ngoài kia.",
        en: "Himitsu (秘密) means *secret*.\n\nHidden among the busy streets of Saigon, Himitsu House is a place for slow conversations and carefully made cocktails, inspired by Japanese minimalism: low light, privacy, quiet detail.\n\n> A place to meet. A place to unwind. And sometimes, a place to briefly escape the city outside.",
      },
    },
    policies: {
      title: { vi: "Chính sách", en: "Policies" },
      body: {
        vi: "## Đặt bàn\n\nChúng tôi giữ bàn trong 30 phút sau giờ đặt. Nếu đến muộn hơn hoặc muốn huỷ, vui lòng huỷ bằng mã đặt bàn hoặc gọi 096 318 14 79.\n\n## Độ tuổi\n\nHimitsu chỉ phục vụ đồ uống có cồn cho khách từ 18 tuổi trở lên. Vui lòng mang theo giấy tờ tuỳ thân.\n\n## Giá\n\nGiá menu tính theo nghìn đồng (k), chưa bao gồm thuế và phí dịch vụ.",
        en: "## Reservations\n\nWe hold your table for 30 minutes after your booking time. If you will be later or need to cancel, please cancel with your booking code or call 096 318 14 79.\n\n## Age\n\nHimitsu only serves alcohol to guests aged 18 and over. Please bring an ID.\n\n## Prices\n\nMenu prices are in thousand VND (k) and do not include tax and service charge.",
      },
    },
  },
  gallery: [
    P("front-tarot", 1800, 1188, "Mặt tiền Himitsu", "The Himitsu front"),
    P("g53", 1200, 1800, "Koyo Boulevard", "Koyo Boulevard"),
    P("martini-tray", 1800, 1240, "Khay martini", "A tray of martinis"),
    P("g58", 1200, 1800, "Zen Leaf Sour", "Zen Leaf Sour"),
    P("bartender-stir", 1800, 1200, "Bartender khuấy cocktail", "Bartender stirring a drink"),
    P("valentine-top", 1800, 1200, "Cocktail dâu hình tim", "A strawberry-heart cocktail"),
    P("cherry-martini", 1800, 1200, "Martini cherry", "A cherry martini"),
    P("japan-posters", 1800, 1204, "Góc tranh Nhật trên tầng", "The upstairs room"),
    P("valentine", 1200, 1800, "Ly đỏ cài dâu", "A deep-red drink with a strawberry heart"),
    P("bar-green-chairs", 1800, 1200, "Quầy bar và ghế xanh", "The bar and green chairs"),
    P("red-highball", 1200, 1800, "Highball đỏ", "A red highball"),
    P("m233", 1400, 933, "Bartender tại quầy", "Bartender at the bar"),
    P("g99", 1200, 1800, "Ly cocktail trong hộp gỗ", "A drink in a wooden box"),
    P("christmas-front", 1200, 1800, "Mặt tiền mùa Giáng sinh", "The front at Christmas"),
    P("m145", 1400, 933, "Quầy bar đông khách", "A busy bar"),
    P("g115", 1200, 1800, "Cocktail trên quầy gỗ", "A cocktail on the wooden bar"),
    P("door-window", 1800, 1222, "Ô cửa có đèn", "The lit window"),
    P("g71", 1200, 1800, "Cocktail viền đường", "A sugar-rimmed cocktail"),
    P("m168", 1400, 933, "Không gian quầy bar", "Bar atmosphere"),
    P("m150", 1196, 1800, "Khách bên cửa sổ", "A guest by the window"),
    P("g142", 1200, 1800, "Biển himitsu", "The himitsu sign"),
  ],
  photos: { hero: ph("hero-garnish"), door: ph("door-window"), offers: ph("front-lights") },
  // Ngày lễ: chỉ hiện chú thích nhỏ khi khách chọn ngày đặt bàn.
  holidays: [
    { date: "2026-12-24", vi: "Đêm Giáng sinh", en: "Christmas Eve" },
    { date: "2026-12-25", vi: "Giáng sinh", en: "Christmas Day" },
    { date: "2026-12-31", vi: "Đêm giao thừa Dương lịch", en: "New Year’s Eve" },
    { date: "2027-01-01", vi: "Tết Dương lịch", en: "New Year’s Day" },
    { date: "2027-02-06", vi: "Mùng 1 Tết Nguyên đán", en: "Lunar New Year’s Day" },
    { date: "2027-02-14", vi: "Valentine", en: "Valentine’s Day" },
    { date: "2027-03-08", vi: "Quốc tế Phụ nữ", en: "International Women’s Day" },
  ],
};

/** Happy Hour = ưu đãi “mỗi ngày” đầu tiên đang bật trong mục Ưu đãi. */
export const happyHourOf = (c: Content) => c.promos.find((p) => p.visible && p.weekday === -1);

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
export const mapSrc = (site: Content["site"]) =>
  site.mapEmbed || `https://www.google.com/maps?q=${encodeURIComponent("Himitsu House, " + site.address.en)}&output=embed`;
