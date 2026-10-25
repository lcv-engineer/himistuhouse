import dns from "dns";
import net from "net";
import type { Reservation } from "./store";

// Một số mạng có IPv6 hỏng/chậm: ưu tiên IPv4 và nới thời gian thử kết nối, nếu không fetch tới Telegram bị ETIMEDOUT.
dns.setDefaultResultOrder("ipv4first");
net.setDefaultAutoSelectFamilyAttemptTimeout(3000);

// Cấu hình trong .env.local: TELEGRAM_BOT_TOKEN và TELEGRAM_CHAT_ID. Thiếu một trong hai => bỏ qua, không báo lỗi.
export const telegramEnabled = () => Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);

export async function sendTelegram(text: string): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return { ok: false, error: "chưa cấu hình TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID" };
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true }),
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return { ok: false, error: `Telegram trả về ${res.status}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

// WhatsApp qua CallMeBot (dịch vụ bên thứ ba, không chính thức). Cấu hình trong .env.local:
// WHATSAPP_PHONE (số của bạn, có mã nước, vd 84363561805) và CALLMEBOT_APIKEY. Thiếu => bỏ qua.
export const whatsappEnabled = () => Boolean(process.env.WHATSAPP_PHONE && process.env.CALLMEBOT_APIKEY);

export async function sendWhatsapp(text: string): Promise<{ ok: boolean; error?: string }> {
  const phone = process.env.WHATSAPP_PHONE?.replace(/[^\d]/g, "");
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!phone || !apikey) return { ok: false, error: "chưa cấu hình WHATSAPP_PHONE / CALLMEBOT_APIKEY" };
  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apikey)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return { ok: false, error: `CallMeBot trả về ${res.status}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

// Gửi thông báo qua mọi kênh đã cấu hình; lỗi một kênh không ảnh hưởng kênh khác.
export async function notifyAll(text: string) {
  const [tg, wa] = await Promise.all([
    telegramEnabled() ? sendTelegram(text) : Promise.resolve(null),
    whatsappEnabled() ? sendWhatsapp(text) : Promise.resolve(null),
  ]);
  return { telegram: tg, whatsapp: wa };
}

export function reservationText(r: Reservation) {
  const zalo = `https://zalo.me/${r.phone.replace(/[^\d+]/g, "")}`;
  return [
    "🍸 Đặt bàn mới – Himitsu",
    `Khách: ${r.name}`,
    `SĐT/Zalo: ${r.phone}`,
    `Ngày giờ: ${r.date} ${r.time}`,
    `Số khách: ${r.guests}`,
    r.note ? `Ghi chú: ${r.note}` : "",
    `Nhắn Zalo: ${zalo}`,
  ].filter(Boolean).join("\n");
}
