// Icon nét mảnh một màu (theo màu chữ), giống bản cũ.
type P = { className?: string };
const S = ({ className = "w-5 h-5", children }: P & { children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

export const InstagramIcon = (p: P) => <S {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="4.5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".6" fill="currentColor" /></S>;
export const FacebookIcon = (p: P) => <S {...p}><path d="M14.5 8.5h2V5h-2.6C11.6 5 10.5 6.6 10.5 8.9V11H8v3.3h2.5V21h3.3v-6.7h2.4l.4-3.3h-2.8V9.3c0-.5.3-.8.7-.8Z" /></S>;
export const MessengerIcon = (p: P) => <S {...p}><path d="M12 3.5c-4.7 0-8.5 3.5-8.5 7.9 0 2.4 1.1 4.6 3 6.1v3l2.8-1.5c.9.2 1.8.3 2.7.3 4.7 0 8.5-3.5 8.5-7.9S16.7 3.5 12 3.5Z" /><path d="m7.5 13.5 3-3.2 2 2 3-2.3-3 3.3-2-2-3 2.2Z" /></S>;
export const ZaloIcon = (p: P) => <S {...p}><rect x="3.5" y="4.5" width="17" height="14" rx="4" /><path d="M7 18.5 6 21l3-2.5" /><text x="12" y="13.8" fontSize="5.6" fontWeight="700" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="Arial, sans-serif">Zalo</text></S>;
export const TelegramIcon = (p: P) => <S {...p}><path d="M20.5 4.5 3.5 11l5.2 1.9 1.9 5.6 2.7-3.3 4.2 3.1 3-13.8Z" /><path d="m8.7 12.9 8.6-5.6-6.7 7.7" /></S>;
export const CalendarIcon = (p: P) => <S {...p}><rect x="4" y="5" width="16" height="15" rx="1.5" /><path d="M4 9.5h16M8.5 3v4M15.5 3v4" /></S>;
export const PinIcon = (p: P) => <S {...p}><path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.3" /></S>;
export const CloseIcon = (p: P) => <S {...p}><path d="M6 6l12 12M18 6 6 18" /></S>;
export const PlusIcon = (p: P) => <S {...p}><path d="M12 5v14M5 12h14" /></S>;
export const MinusIcon = (p: P) => <S {...p}><path d="M5 12h14" /></S>;
export const PencilIcon = (p: P) => <S {...p}><path d="M15.5 4.5 19.5 8.5 8.5 19.5H4.5v-4L15.5 4.5Z" /></S>;
export const TrashIcon = (p: P) => <S {...p}><path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13" /></S>;
export const ArrowIcon = (p: P) => <S {...p}><path d="M4 12h15M14 7l5 5-5 5" /></S>;
export const ExternalIcon = (p: P) => <S {...p}><path d="M14 4.5h5.5V10M19.5 4.5 11 13M18 14v5.5H4.5V6H10" /></S>;
export const LogoutIcon = (p: P) => <S {...p}><path d="M9.5 20H5V4h4.5M15 8l4 4-4 4M19 12H9" /></S>;
export const TonightIcon = CalendarIcon;
export const SparkIcon = (p: P) => <S {...p}><path d="M5 19 14 10M14 4v3M18.5 5.5l-2 2M20 10h-3M9 6.5l1.5 1.5M18.5 14.5l-2-2" /></S>;
export const GlassIcon = (p: P) => <S {...p}><path d="M7 3.5h10v6.5a5 5 0 0 1-10 0V3.5ZM12 15v5.5M8.5 20.5h7M7 7.5h10" /></S>;
export const PercentIcon = (p: P) => <S {...p}><path d="M18 6 6 18" /><circle cx="7.5" cy="7.5" r="2" /><circle cx="16.5" cy="16.5" r="2" /></S>;
export const KeyIcon = (p: P) => <S {...p}><circle cx="8" cy="15.5" r="3.5" /><path d="M10.5 13 19 4.5M16 7.5l2.5 2.5M14 9.5l2 2" /></S>;
export const PageIcon = (p: P) => <S {...p}><path d="M6 3.5h8l4 4v13H6v-17Z" /><path d="M14 3.5v4h4M9 12h6M9 15.5h6" /></S>;
export const ImageIcon = (p: P) => <S {...p}><rect x="3.5" y="4.5" width="17" height="15" rx="1.5" /><circle cx="9" cy="10" r="1.6" /><path d="m4 18 5-5 4 4 2.5-2.5L20 18" /></S>;
export const GearIcon = (p: P) => <S {...p}><circle cx="12" cy="12" r="3" /><path d="M12 2.8v2.4M12 18.8v2.4M4.2 7.5l2.1 1.2M17.7 15.3l2.1 1.2M4.2 16.5l2.1-1.2M17.7 8.7l2.1-1.2M7.5 4.2l1.2 2.1M15.3 17.7l1.2 2.1M16.5 4.2l-1.2 2.1M8.7 17.7l-1.2 2.1" /></S>;
export const UsersIcon = (p: P) => <S {...p}><circle cx="9" cy="8.5" r="3" /><path d="M3.5 19.5c.6-3 2.8-5 5.5-5s4.9 2 5.5 5M15.5 5.8a3 3 0 0 1 0 5.4M17 14.6c2 .5 3.2 2.2 3.5 4.9" /></S>;
