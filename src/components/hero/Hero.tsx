"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { ArrowRight, GraduationCap, School } from "lucide-react";
import { useScroll, useTransform, motion } from "framer-motion";

const tickerItems = [
  "ASCEND TO OLYMPUS",
  "GRAND FINALE · 05 SEPTEMBER",
  "UNIVERSITY OF SRI JAYEWARDENEPURA",
  "TEAMS OF 4 TO 5 MEMBERS",
  "LKR 180,000 PRIZE POOL",
  "INTER-UNIVERSITY & SCHOOL",
  "PROJECT NOVA · AIESEC USJ",
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Background image parallax & zoom transformations matching Stats.tsx:
  // Starts with smooth focus scale (1.25 -> 1.05) during initial reveal (0 -> 0.45),
  // then transitions seamlessly into Stats parallax scale (1.05 -> 1.18) and Y offset (2% -> 18%) when scrolling down.
  const bgScale = useTransform(scrollYProgress, [0, 0.45, 1.0], [1.25, 1.05, 1.18]);
  const bgY = useTransform(scrollYProgress, [0, 0.45, 1.0], ["-2%", "2%", "18%"]);
  const bgFilter = useTransform(
    scrollYProgress,
    [0, 0.45, 1.0],
    ["brightness(0.85) contrast(1.05)", "brightness(0.75) contrast(1.0)", "brightness(0.65) contrast(0.95)"]
  );

  // Flying center emblem animation to top-left header position
  const logoY = useTransform(scrollYProgress, [0, 0.45], ["0%", "-42vh"]);
  const logoX = useTransform(scrollYProgress, [0, 0.45], ["0%", "-37vw"]);
  const logoScale = useTransform(scrollYProgress, [0, 0.45], [1.0, 1.0]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.42, 0.46], [1.0, 1.0, 0.0]);

  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1.0, 0.0]);

  // Hero Content Entrance & Scroll-Down Exit Animation
  const contentOpacity = useTransform(scrollYProgress, [0.32, 0.48, 0.72, 0.95], [0.0, 1.0, 1.0, 0.0]);
  const contentY = useTransform(scrollYProgress, [0.32, 0.48, 0.72, 0.95], [30, 0, 0, -40]);

  // Ticker Entrance & Scroll-Down Exit Animation
  const tickerOpacity = useTransform(scrollYProgress, [0.38, 0.5, 0.75, 0.95], [0.0, 1.0, 1.0, 0.0]);
  const tickerY = useTransform(scrollYProgress, [0.75, 0.95], [0, 20]);

  return (
    <div ref={containerRef} className="relative h-[180vh] bg-[#001233]">
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-24 select-none">
        {/* Parallax cosmic VR statue backdrop matching Stats.tsx */}
        <motion.div
          style={{
            scale: bgScale,
            y: bgY,
            filter: bgFilter,
            backgroundImage: "url('/images/vr_statue_bg.jpg')",
          }}
          className="absolute inset-0 bg-cover bg-center z-0 origin-center"
        />

        {/* Vignettes for content legibility and section blending — matching Stats.tsx */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-0 pointer-events-none" />
        <div className="absolute right-0 top-0 w-full md:w-[60%] h-full bg-[radial-gradient(circle_at_75%_25%,rgba(255,184,27,0.16)_0%,transparent_60%)] z-0 pointer-events-none" />

        {/* Flying centered logo image keeping small size moving to top title bar */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <motion.div
            style={{
              x: logoX,
              y: logoY,
              scale: logoScale,
              opacity: logoOpacity,
            }}
            className="relative flex items-center justify-center select-none pointer-events-auto"
          >
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="cursor-pointer flex items-center justify-center"
              aria-label="Project Nova Home"
            >
              <Image
                src="/images/project_nova_logo.png"
                alt="Project Nova"
                width={180}
                height={36}
                priority
                className="h-8 sm:h-9 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(255,184,27,0.4)] transition-transform hover:scale-105"
              />
            </Link>
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
          className="max-w-4xl space-y-4 sm:space-y-6 z-10 text-left pl-1 sm:pl-4"
        >
          {/* Heading — luxury serif display */}
          <h1 className="display-serif text-4.5xl xs:text-5xl sm:text-7xl md:text-8xl text-[#f7fafc] leading-[1.1] sm:leading-[1.1]">
            From <span className="font-bold">Concept</span> <br />
            to <span className="text-gold-gradient font-semibold">Creation</span>
            <span className="text-[#FFB81B] font-bold">.</span>
          </h1>

          {/* Description */}
          <p className="font-space font-medium text-xs sm:text-base max-w-full sm:max-w-[580px] leading-relaxed text-left text-[#cbd5e0]/90">
            A dynamic tech based initiative organized by AIESEC in University of Sri Jayewardenepura, empowering school and university students to transform innovative ideas into practical solutions and drive positive impact through technology.
          </p>

          {/* Actions Stack */}
          <div className="flex flex-col gap-2.5 sm:gap-3.5 max-w-full sm:max-w-[580px] w-full pt-2 sm:pt-4">
            {/* Primary CTA Row: Greyed-out Registration & Submit Proposal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 w-full">
              <div className="w-full">
                <button
                  disabled
                  className="w-full group relative bg-slate-800/80 border border-slate-700/80 text-slate-400 text-xs sm:text-sm font-extrabold uppercase tracking-wider px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl cursor-not-allowed justify-center flex items-center gap-2 opacity-75 shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
                >
                  <span className="truncate">REGISTRATION CLOSED</span>
                </button>
              </div>

              <Link href="/submit" className="w-full">
                <button className="w-full group relative bg-[#FFB81B] hover:brightness-105 text-[#001233] text-xs sm:text-sm font-extrabold uppercase tracking-wider px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl shadow-[0_4px_30px_rgba(255,184,27,0.4)] hover:shadow-[0_4px_40px_rgba(255,184,27,0.6)] transition-all duration-200 hover:scale-[1.015] active:scale-[0.98] cursor-pointer justify-center flex items-center gap-2">
                  <span className="truncate">SUBMIT PROPOSAL</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform shrink-0" />
                </button>
              </Link>
            </div>

            {/* School & University Booklet Buttons fitting the width of the Register button */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full">
              <a
                href="https://drive.google.com/drive/folders/1eEpMCg5GNHpYMneB7wL4hC6t1kDYul9E?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <button className="w-full group relative border border-[#FFB81B]/40 hover:border-[#FFB81B] hover:bg-[#FFB81B]/15 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-2xl backdrop-blur-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer justify-center flex items-center gap-1 sm:gap-2 shadow-[0_0_20px_rgba(0,53,153,0.3)]">
                  <School className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#FFB81B] shrink-0" />
                  <span className="truncate">SCHOOL BOOKLET</span>
                </button>
              </a>

              <a
                href="https://drive.google.com/drive/folders/16ljC1BnmMQ55fK2PWiEgkKV2-r3TIKb8?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <button className="w-full group relative border border-[#FFB81B]/40 hover:border-[#FFB81B] hover:bg-[#FFB81B]/15 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 sm:px-4 py-2.5 sm:py-3.5 rounded-lg sm:rounded-2xl backdrop-blur-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer justify-center flex items-center gap-1 sm:gap-2 shadow-[0_0_20px_rgba(0,53,153,0.3)]">
                  <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#FFB81B] shrink-0" />
                  <span className="truncate">UNIVERSITY BOOKLET</span>
                </button>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Infinite Scroll Ticker */}
        <motion.div
          style={{ opacity: tickerOpacity, y: tickerY }}
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
