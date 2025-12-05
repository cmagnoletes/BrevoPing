
# AGENTS.md

## Project Overview

This repository implements a small notification service for **Brevo** (formerly Sendinblue) contacts.

**Goal:**  
When a new contact is created in Brevo, Brevo sends a **webhook** to this app (hosted on **Vercel** using Next.js App Router). The app then forwards a human-readable message containing **all populated contact fields** to one or more notification channels:

- Telegram
- WhatsApp (via WhatsApp Cloud API)
- Email (via Brevo’s transactional email API)

This project is meant to be:
- Small but production-ready.
- Easy for others to fork and configure via environment variables.
- A good public example of a Vercel + Webhooks + Notifications automation.

---

## Tech Stack & Runtime

- Framework: **Next.js 14+**, App Router (`app/` directory).
- Language: **TypeScript** (strict mode preferred).
- Runtime: Node.js 18+ on **Vercel**.
- Package manager: **pnpm** (preferred).
- Hosting: **Vercel** (single project, no serverless DB).

Please:
- Prefer minimal, standard dependencies.
- Avoid adding stateful services (DB, Redis, etc.) for v1.
- Keep code modular and well-typed.

---

## Directory Structure (Desired)

Target structure (feel free to adjust details, but keep the spirit):


brevo-lead-notifier/
├─ app/
│  └─ api/
│     └─ brevo/
│        └─ contact-created/
│           └─ route.ts          # main webhook handler (POST)
├─ src/
│  ├─ config.ts                  # env vars + enabled channels
│  ├─ types/
│  │  └─ brevo.ts                # Brevo webhook/contact types
│  ├─ message/
│  │  └─ formatContactMessage.ts # build a message from contact payload
│  ├─ notifications/
│  │  ├─ channels/
│  │  │  ├─ telegram.ts          # sendTelegram(message)
│  │  │  ├─ whatsapp.ts          # sendWhatsapp(message)
│  │  │  └─ email.ts             # sendEmail(message)
│  │  └─ dispatcher.ts           # picks enabled channels & calls them
│  └─ utils/                     # (optional) small helpers if needed
├─ .env.local.example
├─ package.json
├─ tsconfig.json
├─ next.config.mjs
├─ README.md
└─ LICENSE


---

## External APIs & Environment Variables

All secrets must come from **environment variables**, never hard-coded.

### Brevo webhook (input)

* Brevo is configured to send a webhook to:

  * `POST /api/brevo/contact-created`
* Event type: *Contact added* (or equivalent).

The payload will include a **contact object**. If in doubt, handle the body generically and log a sample (with secrets redacted).

### Notification Channels

**Global flags:**

* `TELEGRAM_ENABLED` = `true`/`false`
* `WHATSAPP_ENABLED` = `true`/`false`
* `EMAIL_ENABLED` = `true`/`false`

**Telegram**

* `TELEGRAM_BOT_TOKEN`
* `TELEGRAM_CHAT_ID`

**WhatsApp** (Cloud API)

* `WHATSAPP_ACCESS_TOKEN`
* `WHATSAPP_PHONE_NUMBER_ID`
* `WHATSAPP_RECIPIENT_NUMBER` (E.164, e.g. `+15551234567`)

**Email** (via Brevo transactional email API)

* `BREVO_EMAIL_API_KEY`
* `BREVO_EMAIL_TO`
* `BREVO_EMAIL_FROM`

Also add a `.env.local.example` listing all of these with placeholder values.


## Message Formatting Requirements

The message to the user must include **all populated fields** in the contact payload, not just name/email.

Guidelines:

* Prefix with a short header, e.g.:

  ```text
  🆕 New Brevo Contact
  ```

* Then print each key/value on its own line.

* For `attributes`, prefix keys with `attributes.`, e.g.:

  ```text
  attributes.FIRSTNAME: Jason
  attributes.SOURCE: Lycely Quiz
  ```

* For arrays or objects, serialize with `JSON.stringify(..., null, 2)` unless a better representation is obvious.

* Skip fields that are `null`, `undefined`, or empty strings.

Example output (for inspiration):

```text
🆕 New Brevo Contact

id: 123
email: jason@example.com
createdAt: 2025-12-05T15:23:01Z
listIds: [1, 2]

attributes.FIRSTNAME: Jason
attributes.LASTNAME: Nicol
attributes.SOURCE: Lycely Quiz
attributes.COMPANY: Lycely
```

---

## Build & Run Commands

Use **pnpm** by default.

Local dev:

```bash
pnpm install
pnpm dev
```

Build:

```bash
pnpm build
pnpm start
```

Testing is currently manual; future improvements can add unit tests where it makes sense (e.g., for `formatContactMessage`).

---

## Implementation Phases (for Agents)

Follow a **vertical slice** approach: each phase should deliver a working, testable end-to-end behavior before adding complexity.

### Phase 1 – Scaffold & Webhook Logging

* Create the Next.js project (if not already present) using TypeScript and App Router.
* Implement `app/api/brevo/contact-created/route.ts`:

  * Accept `POST` requests with JSON.
  * Extract the `contact` object (support both `body.contact` and `body` directly).
  * Call a function `dispatchNewContactNotification(contact)`.
  * In this phase, `dispatchNewContactNotification` just logs the formatted message to the console.
* Implement:

  * `src/config.ts` with channel flags + env helpers.
  * `src/message/formatContactMessage.ts` as described above.
  * `src/notifications/dispatcher.ts` that uses `getEnabledChannels()` and logs the chosen channels.

### Phase 2 – Telegram Notifications

* Implement `src/notifications/channels/telegram.ts`:

  * Use Telegram Bot API `sendMessage`.
  * Read `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` from env.
  * Handle and log errors gracefully.
* Update `dispatcher.ts` to call `sendTelegram(message)` when Telegram is enabled.

### Phase 3 – Email via Brevo

* Implement `src/notifications/channels/email.ts`:

  * Use Brevo transactional email API.
  * Use `BREVO_EMAIL_API_KEY`, `BREVO_EMAIL_FROM`, and `BREVO_EMAIL_TO`.
  * Subject can be something like: `"New Brevo contact: {{email}}"` if available.
* Update `dispatcher.ts` to call `sendEmail(message)` when Email is enabled.

### Phase 4 – WhatsApp (Optional / Stretch)

* Implement `src/notifications/channels/whatsapp.ts`:

  * Use WhatsApp Cloud API `messages` endpoint.
  * Send the message as a simple text message to `WHATSAPP_RECIPIENT_NUMBER`.
* Update `dispatcher.ts` to call `sendWhatsapp(message)` when WhatsApp is enabled.

### Phase 5 – Polish & Documentation

* Add `.env.local.example`.
* Add a clear `README.md` describing:

  * What the project does.
  * How to deploy to Vercel.
  * How to configure Brevo webhooks.
  * How to set up each notification channel.
* Ensure the code is formatted, typed, and reasonably small.

---

## Working Agreements for Agents

When you (the coding agent) work on this repo, please:

* **Always read** this `AGENTS.md` and the current `README.md` before making large changes.
* Use **TypeScript** and keep types explicit where practical.
* Prefer **pnpm** for new commands and dependencies.
* Avoid introducing new dependencies unless they are clearly justified (e.g., `node-fetch` / `undici` if needed, but prefer built-in `fetch` in Next.js where possible).
* Keep changes focused: small vertical slices that are easy to review.
* When adding or modifying files, include short comments where it helps future readers.
* Never commit `.env*` files or any secrets.
* Be careful about logging:

  * Do not log raw secrets.
  * For Brevo payloads, logging sample data is fine in dev, but avoid verbose logs in production code paths.

If a requested change conflicts with these instructions, explain the trade-offs in your proposal or comments first.