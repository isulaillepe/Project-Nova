# Spec: Figma UI/UX Prototype Submission Portal

**Labels**: `ready-for-agent`

---

## Problem Statement

Project Nova currently has a proposal submission portal (`/submit/proposal`) that accepts Canva design links. The competition also needs a **UI/UX Prototype Submission Portal** where teams can submit their Figma prototype/design links. Teams should be able to submit Figma URLs (file, prototype, or design links) through a similar 4-step wizard flow with email verification and OTP authentication.

---

## Solution

A new submission portal at `/submit/ui-ux` that mirrors the existing Proposal Portal's UX but accepts **Figma links** instead of Canva links. The portal uses the same 4-step flow (Identify → Verify → Upload → Success), reuses the existing email/OTP verification backend, and submits via the same `/api/proposal` endpoint with a new `SUBMIT_FIGMA` action type.

---

## User Stories

1. As a **team leader**, I want to access the UI/UX submission portal at `/submit/ui-ux`, so that I can submit my team's Figma prototype.

2. As a **team leader**, I want to enter my registered email address in Step 1 (IDENTIFY), so that the system can verify my team's eligibility.

3. As a **team leader**, I want to receive a 6-digit OTP via email after Step 1, so that I can prove ownership of the registered email.

4. As a **team leader**, I want to enter the 6-digit OTP in Step 2 (VERIFY), so that I can proceed to the submission step.

5. As a **team leader**, I want to paste a Figma prototype/design link in Step 3 (UPLOAD), so that I can submit my team's UI/UX work.

6. As a **team leader**, I want the system to validate my Figma URL (accepting `figma.com/file/...`, `/proto/...`, `/design/...` formats), so that invalid links are rejected with clear error messages.

7. As a **team leader**, I want to see a success receipt in Step 4 (SUCCESS) with my submission ID, team name, leader name, Figma link, and timestamp, so that I have proof of submission.

8. As a **team leader**, I want to click "VIEW FIGMA PROTOTYPE" on the success page to open my submitted Figma link, so that I can verify the submission.

9. As a **team leader**, I want to return to the submission hub from the success page, so that I can navigate back to other submission options.

10. As a **team leader**, I want the right sidebar to show Figma-specific submission requirements (view permissions, accepted URL formats, update policy), so that I know exactly what to prepare.

11. As a **team leader**, I want the right sidebar to link to the official Figma Community template, so that I can use it as a starting point.

12. As a **developer**, I want the Figma submission to reuse the existing `/api/proposal` endpoint with a new action type, so that backend changes are minimal and centralized.

13. As a **developer**, I want the same rate limiting and email/OTP verification logic to apply, so that security is consistent across submission portals.

14. As a **competition admin**, I want Figma submissions stored in the same backend (Google Apps Script / Firestore) as proposals, so that all submissions are in one place for review.

---

## Implementation Decisions

### Modules Built/Modified

1. **New Component: `FigmaPortal.tsx`** — Client-side 4-step wizard component in `src/components/sections/`
   - Step 1: Email identification (reuses `sendVerificationCode` from ProposalPortal)
   - Step 2: 6-digit OTP verification with timer and resend logic
   - Step 3: Figma URL input with validation
   - Step 4: Success receipt with submission details

2. **New Page: `/submit/ui-ux/page.tsx`** — Route page wrapping `FigmaPortal` in `React.Suspense` boundary

3. **Modified API Route: `/api/proposal/route.ts`** — Added `SUBMIT_FIGMA` to:
   - `RATE_LIMITS` object (5 requests/minute)
   - `validActions` array for canonical action validation

### Technical Clarifications

- **Figma URL Validation**: Accepts any URL containing `figma.com/` or starting with `https://www.figma.com`, `https://figma.com`, `http://figma.com` — covers `/file/`, `/proto/`, `/design/` paths and short domains
- **Color Scheme**: Nova brand colors — `#003599` (deep blue, primary), `#ffb81c` (gold, secondary/accent)
- **Icons**: Uses `PenTool` from lucide-react (no native Figma icon available)
- **Email Verification**: Reuses existing `teams` collection lookup — teams registered once can submit both proposal and UI/UX
- **Submission ID Format**: `NOVA-UIUX-XXXXXX` (distinct from `NOVA-SUB-XXXXXX` for proposals)
- **Backend**: Same Google Apps Script webhook endpoint; Apps Script needs `SUBMIT_FIGMA` case handling

### API Contract

```
POST /api/proposal
Content-Type: application/json

{
  "action": "SUBMIT_FIGMA",
  "email": "teamleader@example.com",
  "figmaUrl": "https://www.figma.com/file/abc123/..."
}
```

Response (success):
```json
{
  "success": true,
  "submissionId": "NOVA-UIUX-123456",
  "timestamp": "8/19/2026, 2:30:45 PM",
  "teamName": "Team Alpha",
  "leaderName": "John Doe"
 }
```

---

## Testing Decisions

### What Makes a Good Test
- Test **external behavior** (user-visible outcomes), not implementation details
- Test at the **highest seam possible** — prefer E2E over unit where feasible
- Follow existing test patterns in the codebase

### Modules to Test

1. **FigmaPortal Component** — E2E flow through all 4 steps
   - Step 1: Email input → API call → step transition
   - Step 2: OTP input (6 digits) → verification → step transition
   - Step 3: Figma URL validation (valid/invalid formats) → submission → step transition
   - Step 4: Receipt display with correct data
   - Error handling: invalid email, invalid OTP, invalid Figma URL, network errors

2. **API Route `/api/proposal`** — Unit/integration tests
   - Rate limiting for `SUBMIT_FIGMA` action
   - Action validation (accepts `SUBMIT_FIGMA`)
   - Payload forwarding to Apps Script

3. **Figma URL Validation** — Unit tests for `isValidFigmaUrl` helper
   - Valid: `https://www.figma.com/file/...`, `https://www.figma.com/proto/...`, `https://www.figma.com/design/...`, `https://figma.com/...`
   - Invalid: `https://www.canva.com/...`, `https://example.com`, empty string

### Prior Art
- Existing ProposalPortal tests (if any) for wizard flow patterns
- Registration form validation tests for Zod schema patterns
- API route tests for rate limiting and action validation

---

## Out of Scope

- **Google Apps Script backend changes** — The Apps Script must be updated separately to handle `SUBMIT_FIGMA` action (documented in `BACKEND_APPS_SCRIPT.md`)
- **Figma Community template creation** — Placeholder URL used; actual template file to be created by design team
- **Team eligibility gating** — Currently all registered teams can submit; future `tracks` field in team documents not implemented
- **File upload (PDF/image)** — Only Figma links accepted; no drag-and-drop file upload
- **YouTube video links** — Removed from this portal (was in earlier ProposalPortal versions)
- **Admin review dashboard** — Separate feature

---

## Further Notes

- The implementation follows the exact same patterns as `ProposalPortal.tsx` for consistency
- TypeScript and ESLint pass; production build succeeds
- The page is statically prerendered (SSG) with Suspense boundary for client-side hydration
- Google Apps Script backend update is the only remaining blocker for full end-to-end functionality
- Consider adding a `tracks: ["proposal", "ui-ux"]` field to team documents in Firestore for future eligibility control