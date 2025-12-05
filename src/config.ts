type ChannelFlag = boolean;

const parseBoolean = (value: string | undefined): ChannelFlag =>
  value === "true" || value === "1";

const getEnv = (key: string, fallback?: string) =>
  process.env[key] ?? fallback ?? "";

export const config = {
  telegramEnabled: parseBoolean(process.env.TELEGRAM_ENABLED),
  whatsappEnabled: parseBoolean(process.env.WHATSAPP_ENABLED),
  emailEnabled: parseBoolean(process.env.EMAIL_ENABLED),
  brevoApiKey: getEnv("BREVO_API_KEY", process.env.BREVO_EMAIL_API_KEY),
  telegramBotToken: getEnv("TELEGRAM_BOT_TOKEN"),
  telegramChatId: getEnv("TELEGRAM_CHAT_ID"),
  whatsappAccessToken: getEnv("WHATSAPP_ACCESS_TOKEN"),
  whatsappPhoneNumberId: getEnv("WHATSAPP_PHONE_NUMBER_ID"),
  whatsappRecipientNumber: getEnv("WHATSAPP_RECIPIENT_NUMBER"),
  brevoEmailApiKey: getEnv("BREVO_EMAIL_API_KEY"),
  brevoEmailFrom: getEnv("BREVO_EMAIL_FROM"),
  brevoEmailTo: getEnv("BREVO_EMAIL_TO"),
} as const;

export const getEnabledChannels = () => ({
  telegram: config.telegramEnabled,
  whatsapp: config.whatsappEnabled,
  email: config.emailEnabled,
});
