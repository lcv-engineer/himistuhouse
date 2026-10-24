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
