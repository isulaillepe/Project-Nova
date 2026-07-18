# Partner Carousel Component Documentation

We have updated the partner marquee carousel to match the CodeSprint 11 styling. It is located at `src/components/sections/Partners.tsx`.

## Key Features

1. **Three Alternating Rows**:
   - Row 1 moves to the left (speeds: `30s` scroll loop).
   - Row 2 moves to the right (speeds: `35s` scroll loop).
   - Row 3 moves to the left (speeds: `32s` scroll loop).
2. **Hover Pause Behavior**:
   - Hovering anywhere within the carousel track container pauses all rows simultaneously.
   - Moving the cursor away resumes scrolling automatically.
3. **High-Fidelity SVG Logos**:
   - Custom inline SVG definitions for WSO2, Creative Software, Belta, lenichat, Dilexus, product tavern, Kotmale, Ceylon Today, LOLC, HackAthons.lk, Lankan Angel Network, IEEE Foundation, and other brands.
4. **Header Styling**:
   - Glowing bullet point indicator (`BACKED BY THE BEST`).
   - Calligraphic serif styling for `OUR Partners` (matching Cormorant and Space Grotesk fonts).

## Styling & Animations

The animations are defined in `src/app/globals.css`:

```css
@keyframes marquee-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee-left {
  animation: marquee-left 40s linear infinite;
}

@keyframes marquee-right {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}

.animate-marquee-right {
  animation: marquee-right 40s linear infinite;
}
```

The hover pause effect uses the tailwind utility class group-hover pause on each marquee track wrapper:
```tsx
<div className="group flex flex-col gap-6 relative w-full overflow-hidden">
  {/* The child rows respond to parent group hover to pause their animation */}
  <div className="group-hover:[animation-play-state:paused] ...">
    ...
  </div>
</div>
```
