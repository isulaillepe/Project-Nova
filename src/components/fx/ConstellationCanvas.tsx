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
  const mountedRef = React.useRef(false);
  const rafRef = React.useRef<number | null>(null);
  const gradientCacheRef = React.useRef<Map<number, CanvasGradient>>(new Map());

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Guard against StrictMode double-invoke: only run once per mount
    if (mountedRef.current) return;
    mountedRef.current = true;

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
      // Precomputed grid cell for spatial partitioning
      gridX: number;
      gridY: number;
    };

    let stars: Star[] = [];

    const GOLD = "255, 184, 27";
    const LINK_DISTANCE = 130;
    const LINK_DISTANCE_SQ = LINK_DISTANCE * LINK_DISTANCE;
    // Grid cell size = link distance, so we only check adjacent cells
    const CELL_SIZE = LINK_DISTANCE;

    const seed = (seedX: number) => {
      // deterministic pseudo-random so SSR/first paint stays stable-ish
      const s = Math.sin(seedX) * 10000;
      return s - Math.floor(s);
    };

    const getOrCreateGradient = (radius: number): CanvasGradient => {
      const key = Math.round(radius);
      let gradient = gradientCacheRef.current.get(key);
      if (!gradient) {
        gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 4);
        gradient.addColorStop(0, `rgba(${GOLD}, 1)`);
        gradient.addColorStop(0.4, `rgba(${GOLD}, 0.35)`);
        gradient.addColorStop(1, `rgba(${GOLD}, 0)`);
        gradientCacheRef.current.set(key, gradient);
      }
      return gradient;
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

      const isMobileDevice = width < 768;
      // Reduced star count on mobile to conserve GPU memory and heat
      const count = isMobileDevice ? 25 : Math.min(80, Math.floor((width * height) / 18000));
      stars = Array.from({ length: count }, (_, i) => {
        const a = seed(i + 1);
        const b = seed(i + 100.5);
        const c = seed(i + 200.25);
        const d = seed(i + 300.75);
        const r = 0.5 + seed(i + 400.1) * 1.5;
        const x = a * width;
        const y = b * height;
        return {
          x,
          y,
          vx: (c - 0.5) * 0.08,
          vy: (d - 0.5) * 0.08,
          r,
          twinklePhase: seed(i + 500.3) * Math.PI * 2,
          twinkleSpeed: 0.005 + seed(i + 600.9) * 0.015,
          gridX: Math.floor(x / CELL_SIZE),
          gridY: Math.floor(y / CELL_SIZE),
        };
      });
    };

    const drawStar = (star: Star, alpha: number) => {
      const gradient = getOrCreateGradient(star.r);
      ctx.save();
      ctx.translate(star.x, star.y);
      ctx.fillStyle = gradient;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(0, 0, star.r * 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.fillStyle = `rgba(255, 233, 168, ${Math.min(1, alpha + 0.2)})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r * 0.6, 0, Math.PI * 2);
      ctx.fill();
    };

    // Build spatial grid for O(n) neighbor lookup
    const buildGrid = (): Map<string, Star[]> => {
      const grid = new Map<string, Star[]>();
      for (const star of stars) {
        const key = `${star.gridX},${star.gridY}`;
        const cell = grid.get(key);
        if (cell) cell.push(star);
        else grid.set(key, [star]);
      }
      return grid;
    };

    const render = () => {
      if (!mountedRef.current) return;
      ctx.clearRect(0, 0, width, height);

      const grid = buildGrid();

      for (const star of stars) {
        for (let gx = star.gridX - 1; gx <= star.gridX + 1; gx++) {
          for (let gy = star.gridY - 1; gy <= star.gridY + 1; gy++) {
            const cell = grid.get(`${gx},${gy}`);
            if (!cell) continue;
            for (const other of cell) {
              if (other === star) continue;
              if (star.twinklePhase > other.twinklePhase) continue;

              const dx = star.x - other.x;
              const dy = star.y - other.y;
              const distSq = dx * dx + dy * dy;
              if (distSq < LINK_DISTANCE_SQ) {
                const dist = Math.sqrt(distSq);
                const a = (1 - dist / LINK_DISTANCE) * 0.1;
                ctx.strokeStyle = `rgba(${GOLD}, ${a})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(star.x, star.y);
                ctx.lineTo(other.x, other.y);
                ctx.stroke();
              }
            }
          }
        }
      }

      for (const star of stars) {
        star.twinklePhase += star.twinkleSpeed;
        const alpha = 0.35 + (Math.sin(star.twinklePhase) + 1) * 0.25;
        drawStar(star, alpha);

        star.x += star.vx;
        star.y += star.vy;

        if (star.x < -10) star.x = width + 10;
        if (star.x > width + 10) star.x = -10;
        if (star.y < -10) star.y = height + 10;
        if (star.y > height + 10) star.y = -10;

        star.gridX = Math.floor(star.x / CELL_SIZE);
        star.gridY = Math.floor(star.y / CELL_SIZE);
      }
    };

    const isMobile = window.innerWidth < 768;

    const loop = () => {
      if (!mountedRef.current) return;
      render();
      if (!isMobile && !document.hidden) {
        rafRef.current = window.requestAnimationFrame(loop);
      }
    };

    build();

    if (prefersReduced || isMobile) {
      render(); // Single static render on mobile to preserve GPU & battery
    } else {
      loop();
    }

    const handleVisibility = () => {
      if (document.hidden && rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else if (!document.hidden && !isMobile && !prefersReduced) {
        loop();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    let resizeTimer: number;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (mountedRef.current) {
          build();
          if (prefersReduced || window.innerWidth < 768) {
            render();
          }
        }
      }, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      mountedRef.current = false;
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      gradientCacheRef.current.clear();
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
