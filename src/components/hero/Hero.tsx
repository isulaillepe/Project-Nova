"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useScroll, useTransform, motion } from "framer-motion";

const tickerItems = [
  "CREWS REACH THE FINALE",
  "LIFTOFF · 11 JULY",
  "DHPL AUDITORIUM — COLOMBO",
  "6.93° N / 79.85° E",
  "LIVE INVESTOR PANEL",
  "MISSION NOVA · PROJECT NOVA",
  "INTER-UNIVERSITY"
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress of the Hero container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 1. Background image zoom out: from 4.5x zoom (black visor) down to 1.0x standard size
  const bgScale = useTransform(scrollYProgress, [0, 0.45], [4.5, 1.0]);

  // 2. Flying center logo animation to top-left header position
  const logoY = useTransform(scrollYProgress, [0, 0.45], ["0%", "-42vh"]);
  const logoX = useTransform(scrollYProgress, [0, 0.45], ["0%", "-37vw"]);
  const logoScale = useTransform(scrollYProgress, [0, 0.45], [1.8, 1.0]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.42, 0.46], [1.0, 1.0, 0.0]);

  // 3. Scroll Down indicator opacity: fades out quickly
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1.0, 0.0]);

  // 4. Hero text content fade-in and slide-up
  const contentOpacity = useTransform(scrollYProgress, [0.32, 0.48], [0.0, 1.0]);
  const contentY = useTransform(scrollYProgress, [0.32, 0.48], [30, 0]);

  // 5. Bottom marquee ticker fade-in
  const tickerOpacity = useTransform(scrollYProgress, [0.38, 0.50], [0.0, 1.0]);

  return (
    <div ref={containerRef} className="relative h-[180vh] bg-slate-950">
      
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-24 select-none">
        
        {/* Zooming Astronaut Background Image */}
        <motion.div 
          style={{ 
            scale: bgScale,
            backgroundImage: "url('/images/astronaut_hero_bg.png')"
          }}
          className="absolute inset-0 bg-cover bg-center z-0 origin-center"
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/65 to-transparent z-0 pointer-events-none" />
        <div className="absolute right-0 top-0 w-full md:w-[60%] h-full bg-[radial-gradient(circle_at_75%_25%,rgba(255,85,51,0.14)_0%,transparent_60%)] z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-950 to-transparent z-0 pointer-events-none" />

        {/* Flying centered logo for intro effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <motion.div 
            style={{
              x: logoX,
              y: logoY,
              scale: logoScale,
              opacity: logoOpacity
            }}
            className="border-y border-white/10 px-5 py-1.5 font-space font-extrabold tracking-widest text-sm uppercase select-none relative bg-slate-950/25 backdrop-blur-[2px]"
          >
            {/* Left bracket corners */}
            <div className="absolute left-0 top-0 bottom-0 w-2 border-y border-l border-white/20" />
            {/* Right bracket corners */}
            <div className="absolute right-0 top-0 bottom-0 w-2 border-y border-r border-white/20" />
            <span className="text-white">PROJECT</span>
            <span className="text-[#FF5533] ml-1.5">NOVA</span>
          </motion.div>
        </div>

        {/* Bouncing Scroll Down Indicator */}
        <motion.div 
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 text-center font-space"
        >
          <span className="text-[10px] font-bold text-[#FF5533] uppercase tracking-[0.3em] animate-pulse">
            SCROLL DOWN
          </span>
          <div className="w-6 h-10 border border-white/20 rounded-full flex justify-center p-1.5 bg-slate-950/20 backdrop-blur-[1px]">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF5533] animate-scroll-wheel" />
          </div>
        </motion.div>

        {/* Hero Left-Aligned Content Container */}
        <motion.div 
          style={{ 
            opacity: contentOpacity,
            y: contentY
          }}
          className="max-w-4xl space-y-6 z-10 text-left pl-2 sm:pl-4"
        >
          {/* Mission tag */}
          <div className="flex items-center gap-2 font-space text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#FF5533] shadow-[0_0_8px_#FF5533]" />
            MISSION NOVA — AIESEC IN UNIVERSITY OF SRI JAYEWARDENEPURA
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-7xl md:text-8xl tracking-tight leading-[1.05] font-light text-white font-space">
            From <span className="font-extrabold">Idea</span> <br />
            to <span className="font-cormorant italic text-[#FF7043] font-medium pr-1">Orbit</span>
            <span className="text-[#FF5533] font-extrabold font-space">.</span>
          </h1>

          {/* Description */}
          <p className="text-slate-300 font-space font-medium text-sm sm:text-base max-w-[540px] leading-relaxed text-left opacity-90">
            Sri Lanka&apos;s premier inter-university startup competition — 
            student crews engineer raw ideas into launch-ready ventures and pitch live to real investors.
          </p>

          {/* Actions Row */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-6">
            <Link href="/execution-booklet">
              <button className="group relative skewed-btn bg-[#FF5533] hover:bg-[#e04422] text-white text-[11px] sm:text-xs font-bold uppercase tracking-widest px-8 py-4 shadow-[0_4px_20px_rgba(255,85,51,0.25)] transition-all duration-300">
                <span className="skewed-btn-inner flex items-center gap-2">
                  EXECUTION BOOKLET <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </Link>

            {/* Vertical Separator */}
            <div className="h-10 w-[1px] bg-white/15 hidden sm:block" />

            {/* T-Minus details */}
            <div className="flex flex-col text-left justify-center font-space">
              <span className="text-[#FF5533] text-[9px] font-bold tracking-[0.2em] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF5533]" /> GRAND FINALE • T-MINUS
              </span>
              <span className="font-cormorant italic text-[#FF7043] text-lg sm:text-xl font-medium mt-0.5 leading-none">
                We Have Liftoff
              </span>
            </div>
          </div>
        </motion.div>

        {/* Infinite Scroll Ticker */}
        <motion.div 
          style={{ opacity: tickerOpacity }}
          className="absolute bottom-0 left-0 right-0 border-y border-white/5 bg-slate-950/65 backdrop-blur-md py-3 overflow-hidden font-space select-none z-10"
        >
          <div className="flex w-max items-center animate-scroll whitespace-nowrap">
            {Array(2).fill(tickerItems).flat().map((item, index) => (
              <div key={index} className="flex items-center gap-8 mx-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  {item}
                </span>
                <span className="text-[#FF5533] text-[11px] font-bold font-space">+</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}