# Brevo Lead Notifier

**Get instant notifications when a new contact is added to your Brevo CRM.**
Hosted on **Vercel**, powered by **Next.js**, and notifies you via **Telegram**, **WhatsApp**, or **Email**.

> Stop missing leads. This tiny automation turns Brevo’s silent contact creation into actionable notifications you actually see.

---

## 🚀 What This Project Does

When Brevo creates a new contact—via forms, automations, API calls, imports, or newsletter sign-ups—it can send a webhook to this app.

This app:

1. Receives the webhook at `/api/brevo/contact-created`
2. Extracts **all populated fields** from the contact payload
3. Formats them into a human-friendly message
4. Sends that message through any of these channels:

   * **Telegram**
   * **WhatsApp** (via Cloud API)
   * **Email** (via Brevo Transactional Email API)

Perfect for:

* Founders tracking early funnel traction
* Solopreneurs monitoring lead gen
* Newsletter creators using Brevo
* Marketers wanting real-time inbound signals

---

## 🧱 Architecture

Built for simplicity and portability:

* **Next.js (App Router)**
* **Node.js 18+ runtime (Vercel)**
* **Serverless function** at `app/api/brevo/contact-created/route.ts`
* **TypeScript** everywhere
* **No database**, no cron jobs, no external servers
* All config via **environment variables**

Core structure:

```
app/
  api/
    brevo/
      contact-created/
        route.ts        # Webhook entrypoint

src/
  config.ts            # Env var loading + channel toggles
  types/               # Brevo webhook types
  message/
    formatContactMessage.ts
  notifications/
    dispatcher.ts
    channels/
      telegram.ts
      whatsapp.ts
      email.ts

.env.local.example
README.md
AGENTS.md
```

---

## 📦 Features

### ✔ Real-time Webhook (no polling)

Brevo POSTs contact data immediately → you get notified within seconds.

### ✔ Sends all contact fields

Nothing is lost. Every attribute you collect in Brevo is delivered to you.

### ✔ Multiple notification channels

Enable any subset of:

* Telegram
* WhatsApp
* Email

### ✔ Zero backend hosting

Vercel deploys everything automatically.

### ✔ Simple to fork & configure

A `.env.local.example` file is included with all fields you need.

---

## 🔧 Setup

### 1. Clone the project

```bash
git clone https://github.com/your-username/brevo-lead-notifier
cd brevo-lead-notifier
pnpm install
```

Or use `npm install` if you don’t use pnpm.

---

### 2. Configure environment variables

Copy:

```bash
cp .env.local.example .env.local
```

Fill these values:

#### Telegram (optional)

```
TELEGRAM_ENABLED=true
TELEGRAM_BOT_TOKEN=xxx
TELEGRAM_CHAT_ID=xxx
```

#### WhatsApp Cloud API (optional)

```
WHATSAPP_ENABLED=true
WHATSAPP_ACCESS_TOKEN=xxx
WHATSAPP_PHONE_NUMBER_ID=xxx
WHATSAPP_RECIPIENT_NUMBER=+15551234567
```

#### Email via Brevo (optional)

```
EMAIL_ENABLED=true
BREVO_EMAIL_API_KEY=xxx
BREVO_EMAIL_FROM=you@domain.com
BREVO_EMAIL_TO=you@domain.com
```

You may enable any or all channels.

---

### 3. Local development

```bash
pnpm dev
```

The webhook will be available locally at:

```
http://localhost:3000/api/brevo/contact-created
```

Test with:

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

You should see the formatted log output in your terminal.

---

## ☁️ Deploying to Vercel

1. Push the repository to GitHub
2. Go to **Vercel → Import Project**
3. During import:

   * Add all environment variables in **Project → Settings → Environment Variables**
4. Deploy

Your production webhook endpoint will be:

```
https://your-vercel-project.vercel.app/api/brevo/contact-created
```

---

## 🔗 Configure the Brevo Webhook

In Brevo:

1. Go to
   **Automation → Settings → Webhooks**
2. Create a new webhook:

   * **URL:**
     `https://your-vercel-project.vercel.app/api/brevo/contact-created`
   * **Event type:**
     *Contact added* (or the closest event in your Brevo version)
3. Save

Now whenever a new contact is created → Brevo calls your server → your server notifies you.

---

## 🔍 Example Notification Output

```
🆕 New Brevo Contact

id: 292
email: jason@example.com
createdAt: 2025-12-05T15:23:01Z
listIds: [1, 3]

attributes.FIRSTNAME: Jason
attributes.LASTNAME: Nicoman
attributes.SOURCE: Quiz Funnel
attributes.COMPANY: Acme
```

---

## 📡 Roadmap

* [ ] Add optional Markdown formatting support
* [ ] Add Slack + Discord webhook integrations
* [ ] Add filtering rules (only notify for list X, or attribute Y)
* [ ] Add minimal unit tests for message formatting
* [ ] Add message templating options (JSON, HTML, Markdown)

---

## 🧠 For Contributors & Codex Users

This repo includes **AGENTS.md**, which documents:

* Architecture
* Environment design
* Implementation phases
* Code style guidelines
* Expected workflows for AI-assisted coding (GPT Codex or GitHub Copilot)

If you’re using GPT Codex in VS Code, read AGENTS.md first—Codex will follow it to build features cleanly.

---

## 📝 License

MIT License — free for personal and commercial use.

---

## 💬 Feedback / Issues

Open an issue if:

* Brevo changed the webhook format
* You want a new notification channel
* You want examples for custom validations or filtering

Pull requests are welcome!

