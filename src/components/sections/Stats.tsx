"use client";

import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1.15, 1.0]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["-12%", "8%"]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as any } },
  };

  const leftCardVariants = {
    hidden: { opacity: 0, x: -40, y: 20 },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.8, ease: "easeOut" as any, delay: 0.1 } },
  };

  const centerCardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1.05, y: 0, transition: { duration: 0.8, ease: "easeOut" as any, delay: 0.2 } },
  };

  const rightCardVariants = {
    hidden: { opacity: 0, x: 40, y: 20 },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.8, ease: "easeOut" as any, delay: 0.3 } },
  };

  const trackLeftVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" as any, delay: 0.4 } },
  };

  const trackRightVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" as any, delay: 0.45 } },
  };

  return (
    <section
      ref={sectionRef}
      id="prizes"
      className="relative min-h-screen bg-[#001233] py-32 px-4 sm:px-8 md:px-16 overflow-hidden flex flex-col justify-between"
    >
      {/* Parallax cosmic backdrop */}
      <motion.div
        style={{
          scale: bgScale,
          y: bgY,
          backgroundImage: "url('/images/greek_gods_faq_orange.jpg')",
        }}
        className="absolute inset-0 bg-cover bg-center z-0 origin-center filter brightness-[0.8]"
      />

      {/* Vignettes for content legibility and section blending */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#001233] via-[#001233]/55 to-[#001233] z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[#001233]/30 backdrop-blur-[1px] z-0 pointer-events-none" />

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
          <span className="text-[#FFB81B] text-xs font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-2 font-space">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB81B] shadow-[0_0_8px_#FFB81B]" />
            THE TREASURY
          </span>
          <h2 className="display-serif text-4xl sm:text-6xl md:text-7xl text-[#f7fafc]">
            <span
              className="font-bold"
              style={{ WebkitTextStroke: "1px rgba(255, 184, 27, 0.4)", color: "transparent" }}
            >
              REWARDS
            </span>{" "}
            <span className="font-cormorant italic text-[#ffcb47] font-medium lowercase">of Olympus</span>
          </h2>
          <p className="mx-auto max-w-xl text-sm text-[#cbd5e0]/80 font-space font-light tracking-wide">
            The spoils of victory — a LKR 255,000 treasury awaiting the crews who earn the favor of the pantheon.
          </p>
        </motion.div>

        {/* Floating Glassmorphic Podium Card */}
        <motion.div
          variants={cardVariants}
          className="glass backdrop-blur-xl rounded-[28px] p-8 md:p-12 shadow-[0_12px_40px_rgba(0,8,30,0.655)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-center">
            {/* 2nd Place (Silver) */}
            <motion.div
              variants={leftCardVariants}
              className="order-2 md:order-1 border border-white/10 bg-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg transition-transform duration-300 hover:scale-[1.02] min-h-[220px]"
            >
              <div className="w-10 h-10 rounded-full bg-[#cbd5e0]/10 border border-[#cbd5e0]/20 flex items-center justify-center mb-4 text-[#e2e8f0]">
                <Medal className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold font-space uppercase tracking-[0.2em] text-[#cbd5e0] mb-1">
                1st Runner-Up
              </span>
              <span className="text-3xl font-extrabold tracking-tight text-[#f7fafc] font-cinzel">
                LKR 50,000
              </span>
              <p className="text-[10px] text-[#cbd5e0]/70 font-space leading-relaxed max-w-[200px] mt-1">
                Awarded for high-impact concept designs and a structured developmental vision.
              </p>
            </motion.div>

            {/* 1st Place (Gold) */}
            <motion.div
              variants={centerCardVariants}
              className="order-1 md:order-2 border border-[#FFB81B]/45 bg-[#FFB81B]/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(255,184,27,0.15)] md:scale-105 transition-transform duration-300 hover:scale-[1.07] min-h-[250px] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFB81B]/10 to-transparent opacity-40" />

              <div className="w-12 h-12 rounded-full bg-[#FFB81B]/10 border border-[#FFB81B]/30 flex items-center justify-center mb-4 text-[#FFB81B] shadow-[0_0_15px_rgba(255,184,27,0.3)]">
                <Trophy className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-extrabold font-space uppercase tracking-[0.25em] text-[#FFB81B] mb-1">
                🏆 Grand Champion
              </span>
              <span className="text-4xl font-black tracking-tight text-[#f7fafc] font-cinzel">
                LKR 75,000
              </span>
              <p className="text-[10px] text-[#cbd5e0] font-space leading-relaxed max-w-[220px] opacity-90 mt-1">
                Grand Prize for absolute mastery in innovative architecture and problem solving.
              </p>
            </motion.div>

            {/* 3rd Place (Bronze) */}
            <motion.div
              variants={rightCardVariants}
              className="order-3 md:order-3 border border-[#cd7f32]/25 bg-[#cd7f32]/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg transition-transform duration-300 hover:scale-[1.02] min-h-[220px]"
            >
              <div className="w-10 h-10 rounded-full bg-[#cd7f32]/10 border border-[#cd7f32]/20 flex items-center justify-center mb-4 text-[#e0995a]">
                <Award className="w-5 w-5" />
              </div>
              <span className="text-[10px] font-bold font-space uppercase tracking-[0.2em] text-[#e0995a] mb-1">
                2nd Runner-Up
              </span>
              <span className="text-3xl font-extrabold tracking-tight text-[#f7fafc] font-cinzel">
                LKR 30,000
              </span>
              <p className="text-[10px] text-[#cbd5e0]/70 font-space leading-relaxed max-w-[200px] mt-1">
                Recognized for clear industrial prototype readiness and engineering execution stability.
              </p>
            </motion.div>
          </div>

          {/* Finalist Merits sub-row footer inside the card — fine golden divider */}
          <div className="mt-10 pt-8 divider-gold flex flex-col sm:flex-row items-center justify-between gap-4 w-full text-center sm:text-left relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FFB81B]/10 border border-[#FFB81B]/20 flex items-center justify-center text-[#FFB81B] text-xs">
                ⭐
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#FFB81B] uppercase block font-space">
                  FINALIST MERIT SCHEME
                </span>
                <span className="text-[11px] text-[#cbd5e0] font-space font-medium leading-tight">
                  LKR 10,000 allocated across 10 short-listed teams to honor their execution.
                </span>
              </div>
            </div>
            <div className="bg-[#FFB81B]/10 border border-[#FFB81B]/25 px-4 py-2 rounded-xl font-space font-bold text-xs text-[#FFB81B] tracking-wider shrink-0">
              TOTAL POOL: LKR 255,000
            </div>
          </div>
        </motion.div>

        {/* Realms & Disciplines Tracks Grid */}
        <div className="pt-10 grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-[10px] sm:text-xs text-[#cbd5e0] max-w-5xl mx-auto w-full relative">
          <motion.div
            variants={trackLeftVariants}
            className="border-y border-l border-[#003599]/50 p-5 rounded-l-xl bg-[#001233]/50 backdrop-blur-sm relative"
          >
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#FFB81B]/80" />
            <span className="text-[#FFB81B] font-bold block mb-1 text-[11px] tracking-widest font-space">REALMS TRACK:</span>
            <span className="leading-relaxed opacity-90">MARKETPLACES, EDTECH, DIGITAL HEALTH, E-COMMERCE, SAAS</span>
          </motion.div>

          <motion.div
            variants={trackRightVariants}
            className="border-y border-r border-[#003599]/50 p-5 rounded-r-xl bg-[#001233]/50 backdrop-blur-sm relative"
          >
            <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-[#FFB81B]/80" />
            <span className="text-[#FFB81B] font-bold block mb-1 text-[11px] tracking-widest font-space">WISDOM TRACK:</span>
            <span className="leading-relaxed opacity-90">PREDICTIVE HEALTH, GENERATIVE AI, FINTECH ANALYTICS, BIO-INFORMATICS</span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
