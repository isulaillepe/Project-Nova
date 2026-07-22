"use client";

import * as React from "react";

/**
 * ConstellationCanvas
 * A delicate, slow-moving field of glowing golden stars drifting behind the
 * layout — the night sky over Olympus. Nearby stars link with faint gold
 * threads to suggest constellations. Honors prefers-reduced-motion by drawing
 * a single static frame.
 */
export function ConstellationCanvas() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;

    type Star = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      twinklePhase: number;
      twinkleSpeed: number;
    };

    let stars: Star[] = [];

    const GOLD = "255, 184, 27";
    const LINK_DISTANCE = 130;

    const seed = (seedX: number) => {
      // deterministic pseudo-random so SSR/first paint stays stable-ish
      const s = Math.sin(seedX) * 10000;
      return s - Math.floor(s);
    };

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // density scales with area but stays gentle
      const count = Math.min(150, Math.floor((width * height) / 12000));
      stars = Array.from({ length: count }, (_, i) => {
        const a = seed(i + 1);
        const b = seed(i + 100.5);
        const c = seed(i + 200.25);
        const d = seed(i + 300.75);
        return {
          x: a * width,
          y: b * height,
          vx: (c - 0.5) * 0.12,
          vy: (d - 0.5) * 0.12,
          r: 0.5 + seed(i + 400.1) * 1.6,
          twinklePhase: seed(i + 500.3) * Math.PI * 2,
          twinkleSpeed: 0.008 + seed(i + 600.9) * 0.02,
        };
      });
    };

    const drawStar = (star: Star, alpha: number) => {
      const glow = ctx.createRadialGradient(
        star.x,
        star.y,
        0,
        star.x,
        star.y,
        star.r * 4
      );
      glow.addColorStop(0, `rgba(${GOLD}, ${alpha})`);
      glow.addColorStop(0.4, `rgba(${GOLD}, ${alpha * 0.35})`);
      glow.addColorStop(1, `rgba(${GOLD}, 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r * 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255, 233, 168, ${Math.min(1, alpha + 0.2)})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r * 0.6, 0, Math.PI * 2);
      ctx.fill();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // faint constellation threads
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DISTANCE) {
            const a = (1 - dist / LINK_DISTANCE) * 0.12;
            ctx.strokeStyle = `rgba(${GOLD}, ${a})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }

      for (const star of stars) {
        star.twinklePhase += star.twinkleSpeed;
        const alpha = 0.35 + (Math.sin(star.twinklePhase) + 1) * 0.28;
        drawStar(star, alpha);

        star.x += star.vx;
        star.y += star.vy;

        // wrap around edges for an endless sky
        if (star.x < -10) star.x = width + 10;
        if (star.x > width + 10) star.x = -10;
        if (star.y < -10) star.y = height + 10;
        if (star.y > height + 10) star.y = -10;
      }
    };

    let raf = 0;
    const loop = () => {
      render();
      raf = window.requestAnimationFrame(loop);
    };

    build();

    if (prefersReduced) {
      render();
    } else {
      loop();
    }

    let resizeTimer: number;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        build();
        if (prefersReduced) render();
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}

export default ConstellationCanvas;
