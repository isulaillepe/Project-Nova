"use client";

import React from "react";

// --- High-Fidelity Brand Logos as Inline Components (Scaled Up) ---

const OmniAI = () => (
  <div className="flex items-center gap-1.5 font-space text-2xl sm:text-3xl select-none shrink-0 px-6">
    <span className="font-light text-slate-400">Omni</span>
    <span className="font-extrabold text-[#FF5533]">AI</span>
  </div>
);

const CreativeSoftware = () => (
  <div className="flex items-center gap-3 select-none shrink-0 px-6">
    <svg className="w-8 h-8 text-[#E91E63]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.5 18.5V5.5L16.5 12L3.5 18.5Z" />
      <path d="M7.5 18.5L20.5 12L16.5 12L3.5 18.5H7.5Z" opacity="0.5" />
    </svg>
    <span className="font-sans font-bold text-white text-lg sm:text-xl tracking-tight">
      Creative <span className="text-[#E91E63] font-semibold">Software</span>
    </span>
  </div>
);

const WSO2 = () => (
  <div className="flex items-center gap-3 select-none shrink-0 px-6">
    <svg className="w-8 h-8 text-[#F47B20]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 12h2.5l1.5-3 2 6 1.5-3H17" />
    </svg>
    <span className="font-space font-extrabold text-[#F47B20] text-xl sm:text-2xl tracking-tight">WSO2</span>
  </div>
);

const Belta = () => (
  <div className="flex items-center justify-center select-none shrink-0 px-8 py-2 bg-[#A81F26] border border-white/20 rounded-full shadow-[0_0_15px_rgba(168,31,38,0.3)]">
    <span className="font-serif font-extrabold text-white text-sm sm:text-base tracking-[0.2em]">BELTA</span>
  </div>
);

const Lenichat = () => (
  <div className="flex items-center gap-2 select-none shrink-0 px-6">
    <svg className="w-7 h-7 text-[#D946EF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
      <circle cx="12" cy="10" r="1.5" fill="currentColor" />
      <circle cx="15" cy="10" r="1.5" fill="currentColor" />
    </svg>
    <span className="font-space font-bold text-[#D946EF] text-lg sm:text-xl">lenichat</span>
  </div>
);

const Dilexus = () => (
  <div className="flex items-center gap-2.5 select-none shrink-0 px-6">
    <svg className="w-7 h-7 text-[#8B5CF6]" viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="2" width="5" height="5" />
      <rect x="9" y="2" width="5" height="5" />
      <rect x="16" y="2" width="5" height="5" />
      <rect x="16" y="9" width="5" height="5" />
      <rect x="16" y="16" width="5" height="5" />
      <rect x="9" y="16" width="5" height="5" />
      <rect x="2" y="16" width="5" height="5" />
      <rect x="2" y="9" width="5" height="5" />
    </svg>
    <span className="font-space font-bold text-white text-base sm:text-lg tracking-[0.25em] uppercase">Dilexus</span>
  </div>
);

const ProductTavern = () => (
  <div className="flex items-center select-none shrink-0 bg-white/95 border-2 border-slate-300 rounded-md px-4 py-1 font-sans text-xs sm:text-sm h-8 sm:h-9">
    <span className="font-light text-slate-800 pr-1.5">product</span>
    <span className="font-extrabold text-slate-900 bg-[#EAB308]/90 px-1.5 py-0.5 rounded-sm">tavern</span>
  </div>
);

const USJ = () => (
  <div className="flex items-center gap-3 select-none shrink-0 bg-white/5 border-2 border-white/10 px-5 py-2 rounded-xl">
    <svg className="w-7 h-7 text-[#003599]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" />
      <path d="M12 7l1.5 3h3.5l-2.5 2 1 3.5-3.5-2-3.5 2 1-3.5-2.5-2h3.5z" fill="white" />
    </svg>
    <div className="flex flex-col text-left font-space leading-tight">
      <span className="text-[11px] font-black text-white tracking-wider">UNIVERSITY OF</span>
      <span className="text-[9px] font-bold text-slate-400">SRI JAYEWARDENEPURA</span>
    </div>
  </div>
);

// --- Row 2 Logos (Scaled Up) ---

const GenerationAlpha = () => (
  <div className="flex flex-col text-left font-sans select-none shrink-0 px-6">
    <span className="font-black text-white text-sm sm:text-base tracking-widest">GENERATION ALPHA</span>
    <span className="font-light text-slate-500 text-[8px] sm:text-[9px] tracking-[0.25em] mt-1">FOR A BETTER TOMORROW</span>
  </div>
);

const Zone247 = () => (
  <div className="flex items-center gap-1.5 select-none font-space text-lg sm:text-xl shrink-0 px-6">
    <span className="font-extrabold text-white">ZONE</span>
    <span className="font-light text-slate-400">24x7</span>
  </div>
);

const Kotmale = () => (
  <div className="flex items-center gap-2.5 select-none shrink-0 bg-[#0F2D6B] border-2 border-blue-500/25 px-5 py-2 rounded-full shadow-[0_0_15px_rgba(15,45,107,0.4)]">
    <div className="w-4 h-4 rounded-full bg-emerald-500/25 border border-emerald-400 flex items-center justify-center">
      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
    </div>
    <span className="font-serif font-black text-white text-sm sm:text-base tracking-wide">Kotmale</span>
  </div>
);

const BuildClub = () => (
  <div className="flex items-center gap-2.5 select-none shrink-0 px-6">
    <div className="flex gap-1">
      <span className="w-5 h-5 rounded-full bg-blue-500/30 border-2 border-blue-500 flex items-center justify-center text-[10px] font-bold text-blue-300">+</span>
      <span className="w-5 h-5 rounded-full bg-purple-500/30 border-2 border-purple-500 flex items-center justify-center text-[10px] font-bold text-purple-300">x</span>
      <span className="w-5 h-5 rounded-full bg-orange-500/30 border-2 border-orange-500 flex items-center justify-center text-[10px] font-bold text-orange-300">o</span>
    </div>
    <span className="font-space font-extrabold text-white text-sm sm:text-base tracking-tight">BUILD CLUB</span>
  </div>
);

const CeylonToday = () => (
  <div className="flex flex-col items-center select-none shrink-0 px-4">
    <div className="bg-[#0284C7]/90 px-4 py-1.5 text-center border-2 border-[#0284C7]/20 rounded-md">
      <span className="font-sans font-black text-white text-xs sm:text-sm tracking-widest">CEYLON TODAY</span>
    </div>
    <span className="text-[7px] sm:text-[8px] font-bold text-[#F97316] tracking-widest mt-1.5 font-space">PRINT MEDIA PARTNER</span>
  </div>
);

const SinhalaSponsor = () => (
  <div className="flex items-center gap-2 select-none shrink-0 bg-white/5 border-2 border-white/10 px-5 py-2 rounded-xl">
    <div className="grid grid-cols-2 gap-1">
      <div className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" />
      <div className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
      <div className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
      <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
    </div>
    <span className="text-xs sm:text-sm font-black text-slate-300 font-sans leading-none">හෙළ යුගය</span>
  </div>
);

const HackathonsLk = () => (
  <div className="flex items-center select-none shrink-0 font-sans text-sm sm:text-base px-6">
    <span className="font-black text-white">HackAthons</span>
    <span className="bg-[#06B6D4] text-slate-950 font-bold px-1.5 py-0.5 rounded-sm ml-1 text-[11px] sm:text-xs">.lk</span>
  </div>
);

const UniversityCap = () => (
  <div className="flex items-center select-none shrink-0 bg-[#0F172A] border-2 border-white/15 p-2 rounded-xl">
    <svg className="w-6 h-6 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 1.5 2 2.5 6 2.5s6-1 6-2.5v-5" />
    </svg>
  </div>
);

// --- Row 3 Logos (Scaled Up) ---

const AIESECUSJ = () => (
  <div className="flex items-center gap-2 select-none shrink-0 px-6">
    <div className="w-5 h-5 rounded-full bg-[#007FC6] flex items-center justify-center text-[10px] font-black text-white">A</div>
    <span className="font-space font-extrabold text-blue-300 text-xs tracking-[0.25em]">AIESEC IN USJ</span>
  </div>
);

const AIESECFoundation = () => (
  <div className="flex items-center gap-2 select-none shrink-0 bg-white/5 border-2 border-white/10 px-5 py-2.5 rounded-xl">
    <span className="font-sans font-black text-[#007FC6] text-sm">AIESEC</span>
    <span className="text-[10px] font-bold text-white tracking-[0.25em] font-space border-l-2 border-white/20 pl-2 uppercase">Lanka</span>
  </div>
);

const LOLC = () => (
  <div className="flex items-center select-none shrink-0 bg-[#0A5A9C] px-5 py-1.5 border-2 border-white/15 rounded-md shadow-[0_0_15px_rgba(10,90,156,0.3)]">
    <span className="font-sans font-black text-white text-sm sm:text-base tracking-[0.15em]">LOLC</span>
  </div>
);

const ELearningLk = () => (
  <div className="flex items-center select-none shrink-0 bg-white border-2 border-slate-300 px-4 py-1 rounded-md font-sans text-xs sm:text-sm">
    <span className="font-light text-rose-600 font-black text-sm">e</span>
    <span className="font-extrabold text-slate-900 pl-0.5">Learning.lk</span>
  </div>
);

const PearlBay = () => (
  <div className="flex items-center gap-1.5 select-none shrink-0 px-6">
    <span className="font-serif italic font-black text-[#F43F5E] text-lg sm:text-xl">Pearl</span>
    <span className="font-serif italic font-extrabold text-[#06B6D4] text-lg sm:text-xl">Bay</span>
  </div>
);

const LankanAngelNetwork = () => (
  <div className="flex items-center gap-2 select-none shrink-0 font-sans text-xs px-6">
    <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 22h20L12 2zm0 3.5l6.5 13H5.5L12 5.5z" />
    </svg>
    <span className="font-extrabold text-slate-200 tracking-wider">Lankan Angel Network</span>
  </div>
);

const MediaSocietyUSJ = () => (
  <div className="flex items-center gap-2 select-none shrink-0 font-sans text-xs font-bold text-slate-300 uppercase tracking-widest bg-white/5 border-2 border-white/10 px-4 py-2 rounded-lg">
    <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
    <span>Media Unit of USJ</span>
  </div>
);

const Cicada = () => (
  <div className="flex flex-col items-center select-none shrink-0 font-serif text-xs px-6">
    <span className="font-black tracking-[0.25em] text-slate-300">CICADA</span>
    <span className="text-[7px] tracking-widest text-slate-500 font-sans mt-0.5">ESTD 2020</span>
  </div>
);

// --- Marquee Row Component ---

interface MarqueeRowProps {
  children: React.ReactNode[];
  direction: "left" | "right";
  speed?: number;
}

function MarqueeRow({ children, direction, speed = 35 }: MarqueeRowProps) {
  const directionClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";
  return (
    <div className="relative flex overflow-hidden w-full select-none marquee-row bg-black/20">
      <div 
        className={`flex items-center gap-16 sm:gap-24 min-w-full shrink-0 ${directionClass} py-6 sm:py-8`}
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
      </div>
      <div 
        className={`flex items-center gap-16 sm:gap-24 min-w-full shrink-0 ${directionClass} py-6 sm:py-8`}
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
  const row1Items = [
    <OmniAI key="omniai" />,
    <CreativeSoftware key="creative" />,
    <WSO2 key="wso2" />,
    <Belta key="belta" />,
    <Lenichat key="lenichat" />,
    <Dilexus key="dilexus" />,
    <ProductTavern key="producttavern" />,
    <USJ key="usj" />,
  ];

  const row2Items = [
    <GenerationAlpha key="genalpha" />,
    <Zone247 key="zone247" />,
    <Kotmale key="kotmale" />,
    <BuildClub key="buildclub" />,
    <CeylonToday key="ceylontoday" />,
    <SinhalaSponsor key="sinhala" />,
    <HackathonsLk key="hackathons" />,
    <UniversityCap key="unicap" />,
  ];

  const row3Items = [
    <AIESECUSJ key="aiesecusj" />,
    <AIESECFoundation key="aiesecf" />,
    <LOLC key="lolc" />,
    <ELearningLk key="elearning" />,
    <PearlBay key="pearlbay" />,
    <LankanAngelNetwork key="lankanangel" />,
    <MediaSocietyUSJ key="mediasocusj" />,
    <Cicada key="cicada" />,
  ];

  return (
    <section 
      id="partners" 
      className="relative bg-black py-32 sm:py-48 overflow-hidden border-t border-white/5"
    >
      {/* Background radial highlight */}
      <div className="absolute inset-0 -z-10 overflow-hidden select-none pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#FF5533]/5 blur-[140px]" />
      </div>

      {/* Header (Centered) */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24">
        {/* Section Heading */}
        <div className="text-center space-y-3 select-none">
          <span className="text-[#FF5533] text-[11px] font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5533] shadow-[0_0_8px_#FF5533]" />
            BACKED BY THE BEST
          </span>
          <h2 className="text-4xl sm:text-6xl font-light tracking-tight leading-none text-white font-space uppercase">
            <span
              className="font-extrabold"
              style={{ WebkitTextStroke: "1px rgba(255, 255, 255, 0.4)", color: "transparent" }}
            >
              OUR
            </span>{" "}
            <span className="font-cormorant italic text-white font-medium lowercase">Partners</span>
          </h2>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest block font-space pt-2">
            THE ORGANIZATIONS POWERING PROJECT NOVA
          </span>
        </div>
      </div>

      {/* Carousel Tracks Wrapper - Spans full width edge-to-edge */}
      <div className="flex flex-col gap-8 sm:gap-12 relative w-full overflow-hidden">
        <MarqueeRow direction="left" speed={30}>
          {row1Items}
        </MarqueeRow>
        
        <MarqueeRow direction="right" speed={35}>
          {row2Items}
        </MarqueeRow>
        
        <MarqueeRow direction="left" speed={32}>
          {row3Items}
        </MarqueeRow>
      </div>
    </section>
  );
}