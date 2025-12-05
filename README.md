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
# (Optional) Brevo Contacts API for enrichment
BREVO_API_KEY=
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

### Tests
```bash
pnpm test
```

## Channel configuration & manual tests
- Telegram: set `TELEGRAM_ENABLED=true`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`. Test by posting the sample curl below and confirming receipt in the chat.
- Email (Brevo transactional): set `EMAIL_ENABLED=true`, `BREVO_EMAIL_API_KEY`, `BREVO_EMAIL_FROM`, `BREVO_EMAIL_TO`. Brevo dashboard → Transactional → API keys to create a key.
- WhatsApp Cloud: set `WHATSAPP_ENABLED=true`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_RECIPIENT_NUMBER` (E.164). Ensure the Cloud API app has the recipient approved/tested.
- Contact enrichment (optional): set `BREVO_API_KEY` (or reuse `BREVO_EMAIL_API_KEY`). The app will fetch full contact details by id/email and include all attributes in notifications.

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

## Deploying to Vercel
1) Push this repo to GitHub (done).  
2) In Vercel, import the project; select Node 18+ runtime.  
3) Set environment variables in Project Settings → Environment Variables (all from `.env.local.example`).  
4) Deploy. The webhook endpoint will be `https://<vercel-project>.vercel.app/api/brevo/contact-created`.

### Brevo webhook setup
1) In Brevo: Automation → Settings → Webhooks → Create webhook.  
2) URL: `https://<vercel-project>.vercel.app/api/brevo/contact-created`  
3) Event: Contact added (or equivalent).  
4) Save.

### End-to-end test (production or preview)
1) Ensure env vars are set in Vercel for the enabled channels.  
2) Trigger a contact creation in Brevo (e.g., add a contact to a test list).  
3) Verify channel delivery (Telegram chat, WhatsApp test recipient, email inbox).  
4) Check Vercel logs for formatted message and any errors.

## Implementation Phases (roadmap)
1) Scaffold & Webhook Logging (done): route, config, formatter, dispatcher with logging.
2) Telegram notifications (done): `src/notifications/channels/telegram.ts` wired to dispatcher.
3) Email via Brevo (done): `src/notifications/channels/email.ts` wired to dispatcher.
4) WhatsApp Cloud API (done): `src/notifications/channels/whatsapp.ts` wired to dispatcher.
5) Polish & docs: finalize README, env example, light tests for formatter (pending).

## Notes for contributors
- Keep TypeScript strictness and minimal deps.
- No secrets committed; use env vars only.
- See `AGENTS.md` for deeper guidelines. Prompts for automation live in `PROMPTS.md` (ignored from Git).
