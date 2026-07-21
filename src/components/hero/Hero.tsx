"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useScroll, useTransform, motion } from "framer-motion";

const tickerItems = [
  "ASCEND TO OLYMPUS",
  "GRAND FINALE · 11 JULY",
  "DHPL AUDITORIUM — COLOMBO",
  "THE TREASURY AWAITS",
  "LKR 135,000 PRIZE POOL",
  "INTER-UNIVERSITY",
  "PROJECT NOVA · AIESEC USJ",
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Background image zoom out: from 4.5x zoom down to 1.0x standard size
  const bgScale = useTransform(scrollYProgress, [0, 0.45], [4.5, 1.0]);

  // Flying center emblem animation to top-left header position
  const logoY = useTransform(scrollYProgress, [0, 0.45], ["0%", "-42vh"]);
  const logoX = useTransform(scrollYProgress, [0, 0.45], ["0%", "-37vw"]);
  const logoScale = useTransform(scrollYProgress, [0, 0.45], [1.8, 1.0]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.42, 0.46], [1.0, 1.0, 0.0]);

  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1.0, 0.0]);

  const contentOpacity = useTransform(scrollYProgress, [0.32, 0.48], [0.0, 1.0]);
  const contentY = useTransform(scrollYProgress, [0.32, 0.48], [30, 0]);

  const tickerOpacity = useTransform(scrollYProgress, [0.38, 0.5], [0.0, 1.0]);

  return (
    <div ref={containerRef} className="relative h-[180vh] bg-[#001233]">
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-24 select-none">
        {/* Zooming Greek temple statue backdrop */}
        <motion.div
          style={{
            scale: bgScale,
            backgroundImage: "url('/images/astronaut_hero_bg.png')",
          }}
          className="absolute inset-0 bg-cover bg-center z-0 origin-center"
        />

        {/* Overlays for legibility and Olympus mood */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001233] via-[#001233]/70 to-transparent z-0 pointer-events-none" />
        <div className="absolute right-0 top-0 w-full md:w-[60%] h-full bg-[radial-gradient(circle_at_75%_25%,rgba(255,184,27,0.16)_0%,transparent_60%)] z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#001233] to-transparent z-0 pointer-events-none" />

        {/* Flying centered emblem for intro effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <motion.div
            style={{
              x: logoX,
              y: logoY,
              scale: logoScale,
              opacity: logoOpacity,
            }}
            className="border-y border-[#ffb81b]/30 px-5 py-1.5 font-cinzel font-bold tracking-[0.2em] text-sm uppercase select-none relative bg-[#001233]/30 backdrop-blur-[2px]"
          >
            <div className="absolute left-0 top-0 bottom-0 w-2 border-y border-l border-[#ffb81b]/40" />
            <div className="absolute right-0 top-0 bottom-0 w-2 border-y border-r border-[#ffb81b]/40" />
            <span className="text-[#f7fafc]">PROJECT</span>
            <span className="text-[#FFB81B] ml-1.5">NOVA</span>
          </motion.div>
        </div>

        {/* Bouncing Scroll Down Indicator */}
        <motion.div
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 text-center font-space"
        >
          <span className="text-[10px] font-bold text-[#FFB81B] uppercase tracking-[0.3em] animate-pulse">
            DESCEND
          </span>
          <div className="w-6 h-10 border border-[#ffb81b]/30 rounded-full flex justify-center p-1.5 bg-[#001233]/20 backdrop-blur-[1px]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ffb81b] animate-scroll-wheel" />
          </div>
        </motion.div>

        {/* Hero Left-Aligned Content Container */}
        <motion.div
          style={{
            opacity: contentOpacity,
            y: contentY,
          }}
          className="max-w-4xl space-y-6 z-10 text-left pl-2 sm:pl-4"
        >
          {/* Mission tag */}
          <div className="flex items-center gap-2 font-space text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#cbd5e0]">
            <span className="w-2 h-2 rounded-full bg-[#FFB81B] shadow-[0_0_8px_#FFB81B]" />
            PROJECT NOVA — AIESEC IN UNIVERSITY OF SRI JAYEWARDENEPURA
          </div>

          {/* Heading — luxury serif display */}
          <h1 className="display-serif text-5xl sm:text-7xl md:text-8xl text-[#f7fafc]">
            From <span className="font-bold">Mortal</span> <br />
            to <span className="text-gold-gradient font-semibold">Myth</span>
            <span className="text-[#FFB81B] font-bold">.</span>
          </h1>

          {/* Description */}
          <p className="font-space font-medium text-sm sm:text-base max-w-[540px] leading-relaxed text-left text-[#cbd5e0]/90">
            Sri Lanka&apos;s premier inter-university innovation trials — student
            crews forge raw ideas into immortal ventures and pitch them before the
            pantheon of live investors.
          </p>

          {/* Actions Row */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-6">
            <Link href="/register">
              <button className="group relative bg-[#FFB81B] hover:brightness-105 text-[#001233] text-[11px] sm:text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-full shadow-[0_4px_24px_rgba(255,184,27,0.3)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                <span className="flex items-center gap-2">
                  CLAIM YOUR PLACE
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>

            {/* Vertical Separator */}
            <div className="h-10 w-[1px] bg-[#003599]/60 hidden sm:block" />

            {/* Prize pool focus */}
            <div className="flex flex-col text-left justify-center font-space">
              <span className="text-[#FFB81B] text-[9px] font-bold tracking-[0.2em] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB81B]" /> THE TREASURY • PRIZE POOL
              </span>
              <span className="font-cinzel text-[#FFB81B] text-lg sm:text-xl font-bold mt-0.5 leading-none tracking-wide">
                LKR 135,000
              </span>
            </div>
          </div>
        </motion.div>

        {/* Infinite Scroll Ticker */}
        <motion.div
          style={{ opacity: tickerOpacity }}
          className="absolute bottom-0 left-0 right-0 border-y border-[#003599]/30 bg-[#001233]/65 backdrop-blur-md py-3 overflow-hidden font-space select-none z-10"
        >
          <div className="flex w-max items-center animate-scroll whitespace-nowrap">
            {Array(2).fill(tickerItems).flat().map((item, index) => (
              <div key={index} className="flex items-center gap-8 mx-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#cbd5e0]/70">
                  {item}
                </span>
                <span className="text-[#FFB81B] text-[11px] font-bold font-space">✦</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
