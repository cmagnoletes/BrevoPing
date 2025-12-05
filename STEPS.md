# Development Log (BrevoPing)

This file tracks what was built across phases, in plain language for both engineers and product.

## Phase 1 – Scaffold & Webhook Logging
- Added Next.js 14 App Router + TypeScript scaffold with pnpm scripts.
- Created webhook endpoint `app/api/brevo/contact-created/route.ts` that accepts Brevo contact payloads, formats all populated fields, and logs the message.
- Added config/env loader, message formatter, and dispatcher stub (logging-only).
- Documented basic setup and curl test in README.

## Phase 2 – Channel Implementations (Telegram, Email, WhatsApp)
- Implemented per-channel senders in `src/notifications/channels/`:
  - `telegram.ts`: sends text via Telegram Bot API using `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.
  - `email.ts`: sends via Brevo transactional API using `BREVO_EMAIL_API_KEY`, `BREVO_EMAIL_FROM`, `BREVO_EMAIL_TO`.
  - `whatsapp.ts`: sends text via WhatsApp Cloud API using `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_RECIPIENT_NUMBER`.
- Updated dispatcher to fan out to enabled channels after formatting the message; logs successes/failures per channel.
- README updated with channel env snippets and manual test pointers; `.env.local.example` already lists required vars.

## Phase 3 – Testing & Deployment Notes (Polish)
- Added Vitest setup (`vitest.config.ts`) and `pnpm test` script in `package.json`.
- Created `tests/formatContactMessage.test.ts` to ensure populated fields are included and empty fields skipped.
- Expanded README with Vercel deployment checklist, Brevo webhook setup, end-to-end test flow, and test command.

## Remaining Ideas / Roadmap
- Optional enhancements: Markdown formatting, Slack/Discord integrations, filtering rules, message templating.
- Consider retries/backoff and production logging tuning.
