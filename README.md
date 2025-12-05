# BrevoPing

Get notified when Brevo (Sendinblue) creates a new contact. This Next.js App Router service receives Brevo webhooks and fans out a formatted message to the channels you enable (Telegram, WhatsApp Cloud API, Email via Brevo transactional).

## Features (current state)
- Next.js 14 + TypeScript scaffold with App Router.
- Webhook endpoint at `POST /api/brevo/contact-created`.
- Phase 1 behavior: parse webhook payload, format all populated contact fields, log the message, and note which channels would be used.
- Env-driven configuration; sample `.env.local.example` provided.

## Tech Stack
- Next.js 14 (App Router), React 18, TypeScript
- Node 18+ (Vercel-friendly)
- Package manager: pnpm

## Project Structure
```
app/
  api/brevo/contact-created/route.ts  # Webhook entrypoint (Phase 1)
  layout.tsx
  page.tsx
  globals.css
src/
  config.ts                           # Env loading + channel flags
  types/brevo.ts                      # Brevo contact/webhook types
  message/formatContactMessage.ts     # Formats contact into a readable message
  notifications/dispatcher.ts         # Chooses enabled channels (logs only in Phase 1)
  notifications/channels/             # Reserved for Phase 2+ implementations
.env.local.example
next.config.mjs
tsconfig.json
package.json
```

## Environment Variables
Copy `.env.local.example` to `.env.local` and fill in values:
```
# Channel toggles
TELEGRAM_ENABLED=false
WHATSAPP_ENABLED=false
EMAIL_ENABLED=false

# Telegram
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# WhatsApp Cloud API
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_RECIPIENT_NUMBER=

# Email via Brevo
BREVO_EMAIL_API_KEY=
BREVO_EMAIL_FROM=
BREVO_EMAIL_TO=
```

## Getting Started
```bash
pnpm install
pnpm dev
```
The webhook will be available at `http://localhost:3000/api/brevo/contact-created`.

### Docker (live-reload with local code)
```bash
docker-compose up --build
```
Your local files are bind-mounted into the container, so code changes reflect immediately. Next.js dev server runs on port 3000.

### Quick manual test (Phase 1 logging)
```bash
curl -X POST http://localhost:3000/api/brevo/contact-created \
  -H "Content-Type: application/json" \
  -d '{
    "event": "contact_added",
    "contact": {
      "id": 1,
      "email": "test@example.com",
      "attributes": {
        "FIRSTNAME": "Test",
        "SOURCE": "Local Debug"
      }
    }
  }'
```
Expected: a JSON `{ ok: true, dispatched: [] }` response and the formatted message logged in the server console. Enable channel flags to see which would be dispatched.

## Implementation Phases (roadmap)
1) Scaffold & Webhook Logging (done): route, config, formatter, dispatcher logging only.  
2) Telegram notifications: add `src/notifications/channels/telegram.ts`, wire dispatcher.  
3) Email via Brevo: add `src/notifications/channels/email.ts`, wire dispatcher.  
4) WhatsApp Cloud API (optional): add `src/notifications/channels/whatsapp.ts`, wire dispatcher.  
5) Polish & docs: finalize README, env example, light tests for formatter.

## Notes for contributors
- Keep TypeScript strictness and minimal deps.
- No secrets committed; use env vars only.
- See `AGENTS.md` for deeper guidelines. Prompts for automation live in `PROMPTS.md` (ignored from Git).
