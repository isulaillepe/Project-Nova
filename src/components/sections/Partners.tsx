"use client";

import React from "react";

/* ─────────────────────────────────────────────
   Partner Logos Data
   Images located in: /public/images/parners
───────────────────────────────────────────── */

// Row 1 Partners (Active)
const PARTNERS_ROW_1 = [
  {
    id: "p1",
    name: "Baurs 125 Years",
    src: "/images/parners/Baurs with 125 logo (361U & Black RGB).png",
    className: "h-14 sm:h-16 w-auto max-w-[75%] object-contain filter contrast-105 transition-transform duration-300 group-hover:scale-105 shrink-0",
  },
  {
    id: "p2",
    name: "Emerald",
    src: "/images/parners/Emerald-New-Logo-LBN black.png",
  },
  {
    id: "p3",
    name: "Official Gift Partner",
    src: "/images/parners/Official Gift Partner.png",
    className: "h-14 sm:h-16 w-auto max-w-[75%] object-contain filter contrast-105 transition-transform duration-300 group-hover:scale-105 shrink-0",
  },
  {
    id: "p4",
    name: "Official Travel Partner",
    src: "/images/parners/Official Travel Partner.png",
    
  },
  {
    id: "p5",
    name: "Official Partner",
    src: "/images/parners/WhatsApp Image 2025-10-24 at 09.01.50_059e9044.jpg",
  },
  {
    id: "p6",
    name: "Ceylinco Life",
    src: "/images/parners/ceylife-logo-High-Res.png",
  },
  {
    id: "p7",
    name: "ReadAmaze",
    src: "/images/parners/readamaze-logo-dark.png",
  }, 
  {
    id: "p8",
    name: "Sweet Ant",
    src: "/images/parners/sweet_ant_logo.jpg",
    className: "h-14 sm:h-16 w-auto max-w-[100%] object-contain filter contrast-105 transition-transform duration-300 group-hover:scale-105 shrink-0",
  },
];

/* 
// Row 2 Partners (Future Placeholder - Add logos here when needed)
const PARTNERS_ROW_2 = [
  // { id: "p8", name: "Partner Name", src: "/images/parners/filename.png" },
];

// Row 3 Partners (Future Placeholder - Add logos here when needed)
const PARTNERS_ROW_3 = [
  // { id: "p9", name: "Partner Name", src: "/images/parners/filename.png" },
];
*/

function PartnerCard({ partner }: { partner: (typeof PARTNERS_ROW_1)[number] }) {
  return (
    <div className="flex items-center justify-center shrink-0 px-5 py-3 bg-white/95 backdrop-blur-md rounded-2xl border border-white/20 shadow-[0_4px_20px_rgba(255,255,255,0.06)] hover:scale-105 transition-all duration-300 h-20 sm:h-24 w-48 sm:w-60 group overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={partner.src}
        alt={partner.name}
        className={
          partner.className ||
          "h-12 sm:h-14 w-36 sm:w-44 object-contain filter contrast-105 transition-transform duration-300 group-hover:scale-105 shrink-0"
        }
      />
    </div>
  );
}

// --- Marquee Row Component ---

interface MarqueeRowProps {
  children: React.ReactNode[];
  direction: "left" | "right";
  speed?: number;
}

function MarqueeRow({ children, direction, speed = 25 }: MarqueeRowProps) {
  const directionClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";
  return (
    <div className="relative flex overflow-hidden w-full select-none marquee-row bg-black/20">
      <div
        className={`flex items-center gap-6 sm:gap-10 min-w-full shrink-0 ${directionClass} py-4 sm:py-6`}
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
      </div>
      <div
        className={`flex items-center gap-6 sm:gap-10 min-w-full shrink-0 ${directionClass} py-4 sm:py-6`}
        style={{ animationDuration: `${speed}s` }}
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  );
}

// --- Main Partners Section ---

export default function Partners() {
  const row1Items = [...PARTNERS_ROW_1, ...PARTNERS_ROW_1].map((p, idx) => (
    <PartnerCard key={`row1-${p.id}-${idx}`} partner={p} />
  ));

  /* 
  // Row 2 Items (Uncomment to enable Row 2)
  const row2Items = [...PARTNERS_ROW_2, ...PARTNERS_ROW_2].map((p, idx) => (
    <PartnerCard key={`row2-${p.id}-${idx}`} partner={p} />
  ));

  // Row 3 Items (Uncomment to enable Row 3)
  const row3Items = [...PARTNERS_ROW_3, ...PARTNERS_ROW_3].map((p, idx) => (
    <PartnerCard key={`row3-${p.id}-${idx}`} partner={p} />
  ));
  */

  return (
    <section
      id="partners"
      className="relative bg-black py-24 sm:py-36 overflow-hidden border-t border-white/5"
    >
      {/* Background radial highlight */}
      <div
        className="absolute inset-0 -z-10 overflow-hidden select-none pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#FFB81B]/5 blur-[140px]" />
      </div>

      {/* Header (Centered) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
        {/* Section Heading */}
        <div className="text-center space-y-3 select-none">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-none text-white font-space uppercase">
            <span
              className="font-extrabold"
              style={{ WebkitTextStroke: "1.5px #FFB81B", color: "transparent" }}
            >
              OUR LONG TERM
            </span>{" "}
            <span className="font-cormorant italic text-white font-medium lowercase">Partners</span>
          </h2>
          <div className="w-20 h-[3px] bg-gradient-to-r from-transparent via-[#FFB81B] to-transparent shadow-[0_0_12px_#FFB81B] rounded-full mx-auto mt-3" />
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest block font-space pt-2">
            THE ORGANIZATIONS POWERING PROJECT NOVA
          </span>
        </div>
      </div>

      {/* Carousel Tracks Wrapper - Spans full width edge-to-edge */}
      <div className="flex flex-col gap-6 sm:gap-8 relative w-full overflow-hidden">
        {/* ROW 1: Active Partner Logos */}
        <MarqueeRow direction="left" speed={25}>
          {row1Items}
        </MarqueeRow>

        {/* 
          ====================================================================
          ROW 2: Future Partner Logos (Commented out for future updates)
          To enable:
          1. Add logo objects to PARTNERS_ROW_2 above.
          2. Uncomment row2Items mapping and the <MarqueeRow> block below.
          ====================================================================
        */}
        {/* 
        <MarqueeRow direction="right" speed={30}>
          {[...row2Items, ...row2Items]}
        </MarqueeRow>
        */}

        {/* 
          ====================================================================
          ROW 3: Future Partner Logos (Commented out for future updates)
          To enable:
          1. Add logo objects to PARTNERS_ROW_3 above.
          2. Uncomment row3Items mapping and the <MarqueeRow> block below.
          ====================================================================
        */}
        {/* 
        <MarqueeRow direction="left" speed={32}>
          {[...row3Items, ...row3Items]}
        </MarqueeRow>
        */}
      </div>
    </section>
  );
}