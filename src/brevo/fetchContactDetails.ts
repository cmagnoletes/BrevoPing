import { config } from "@/src/config";
import type { BrevoContact } from "../types/brevo";

const BREVO_CONTACT_API = "https://api.brevo.com/v3/contacts";

export async function fetchContactDetails(contact: BrevoContact): Promise<BrevoContact | null> {
  const apiKey = config.brevoApiKey;
  if (!apiKey) {
    return null;
  }

  const identifier = contact.id ?? contact.email;
  if (!identifier) {
    return null;
  }

  const url = `${BREVO_CONTACT_API}/${encodeURIComponent(String(identifier))}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    console.warn("[BrevoPing] Failed to fetch contact details from Brevo", res.status, text);
    return null;
  }

  const data = (await res.json()) as BrevoContact;
  return data;
}
