import { config } from "@/src/config";

const TELEGRAM_API = "https://api.telegram.org";

export interface TelegramResult {
  ok: boolean;
  description?: string;
}

export async function sendTelegram(message: string): Promise<TelegramResult> {
  const token = config.telegramBotToken;
  const chatId = config.telegramChatId;

  if (!token || !chatId) {
    console.warn("[BrevoPing] Telegram not configured (token/chat id missing)");
    return { ok: false, description: "Missing Telegram configuration" };
  }

  const url = `${TELEGRAM_API}/bot${token}/sendMessage`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[BrevoPing] Telegram send failed", res.status, text);
    return { ok: false, description: text };
  }

  return { ok: true };
}
