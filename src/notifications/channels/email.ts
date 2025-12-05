import { config } from "@/src/config";

const BREVO_EMAIL_API = "https://api.brevo.com/v3/smtp/email";

export interface EmailResult {
  ok: boolean;
  description?: string;
}

export async function sendEmail(message: string, subjectHint?: string): Promise<EmailResult> {
  const apiKey = config.brevoEmailApiKey;
  const to = config.brevoEmailTo;
  const from = config.brevoEmailFrom;

  if (!apiKey || !to || !from) {
    console.warn("[BrevoPing] Email not configured (api key/from/to missing)");
    return { ok: false, description: "Missing email configuration" };
  }

  const subject = subjectHint ? `New Brevo contact: ${subjectHint}` : "New Brevo contact";

  const res = await fetch(BREVO_EMAIL_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { email: from },
      to: [{ email: to }],
      subject,
      textContent: message,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[BrevoPing] Email send failed", res.status, text);
    return { ok: false, description: text };
  }

  return { ok: true };
}
