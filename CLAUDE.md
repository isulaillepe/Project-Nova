# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Project Nova** — A tech competition platform for school and university students organized by AIESEC in University of Sri Jayewardenepura. The platform features:
- **Registration Portal** — Multi-member team registration with Zod validation
- **Proposal Submission Portal** — 4-step wizard (Identify → Verify OTP → Submit Canva Link → Success) with Google Apps Script backend

## Commands

```bash
# Development
npm run dev          # Start dev server on localhost:3000

# Build & Production
npm run build        # Production build (Next.js 16)
npm run start        # Run production server

# Linting
npm run lint         # ESLint (eslint.config.mjs with Next.js config)

# Type Checking
npx tsc --noEmit     # TypeScript type check (strict mode enabled)
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router) with React 19
- **Styling**: Tailwind CSS v4 (PostCSS), CSS variables for theming
- **UI**: Radix UI primitives, Lucide React icons, class-variance-authority (CVA)
- **Forms**: React Hook Form + Zod resolvers
- **Database**: Firebase Firestore (Client SDK + Admin SDK fallback)
- **Rate Limiting**: Upstash Redis (sliding window, 10 req/min)
- **Backend Webhooks**: Google Apps Script (deployed as Web App)
- **Email**: Gmail via Google Apps Script
- **Fonts**: Poppins, Space Grotesk, Cormorant Garamond, Cinzel, Orbitron (next/font/google)

### Project Structure
```
src/
├── app/
│   ├── api/
│   │   ├── proposal/route.ts      # Proposal API (currently returns 403 - submissions closed)
│   │   └── send-email/route.ts    # Email API
│   ├── register/page.tsx          # Registration page
│   ├── submit/
│   │   ├── page.tsx               # Submit hub
│   │   └── proposal/page.tsx      # Proposal portal page (renders ProposalPortal)
│   ├── actions/
│   │   └── register.ts            # Server action: registerTeam()
│   ├── layout.tsx                 # Root layout with fonts, Header, Footer, ClientFX
│   ├── page.tsx                   # Landing page
│   └── globals.css                # Global styles + CSS variables
├── components/
│   ├── sections/
│   │   ├── ProposalPortal.tsx     # 4-step proposal wizard (main feature)
│   │   ├── RegistrationForm.tsx   # Team registration form
│   │   ├── Hero.tsx, Features.tsx, Faq.tsx, etc.
│   ├── layout/
│   │   ├── Header.tsx, Footer.tsx
│   ├── fx/
│   │   ├── ClientFX.tsx, ConstellationCanvas.tsx, SystemPreloader.tsx
│   ├── ui/
│   │   ├── button.tsx, input.tsx, label.tsx, card.tsx, badge.tsx
│   └── hero/Hero.tsx
├── lib/
│   ├── firebase.ts                # Client-side Firebase init (Analytics, Messaging, etc.)
│   ├── sanitize.ts                # XSS prevention, input sanitization, rate limiting helper
│   ├── validations/
│   │   └── registration.ts        # Zod schemas for registration
│   ├── webhook.ts                 # Server action: triggerRegistrationWebhook()
│   └── utils.ts                   # cn() helper (clsx + tailwind-merge)
��── types/global.d.ts              # Global type declarations
```

## Key Implementation Details

### Registration Flow (`src/app/actions/register.ts`)
- **Server Action** (`registerTeam`) handles form submission
- **Validation**: Zod schema with custom refinements (unique emails, university-track fields)
- **Dual Database**: Tries Firebase Admin SDK first, falls back to Client SDK
- **Team Name Uniqueness**: Case-insensitive check via `teamNameLower` field
- **Webhook**: Triggers Google Apps Script asynchronously after successful registration

### Proposal Portal (`src/components/sections/ProposalPortal.tsx`)
A 4-step client-side wizard:
1. **IDENTIFY** — Enter team leader email → calls `/api/proposal` with `VERIFY_EMAIL`
2. **VERIFY** — 6-digit OTP input → calls `/api/proposal` with `VERIFY_OTP`
3. **UPLOAD** — Canva design link (replaced PDF upload) → calls `/api/proposal` with `SUBMIT_PROPOSAL`
4. **SUCCESS** — Receipt with submission ID, timestamp, Canva link

**State Management**: All state in `useState`/`useRef`; OTP timer with `setInterval` cleanup; `sendVerificationCode` extracted for reuse (initial + resend).

**Current Status**: `/api/proposal/route.ts` returns 403 (submissions closed). The Google Apps Script backend handles actual processing (see `BACKEND_APPS_SCRIPT.md`).

### Input Sanitization (`src/lib/sanitize.ts`)
- `escapeHtml`, `sanitizeText`, `sanitizeEmail`, `sanitizePhone`, `sanitizeName`, `sanitizeNic`
- Zod transforms: `escapeHtmlTransform`, `sanitizeEmailTransform`, etc.
- `deepSanitize` for recursive object sanitization
- In-memory rate limit helper (`checkRateLimit`) for edge runtime compatibility

### Rate Limiting (`middleware.ts`)
- Upstash Redis sliding window: 10 requests/minute per IP
- Applied to `/api/:path*` (currently only `/api/register` checked)

### Environment Variables
```
# Firebase Client (browser)
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

# Firebase Admin (server-only)
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY

# Google Apps Script Webhooks
REGISTRATION_WEBHOOK_URL
PROPOSAL_WEBHOOK_URL
APPS_SCRIPT_WEBHOOK_URL
NEXT_PUBLIC_APPS_SCRIPT_URL

# Upstash Redis
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

## Important Files to Know

| File | Purpose |
|------|---------|
| `src/app/actions/register.ts` | Server action for team registration |
| `src/components/sections/ProposalPortal.tsx` | 4-step proposal wizard (core feature) |
| `src/lib/sanitize.ts` | XSS prevention & input sanitization |
| `src/lib/validations/registration.ts` | Zod schemas with custom refinements |
| `src/lib/webhook.ts` | Google Apps Script webhook trigger |
| `middleware.ts` | Upstash rate limiting |
| `BACKEND_APPS_SCRIPT.md` | Google Apps Script backend documentation |
| `next.config.ts` | Allowed dev origins for HMR/IP access |

## Development Notes

- **React Compiler**: Enabled in `next.config.ts` (`reactCompiler: true`)
- **Path Alias**: `@/*` maps to `./src/*`
- **TypeScript**: Strict mode, noEmit, incremental builds
- **Font Loading**: 5 Google fonts loaded via `next/font/google` with CSS variables
- **Dark Theme**: CSS variables in `globals.css` (`--nova-deep`, `--nova-secondary`, `--nova-linen`, etc.)
- **Proposal Submissions**: Currently disabled (403 response). Google Apps Script handles the actual backend when enabled.

## Common Tasks

### Adding a New API Route
```typescript
// src/app/api/your-route/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  // Validate with Zod, sanitize inputs, process
  return NextResponse.json({ success: true });
}
```

### Adding a Server Action
```typescript
// src/app/actions/your-action.ts
"use server";

export async function yourAction(formData: FormData) {
  // Validate, process, return { success: boolean, error?: string }
}
```

### Extending Zod Validation
Use existing sanitize transforms from `@/lib/sanitize`:
```typescript
import { sanitizeEmailTransform, sanitizeHtmlTransform } from "@/lib/sanitize";

const schema = z.object({
  email: sanitizeEmailTransform,
  name: sanitizeHtmlTransform,
});
```

### Running Type Check
```bash
npx tsc --noEmit
```

### Building for Production
```bash
npm run build
npm run start
```

## Agent skills

### Issue tracker

GitHub Issues via `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default canonical labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout: `CONTEXT.md` at repo root + `docs/adr/`. See `docs/agents/domain.md`.