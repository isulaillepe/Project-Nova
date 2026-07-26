"use client";

import React, { useRef, useState } from "react";
import { useScroll, useTransform, motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Award, GraduationCap, School, Layers } from "lucide-react";

type CategoryTab = "university" | "school";

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<CategoryTab>("university");

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

  const prizesData = {
    university: {
      title: "University Category",
      pool: "LKR 135,000",
      icon: GraduationCap,
      first: {
        amount: "LKR 70,000",
        label: "1st Place",
        title: "Grand Champion",
        desc: "Awarded for absolute mastery in innovative architecture, engineering & problem solving.",
      },
      second: {
        amount: "LKR 45,000",
        label: "2nd Place",
        title: "1st Runner-Up",
        desc: "Awarded for high-impact concept designs and a structured developmental vision.",
      },
      third: {
        amount: "LKR 20,000",
        label: "3rd Place",
        title: "2nd Runner-Up",
        desc: "Recognized for clear industrial prototype readiness and engineering stability.",
      },
    },
    school: {
      title: "School Category",
      pool: "LKR 45,000",
      icon: School,
      first: {
        amount: "LKR 20,000",
        label: "1st Place",
        title: "Grand Champion",
        desc: "Awarded to top emerging school innovators showcasing brilliant technical talent.",
      },
      second: {
        amount: "LKR 15,000",
        label: "2nd Place",
        title: "1st Runner-Up",
        desc: "Recognized for outstanding creativity and structured execution in technology.",
      },
      third: {
        amount: "LKR 10,000",
        label: "3rd Place",
        title: "2nd Runner-Up",
        desc: "Awarded for impressive problem solving and impactful presentation skills.",
      },
    },
  };

  const currentPrize = activeTab === "school" ? prizesData.school : prizesData.university;

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
        className="relative max-w-6xl mx-auto space-y-12 z-10 w-full flex-1 flex flex-col justify-center animate-fade-in-up"
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
          <p className="mx-auto max-w-2xl text-sm text-[#cbd5e0]/80 font-space font-light tracking-wide">
            The spoils of victory{" "}
            —{" "}
            a grand <span className="text-[#FFB81B] font-bold">LKR 180,000</span>{" "}
            total treasury awarded across University & School competition realms.
          </p>
        </motion.div>

        {/* Category Selector Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#002066]/60 border border-[#003599]/40 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <button
              type="button"
              onClick={() => setActiveTab("university")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-space font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === "university"
                  ? "bg-[#FFB81B] text-[#001233] shadow-[0_0_20px_rgba(255,184,27,0.4)] scale-105"
                  : "text-[#cbd5e0] hover:text-[#f7fafc] hover:bg-white/5"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              <span>University Track</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("school")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-space font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === "school"
                  ? "bg-[#FFB81B] text-[#001233] shadow-[0_0_20px_rgba(255,184,27,0.4)] scale-105"
                  : "text-[#cbd5e0] hover:text-[#f7fafc] hover:bg-white/5"
              }`}
            >
              <School className="h-4 w-4" />
              <span>School Track</span>
            </button>
          </div>
        </div>

        {/* Floating Glassmorphic Rewards Container */}
        <motion.div
          variants={cardVariants}
          className="glass backdrop-blur-xl rounded-[24px] sm:rounded-[28px] p-4 sm:p-8 md:p-12 shadow-[0_12px_40px_rgba(0,8,30,0.655)]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Track Badge header */}
              <div className="flex items-center justify-between border-b border-[#003599]/30 pb-4">
                <div className="flex items-center gap-2.5">
                  {activeTab === "university" ? (
                    <GraduationCap className="h-5 w-5 text-[#FFB81B]" />
                  ) : (
                    <School className="h-5 w-5 text-[#FFB81B]" />
                  )}
                  <h3 className="text-lg font-cinzel font-bold tracking-wider text-[#f7fafc] uppercase">
                    {currentPrize.title}
                  </h3>
                </div>
                <span className="rounded-xl bg-[#FFB81B]/15 border border-[#FFB81B]/40 px-4 py-1.5 text-xs font-space font-bold uppercase tracking-wider text-[#FFB81B] shadow-[0_0_15px_rgba(255,184,27,0.2)]">
                  CATEGORY POOL: {currentPrize.pool}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-2">
                {/* 2nd Place (Silver) */}
                <div className="order-2 md:order-1 border border-white/10 bg-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg transition-transform duration-300 hover:scale-[1.02] min-h-[220px]">
                  <div className="w-10 h-10 rounded-full bg-[#cbd5e0]/10 border border-[#cbd5e0]/20 flex items-center justify-center mb-3 text-[#e2e8f0]">
                    <Medal className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold font-space uppercase tracking-[0.2em] text-[#cbd5e0] mb-1">
                    🥈 {currentPrize.second.title}
                  </span>
                  <span className="text-3xl font-extrabold tracking-tight text-[#f7fafc] font-cinzel">
                    {currentPrize.second.amount}
                  </span>
                  <p className="text-[10px] text-[#cbd5e0]/70 font-space leading-relaxed max-w-[200px] mt-2">
                    {currentPrize.second.desc}
                  </p>
                </div>

                {/* 1st Place (Gold) */}
                <div className="order-1 md:order-2 border border-[#FFB81B]/45 bg-[#FFB81B]/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-[0_0_30px_rgba(255,184,27,0.2)] md:scale-105 transition-transform duration-300 hover:scale-[1.07] min-h-[250px] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FFB81B]/15 to-transparent opacity-50" />
                  <div className="w-12 h-12 rounded-full bg-[#FFB81B]/15 border border-[#FFB81B]/40 flex items-center justify-center mb-3 text-[#FFB81B] shadow-[0_0_15px_rgba(255,184,27,0.3)]">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold font-space uppercase tracking-[0.25em] text-[#FFB81B] mb-1">
                    🏆 {currentPrize.first.title}
                  </span>
                  <span className="text-4xl font-black tracking-tight text-[#f7fafc] font-cinzel">
                    {currentPrize.first.amount}
                  </span>
                  <p className="text-[10px] text-[#cbd5e0] font-space leading-relaxed max-w-[220px] opacity-90 mt-2">
                    {currentPrize.first.desc}
                  </p>
                </div>

                {/* 3rd Place (Bronze) */}
                <div className="order-3 md:order-3 border border-[#cd7f32]/25 bg-[#cd7f32]/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg transition-transform duration-300 hover:scale-[1.02] min-h-[220px]">
                  <div className="w-10 h-10 rounded-full bg-[#cd7f32]/10 border border-[#cd7f32]/20 flex items-center justify-center mb-3 text-[#e0995a]">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold font-space uppercase tracking-[0.2em] text-[#e0995a] mb-1">
                    🥉 {currentPrize.third.title}
                  </span>
                  <span className="text-3xl font-extrabold tracking-tight text-[#f7fafc] font-cinzel">
                    {currentPrize.third.amount}
                  </span>
                  <p className="text-[10px] text-[#cbd5e0]/70 font-space leading-relaxed max-w-[200px] mt-2">
                    {currentPrize.third.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Finalist Merits sub-row footer inside card */}
          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-[#FFB81B]/20 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 w-full relative z-10">
            <div className="w-full lg:flex-1 rounded-2xl bg-gradient-to-r from-[#FFB81B]/20 via-[#FFB81B]/10 to-[#002066]/50 border border-[#FFB81B]/35 p-4 sm:p-5 shadow-[0_0_20px_rgba(255,184,27,0.12)] backdrop-blur-md">
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#FFB81B]/20 border border-[#FFB81B]/40 flex items-center justify-center text-[#FFB81B] text-base shrink-0 shadow-[0_0_12px_rgba(255,184,27,0.25)]">
                  ⭐
                </div>
                <div className="text-center sm:text-left min-w-0 flex-1">
                  <span className="text-xs font-bold font-space tracking-[0.2em] text-[#FFB81B] uppercase block">
                    RECOGNITION & CERTIFICATES
                  </span>
                  <p className="text-xs text-[#f7fafc] font-space font-medium leading-relaxed mt-1">
                    All finalist teams across both tracks will receive official participation credentials and exclusive performance validation reports.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-auto bg-[#FFB81B]/15 border border-[#FFB81B]/40 px-6 py-4 rounded-2xl font-space font-bold text-xs text-[#FFB81B] tracking-wider text-center shrink-0 shadow-[0_0_15px_rgba(255,184,27,0.15)] flex flex-col justify-center">
              <span className="text-[10px] text-[#cbd5e0]/60 uppercase tracking-widest font-normal">GRAND TOTAL TREASURY</span>
              <span className="text-base font-cinzel font-extrabold text-[#FFB81B]">LKR 180,000</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}