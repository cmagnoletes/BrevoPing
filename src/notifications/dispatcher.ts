import { config, getEnabledChannels } from "../config";
import { formatContactMessage } from "../message/formatContactMessage";
import type { BrevoContact } from "../types/brevo";

export const dispatchNewContactNotification = async (contact: BrevoContact) => {
  const message = formatContactMessage(contact);
  const channels = getEnabledChannels();
  const enabled = Object.entries(channels)
    .filter(([, enabledFlag]) => enabledFlag)
    .map(([name]) => name);

  // Phase 1: only log the formatted message and the selected channels.
  console.info("[BrevoPing] formatted contact message:\n", message);
  if (enabled.length === 0) {
    console.info("[BrevoPing] no channels enabled; logging only.");
  } else {
    console.info(`[BrevoPing] Phase 1 stub: would send to channels -> ${enabled.join(", ")}`);
  }

  return {
    message,
    enabledChannels: enabled,
    configSnapshot: {
      telegramEnabled: config.telegramEnabled,
      whatsappEnabled: config.whatsappEnabled,
      emailEnabled: config.emailEnabled,
    },
  };
};
