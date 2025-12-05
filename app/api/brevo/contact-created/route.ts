import { NextResponse, type NextRequest } from "next/server";
import { fetchContactDetails } from "@/src/brevo/fetchContactDetails";
import { dispatchNewContactNotification } from "@/src/notifications/dispatcher";
import type { BrevoContact, BrevoWebhookPayload } from "@/src/types/brevo";

export async function POST(request: NextRequest) {
  let payload: BrevoWebhookPayload | BrevoContact;

  try {
    payload = await request.json();
  } catch (error) {
    console.error("[BrevoPing] Failed to parse JSON body", error);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const webhookPayload = payload as BrevoWebhookPayload;
  const contactFromPayload = webhookPayload.contact ?? (payload as BrevoContact);

  if (!contactFromPayload || typeof contactFromPayload !== "object") {
    return NextResponse.json({ error: "Missing contact payload" }, { status: 400 });
  }

  const meta = Object.fromEntries(
    Object.entries(webhookPayload).filter(([key]) => key !== "contact")
  );

  const enrichedContact =
    (await fetchContactDetails(contactFromPayload as BrevoContact)) ?? contactFromPayload;

  const combinedContact: BrevoContact = {
    ...(meta as Record<string, unknown>),
    ...enrichedContact,
    attributes: {
      ...(enrichedContact as BrevoContact).attributes,
    },
  };

  try {
    const result = await dispatchNewContactNotification(combinedContact);
    return NextResponse.json({ ok: true, dispatched: result.enabledChannels });
  } catch (error) {
    console.error("[BrevoPing] Error handling contact-created webhook", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ ok: true, message: "Brevo contact webhook endpoint" });
}
