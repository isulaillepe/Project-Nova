# Organizing Committee Section

> **File:** `src/components/sections/OrganizingCommittee.tsx`
> **Section ID:** `#committee`

---

## Overview

The **Organizing Committee** section displays all committee members as cards inside a
continuously auto-scrolling marquee carousel. Moving cards pause instantly when the
cursor enters any card, and resume the moment the cursor leaves — giving users a
comfortable, frictionless way to browse the team.

The design is inspired by the dark-terminal aesthetic seen in **CodeSprint 11** and the
card-carousel layout used by **HackX 11.0**.

---

## Visual Design

| Element | Description |
|---|---|
| Background | `#020617` (site dark base) with a centred radial blue glow |
| Section badge | Pill with pulsing blue dot — "Mission Control" |
| Heading | White bold + blue gradient span |
| Card background | `#111827` semi-dark, 18 px rounded corners |
| Card top accent | Thin red gradient line appears on hover |
| Card border glow | Conic-gradient spinning border ring on hover |
| Avatar ring | Blue gradient ring (→ red-blue on hover) |
| ID badge | Red monospace label in top-right corner (`CM-01` … `CM-06`) |
| Status indicator | Animated pulsing green dot + `ACTIVE` label |
| Edge masks | CSS `mask-image` fade on left/right edges of carousel |

---

## Interaction Behaviour

```
Cards scrolling continuously →→→→→→→→→
         │
         ▼  Cursor enters any card
Cards PAUSE ■■■■■■■■■■■■■■■■■■■■■■■■■
         │
         ▼  Cursor leaves
Cards resume scrolling →→→→→→→→→→→→→→
```

- The entire track (including all cards) is duplicated to form a seamless infinite loop.
- The `animation-play-state` is toggled via a React state variable (`isPaused`) that
  adds/removes the `.paused` CSS class on the marquee track element.
- Individual card hover also triggers a subtle lift + scale transform and a glow border.

---

## Adding / Editing Committee Members

Open `OrganizingCommittee.tsx` and edit the `COMMITTEE` array near the top of the file:

```ts
const COMMITTEE = [
  {
    id: "CM-01",               // displayed in card top-right corner
    name: "Niyoma Bodinie",
    role: "Project Nova",      // sub-label below title
    title: "Organizing Committee President",
    contact: "+94 77 081 2900",
    email: "niyomabodinie@aiesec.net",
    avatar: "NB",              // initials shown when no image is supplied
    image: "/images/committee/niyoma.jpg",  // ← optional; relative to /public
  },
  // … more members
];
```

### Adding a photo

1. Place the photo in `/public/images/committee/` (the directory already exists).
2. Recommended size: **400 × 400 px**, square crop, JPEG or WebP.
3. Set the `image` field to `/images/committee/<filename>`.
4. If `image` is omitted or the path is wrong, the two-letter avatar initials fallback
   renders automatically.

---

## CSS Animation Reference

| Class / Keyframe | Purpose |
|---|---|
| `.committee-marquee-track` | Flex container; receives `committeeScroll` animation |
| `@keyframes committeeScroll` | `translateX(0) → translateX(-50%)` — 50 % because the member list is duplicated |
| `.committee-marquee-track.paused` | Sets `animation-play-state: paused` |
| `@keyframes glowSpin` | Rotates the conic-gradient border via `@property --angle` |
| `@keyframes pulseDot` | Opacity/scale pulse for the status dot and badge dot |

Scroll speed is controlled by the `animation` duration on `.committee-marquee-track`:

```css
/* Slower = larger number */
animation: committeeScroll 40s linear infinite;
```

---

## Placement in Page

`src/app/page.tsx` renders the section between `<Partners />` and `<Faq />`:

```tsx
<Partners />
<OrganizingCommittee />   {/* ← here */}
<Faq />
```

The section is accessible via the nav anchor `#committee`.

---

## Accessibility Notes

- The marquee pauses on hover, satisfying WCAG 2.1 SC 2.2.2 (Pause, Stop, Hide).
- Email links use `href="mailto:…"` for native mail-client integration.
- Each card's ID badge and name provide clear identification without relying on colour alone.
