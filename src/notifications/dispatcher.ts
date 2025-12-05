import { config, getEnabledChannels } from "../config";
import { formatContactMessage } from "../message/formatContactMessage";
import type { BrevoContact } from "../types/brevo";
import { sendTelegram } from "./channels/telegram";
import { sendEmail } from "./channels/email";
import { sendWhatsapp } from "./channels/whatsapp";

export const dispatchNewContactNotification = async (contact: BrevoContact) => {
  const message = formatContactMessage(contact);
  const channels = getEnabledChannels();
  const enabled = Object.entries(channels)
    .filter(([, enabledFlag]) => enabledFlag)
    .map(([name]) => name);

  console.info("[BrevoPing] formatted contact message:\n", message);

  if (enabled.length === 0) {
    console.info("[BrevoPing] no channels enabled; logging only.");
    return {
      message,
      enabledChannels: enabled,
      configSnapshot: {
        telegramEnabled: config.telegramEnabled,
        whatsappEnabled: config.whatsappEnabled,
        emailEnabled: config.emailEnabled,
      },
    };
  }

  const results = await Promise.allSettled(
    enabled.map((channel) => {
      if (channel === "telegram") return sendTelegram(message);
      if (channel === "email") return sendEmail(message, contact.email);
      if (channel === "whatsapp") return sendWhatsapp(message);
      return Promise.resolve({ ok: false, description: "Unknown channel" });
    })
  );

  results.forEach((result, index) => {
    const channel = enabled[index];
    if (result.status === "fulfilled" && result.value.ok) {
      console.info(`[BrevoPing] ${channel} sent successfully`);
    } else {
      const description =
        result.status === "fulfilled" ? result.value.description : result.reason;
      console.error(`[BrevoPing] ${channel} failed`, description);
    }
  });

  return {
    message,
    enabledChannels: enabled,
    results,
    configSnapshot: {
      telegramEnabled: config.telegramEnabled,
      whatsappEnabled: config.whatsappEnabled,
      emailEnabled: config.emailEnabled,
    },
  };
};
