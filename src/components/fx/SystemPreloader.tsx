"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

const BOOT_LOG: { at: number; label: string }[] = [
  { at: 0, label: "ESTABLISHING DIVINE LINK" },
  { at: 22, label: "CONNECTING TO OLYMPUS PANTHEON LOG" },
  { at: 48, label: "SUMMONING THE NINE MUSES" },
  { at: 74, label: "UNSEALING THE TREASURY" },
  { at: 100, label: "ASCENT COMPLETE" },
];

/**
 * SystemPreloader
 * A fullscreen boot sequence that counts to 100% while cycling through a
 * mythic system log, then fades cleanly to reveal the site. Shows once per
 * browser session.
 */
export function SystemPreloader() {
  const [progress, setProgress] = React.useState(0);
  const [visible, setVisible] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    // Only run the boot sequence once per session.
    let alreadyBooted = false;
    try {
      alreadyBooted = sessionStorage.getItem("nova-booted") === "1";
    } catch {
      alreadyBooted = false;
    }

    if (alreadyBooted) {
      setVisible(false);
      return;
    }

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Lock scroll while booting.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let raf = 0;
    let current = 0;
    const step = prefersReduced ? 100 : 1.4;

    const tick = () => {
      // Ease-out: fast at the start, gentle as it approaches 100.
      const remaining = 100 - current;
      current += Math.max(step, remaining * 0.045);
      if (current >= 100) {
        current = 100;
        setProgress(100);
        window.setTimeout(() => {
          try {
            sessionStorage.setItem("nova-booted", "1");
          } catch {
            /* ignore */
          }
          setVisible(false);
        }, prefersReduced ? 100 : 480);
        return;
      }
      setProgress(current);
      raf = window.requestAnimationFrame(tick);
    };

    const startDelay = window.setTimeout(() => {
      raf = window.requestAnimationFrame(tick);
    }, prefersReduced ? 0 : 220);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(startDelay);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Restore scroll once the overlay is dismissed.
  React.useEffect(() => {
    if (!visible) {
      document.body.style.overflow = "";
    }
  }, [visible]);

  const rounded = Math.round(progress);
  const activeLog =
    [...BOOT_LOG].reverse().find((l) => rounded >= l.at) ?? BOOT_LOG[0];

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="nova-preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#001233]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          role="status"
          aria-live="polite"
          aria-label="Loading Project Nova"
        >
          {/* ambient gold aura */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-[90px]"
            style={{
              background:
                "radial-gradient(circle, rgba(255,184,27,0.18) 0%, rgba(0,53,153,0.12) 45%, transparent 70%)",
            }}
          />

          <motion.div
            className="relative flex flex-col items-center px-6 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Olympian emblem */}
            <div className="relative mb-8 flex h-20 w-20 items-center justify-center">
              <span className="absolute inset-0 animate-[pulseGlow_3s_ease-in-out_infinite] rounded-full border border-[#ffb81b]/40" />
              <span className="absolute inset-2 rounded-full border border-[#ffb81b]/15" />
              <span className="font-cinzel text-4xl font-bold text-[#ffb81b]">
                Ω
              </span>
            </div>

            <div className="font-cinzel text-2xl font-bold tracking-[0.35em] text-[#f7fafc] sm:text-3xl">
              PROJECT&nbsp;NOVA
            </div>
            <div className="mt-2 font-space text-[10px] font-semibold uppercase tracking-[0.5em] text-[#ffb81b]/80">
              Ascend to Olympus
            </div>

            {/* boot log line */}
            <div className="mt-10 h-5 font-space text-[11px] font-medium uppercase tracking-[0.25em] text-[#cbd5e0]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeLog.label}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="inline-flex items-center gap-2"
                >
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#ffb81b]" />
                  {activeLog.label}
                  <span className="text-[#ffb81b]/70">
                    {rounded < 100 ? "…" : ""}
                  </span>
                </motion.span>
              </AnimatePresence>
            </div>

            {/* progress rail */}
            <div className="mt-6 flex w-[72vw] max-w-sm items-center gap-4">
              <div className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-[#003599]/40">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${progress}%`,
                    background:
                      "linear-gradient(90deg, #e0a015 0%, #ffb81b 60%, #ffe9a8 100%)",
                    boxShadow: "0 0 12px rgba(255,184,27,0.6)",
                  }}
                />
              </div>
              <span className="w-12 text-right font-space text-sm font-bold tabular-nums text-[#f7fafc]">
                {rounded}%
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SystemPreloader;
