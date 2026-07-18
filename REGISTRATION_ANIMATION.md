# Registration Scroll Transition & Pinned Animation

This document details the design and implementation of the interactive, scroll-pinned transition between the **Frequently Asked Questions (FAQ)** section and the **Register Now** CTA screen on the Project Nova homepage.

## Animation Mechanics

The transition uses a native scroll-pinning layout built with CSS `sticky` positioning and Framer Motion's `useScroll` hook. This approach ensures maximum performance, smooth animations, and perfect touch support on mobile devices.

### 1. Scroll-Pinning Container
- The section wrapper (`#faq`) has a height of `380vh`.
- The inner container has the classes `sticky top-0 h-screen w-full overflow-hidden`.
- As the user scrolls through the `380vh` range, the viewport remains pinned to this section. The scrolling progress is converted into `scrollYProgress` (ranging from `0.0` to `1.0`).

### 2. Transition Progression Timeline

The animation transitions smoothly across five distinct phases based on `scrollYProgress`:

| Scroll Progress Range | Active Phase & Visual Changes |
| :--- | :--- |
| **`0.00` – `0.25`** | **FAQ View Active**: FAQ Accordions are fully interactive. FAQ header is at 100% opacity. |
| **`0.25` – `0.45`** | **FAQ Slide Out**: FAQ items slide off-screen left and right while fading to 0% opacity. FAQ Header fades to 0% opacity. |
| **`0.35` – `0.50`** | **Background Cross-Fade**: The default cosmic background (`cosmic_faq_bg.png`) fades out, and the custom Egyptian cosmic background (`egyptian_register_bg.png`) fades in. |
| **`0.55` – `0.75`** | **Register Fade In**: The "READY TO DIVE IN?" header and "REGISTER NOW" button fade in from 0% to 100% opacity, sliding up from `30px` to `0px`. |
| **`0.75` – `0.95`** | **Register Active**: The Register screen remains at 100% opacity. The "REGISTER NOW" button is fully interactive (with hover glow and active scaling). |
| **`0.95` – `1.00`** | **Section Exit**: The page smoothly unpins and allows the user to scroll down to the footer. |


