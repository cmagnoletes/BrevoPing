# ✅ **Updated `AGENTS.md` (with correct repo name)**

````markdown
# AGENTS.md

## Project Overview

This repository — **BrevoPing** — implements a small notification service for **Brevo** (formerly Sendinblue) contacts.

**Goal:**  
When a new contact is created in Brevo, Brevo sends a **webhook** to this app (hosted on **Vercel** using Next.js App Router). The app then forwards a human-readable message containing **all populated contact fields** to one or more notification channels:

- Telegram  
- WhatsApp (via WhatsApp Cloud API)  
- Email (via Brevo’s transactional email API)

This project is meant to be:
- Small but production-ready.  
- Easy for others to fork and configure.  
- A polished public example of a Vercel + Webhooks + Notifications automation.

---

## Tech Stack & Runtime

- Framework: **Next.js (App Router)**  
- Language: **TypeScript**  
- Deploy target: **Vercel**  
- Package manager: **pnpm**

No DB or persistent backend required.

---

## Directory Structure (Desired)

```text
BrevoPing/
├─ app/
│  └─ api/
│     └─ brevo/
│        └─ contact-created/
│           └─ route.ts
├─ src/
│  ├─ config.ts
│  ├─ types/
│  │  └─ brevo.ts
│  ├─ message/
│  │  └─ formatContactMessage.ts
│  ├─ notifications/
│  │  ├─ dispatcher.ts
│  │  └─ channels/
│  │     ├─ telegram.ts
│  │     ├─ whatsapp.ts
│  │     └─ email.ts
├─ .env.local.example
├─ README.md
└─ LICENSE
````

---

## Environment Variables

(unchanged from earlier, omitted here for brevity, but included in your README)

---

## Implementation Phases

(unchanged — Phase 1 through Phase 5 exactly as before)

---

## Working Agreements for Agents

(unchanged — TypeScript, pnpm, no secrets, etc.)

```

---

# ✅ **Updated Codex Prompts (all using “BrevoPing”)**

Use these in VS Code’s GPT Codex sidebar.

---

### **Prompt 1 — Load project context**

```

You are working inside my `BrevoPing` repo in VS Code.

1. Read `AGENTS.md` and `README.md`.
2. Summarize:

   * What BrevoPing does
   * The planned architecture and key files
   * The implementation phases
3. Then propose a short, ordered TODO list based on the current state of the repo.

```

