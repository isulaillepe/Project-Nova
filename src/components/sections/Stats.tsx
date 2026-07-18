"use client";

import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  
  // 1. Track scroll of the entire section for parallax background
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Background Parallax translations
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.15, 1.0]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["-12%", "8%"]);

  // Framer Motion viewport entrance variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as any } }
  };

  const leftCardVariants = {
    hidden: { opacity: 0, x: -40, y: 20 },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.8, ease: "easeOut" as any, delay: 0.1 } }
  };

  const centerCardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1.05, y: 0, transition: { duration: 0.8, ease: "easeOut" as any, delay: 0.2 } }
  };

  const rightCardVariants = {
    hidden: { opacity: 0, x: 40, y: 20 },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.8, ease: "easeOut" as any, delay: 0.3 } }
  };

  const trackLeftVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" as any, delay: 0.4 } }
  };

  const trackRightVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" as any, delay: 0.45 } }
  };

  const childVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: { opacity: 0.85, scale: 1, y: 0, transition: { duration: 1.0, ease: "easeOut" as any, delay: 0.5 } }
  };

  return (
    <section 
      ref={sectionRef} 
      id="prizes" 
      className="relative min-h-screen bg-slate-950 py-32 px-4 sm:px-8 md:px-16 overflow-hidden flex flex-col justify-between"
    >
      {/* Parallax space shuttle sunset background */}
      <motion.div 
        style={{ 
          scale: bgScale,
          y: bgY,
          backgroundImage: "url('/images/rocket_launch_bg.png')"
        }}
        className="absolute inset-0 bg-cover bg-center z-0 origin-center filter brightness-95"
      />

      {/* Vignettes for content legibility and section blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/40 to-slate-950 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] z-0 pointer-events-none" />

      {/* Main Stats Content Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.25 }}
        className="relative max-w-6xl mx-auto space-y-16 z-10 w-full flex-1 flex flex-col justify-center animate-fade-in-up"
      >
        {/* Outlined Section Header */}
        <motion.div variants={headerVariants} className="space-y-3 text-center">
          <span className="text-[#FF5533] text-xs font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5533] shadow-[0_0_8px_#FF5533]" />
            OUR LEGACY
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight leading-none text-white font-space uppercase">
            <span 
              className="font-extrabold"
              style={{ WebkitTextStroke: "1px rgba(255, 255, 255, 0.4)", color: "transparent" }}
            >
              THE REWARDS
            </span>{" "}
            <span className="font-cormorant italic text-white font-medium lowercase">Speak</span>
          </h2>
        </motion.div>

        {/* Floating Glassmorphic Podium Card */}
        <motion.div 
          variants={cardVariants}
          className="glass-dark backdrop-blur-xl bg-slate-950/45 border border-white/10 rounded-[28px] p-8 md:p-12 shadow-[0_12px_40px_rgba(0,0,0,0.655)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-center">
            
            {/* 2nd Place (Silver) - Order 2 on mobile, Order 1 on Desktop */}
            <motion.div 
              variants={leftCardVariants}
              className="order-2 md:order-1 border border-white/10 bg-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg transition-transform duration-300 hover:scale-[1.02] min-h-[220px]"
            >
              <div className="w-10 h-10 rounded-full bg-slate-200/10 border border-slate-200/20 flex items-center justify-center mb-4 text-slate-300">
                <Medal className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold font-space uppercase tracking-[0.2em] text-slate-400 mb-1">
                1st Runner-Up
              </span>
              <span className="text-3xl font-extrabold tracking-tight text-white font-space mb-2">
                LKR 50,000
              </span>
              <p className="text-[10px] text-slate-400 font-space leading-relaxed max-w-[200px]">
                Awarded for high-impact concept designs and structured developmental vision.
              </p>
            </motion.div>

            {/* 1st Place (Gold) - Order 1 on mobile, Order 2 on Desktop */}
            <motion.div 
              variants={centerCardVariants}
              className="order-1 md:order-2 border border-[#FFB81C]/45 bg-[#FFB81C]/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(255,184,28,0.15)] md:scale-105 transition-transform duration-300 hover:scale-[1.07] min-h-[250px] relative overflow-hidden"
            >
              {/* Highlight badge background aura */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFB81C]/10 to-transparent opacity-40" />
              
              <div className="w-12 h-12 rounded-full bg-[#FFB81C]/10 border border-[#FFB81C]/30 flex items-center justify-center mb-4 text-[#FFB81C] shadow-[0_0_15px_rgba(255,184,28,0.3)]">
                <Trophy className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold font-space uppercase tracking-[0.25em] text-[#FFB81C] mb-1">
                🏆 Grand Champion
              </span>
              <span className="text-4xl font-black tracking-tight text-white font-space mb-2">
                LKR 75,000
              </span>
              <p className="text-[10px] text-slate-300 font-space leading-relaxed max-w-[220px] opacity-90">
                Grand Prize recognized for absolute mastery in innovative architecture and problem solving.
              </p>
            </motion.div>

            {/* 3rd Place (Bronze) - Order 3 on mobile, Order 3 on Desktop */}
            <motion.div 
              variants={rightCardVariants}
              className="order-3 md:order-3 border border-[#CD7F32]/25 bg-[#CD7F32]/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg transition-transform duration-300 hover:scale-[1.02] min-h-[220px]"
            >
              <div className="w-10 h-10 rounded-full bg-[#CD7F32]/10 border border-[#CD7F32]/20 flex items-center justify-center mb-4 text-[#FF8F59]">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold font-space uppercase tracking-[0.2em] text-[#FF8F59] mb-1">
                2nd Runner-Up
              </span>
              <span className="text-3xl font-extrabold tracking-tight text-white font-space mb-2">
                LKR 30,000
              </span>
              <p className="text-[10px] text-slate-400 font-space leading-relaxed max-w-[200px]">
                Recognized for clear industrial prototype readiness and engineering execution stability.
              </p>
            </motion.div>

          </div>

          {/* Finalist Merits sub-row footer inside the card */}
          <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 w-full text-center sm:text-left relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-orange-500 text-xs">
                ⭐
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#FF5533] uppercase block font-space">
                  FINALIST MERIT SCHEME
                </span>
                <span className="text-[11px] text-slate-400 font-space font-medium leading-tight">
                  LKR 10,000 allocated straight across 10 short-listed teams to appreciate project execution.
                </span>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl font-space font-bold text-xs text-white tracking-wider shrink-0">
              TOTAL POOL: LKR 255,000
            </div>
          </div>

        </motion.div>

        {/* Platforms & Intelligence Tracks Grid */}
        <div className="pt-10 grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-[10px] sm:text-xs text-slate-300 max-w-5xl mx-auto w-full relative">
          
          <motion.div 
            variants={trackLeftVariants} 
            className="border-y border-l border-white/10 p-5 rounded-l-xl bg-slate-950/50 backdrop-blur-sm relative"
          >
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#FF5533]/80" />
            <span className="text-[#FF5533] font-bold block mb-1 text-[11px] tracking-widest">PLATFORMS TRACK:</span>
            <span className="leading-relaxed opacity-90">MARKETPLACES, EDTECH, DIGITAL HEALTH, E-COMMERCE, SAAS</span>
          </motion.div>

          <motion.div 
            variants={trackRightVariants} 
            className="border-y border-r border-white/10 p-5 rounded-r-xl bg-slate-950/50 backdrop-blur-sm relative"
          >
            <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-[#FF5533]/80" />
            <span className="text-[#FF5533] font-bold block mb-1 text-[11px] tracking-widest">INTELLIGENCE TRACK:</span>
            <span className="leading-relaxed opacity-90">PREDICTIVE HEALTH, GENERATIVE AI, FINTECH ANALYTICS, BIO-INFORMATICS</span>
          </motion.div>

        </div>
      </motion.div>

      {/* Child Wonder Portrait Overlay (bottom right corner) */}
      <motion.div 
        variants={childVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.25 }}
        className="absolute right-0 bottom-0 w-44 sm:w-56 md:w-80 lg:w-[420px] aspect-square z-10 pointer-events-none origin-bottom-right"
      >
        <div 
          className="w-full h-full bg-cover bg-bottom opacity-70 sm:opacity-80 mix-blend-screen"
          style={{ backgroundImage: "url('/images/child_wonder.png')" }}
        />
      </motion.div>
    </section>
  );
}