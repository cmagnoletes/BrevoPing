import { config } from "@/src/config";

export interface WhatsappResult {
  ok: boolean;
  description?: string;
}

export async function sendWhatsapp(message: string): Promise<WhatsappResult> {
  const accessToken = config.whatsappAccessToken;
  const phoneNumberId = config.whatsappPhoneNumberId;
  const recipient = config.whatsappRecipientNumber;

  if (!accessToken || !phoneNumberId || !recipient) {
    console.warn("[BrevoPing] WhatsApp not configured (token/phone/recipient missing)");
    return { ok: false, description: "Missing WhatsApp configuration" };
  }

  const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: recipient,
      type: "text",
      text: { body: message },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[BrevoPing] WhatsApp send failed", res.status, text);
    return { ok: false, description: text };
  }

  return { ok: true };
}
