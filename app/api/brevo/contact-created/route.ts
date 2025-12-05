import { NextResponse, type NextRequest } from "next/server";
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

  const contact = (payload as BrevoWebhookPayload).contact ?? (payload as BrevoContact);

  if (!contact || typeof contact !== "object") {
    return NextResponse.json({ error: "Missing contact payload" }, { status: 400 });
  }

  try {
    const result = await dispatchNewContactNotification(contact);
    return NextResponse.json({ ok: true, dispatched: result.enabledChannels });
  } catch (error) {
    console.error("[BrevoPing] Error handling contact-created webhook", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ ok: true, message: "Brevo contact webhook endpoint" });
}
