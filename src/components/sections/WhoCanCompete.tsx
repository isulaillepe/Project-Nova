"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const cardsData = [
  {
    image: "/images/stone_solo_team.png",
    title: "Go Solo or Build a Team",
    description:
      "Participate individually or form a team of two to five members. All team members must be currently enrolled undergraduates from the same university or higher education institute.",
    floatDuration: 5,
    highlight: false,
  },
  {
    image: "/images/stone_idea.png",
    title: "Your Idea",
    description:
      "Present an innovative startup idea, product, service, or solution that addresses a real-world problem or creates meaningful value. Your idea should demonstrate originality, practical potential, and the ability to grow into a sustainable venture.",
    floatDuration: 6,
    highlight: true,
  },
  {
    image: "/images/stone_journey.png",
    title: "Start Your Journey",
    description:
      "Participation is completely free with no registration fees or prerequisites. Simply sign up, submit your proposal, and let your idea do the talking.",
    floatDuration: 5.5,
    highlight: false,
  },
];

export default function WhoCanCompete() {
  // Container animation variants for stagger scroll animation
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  } as const;

  // Card slide up and fade in variants
  const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
      },
    },
  } as const;

  // Header fade-in variants
  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  } as const;

  return (
    <section
      id="rules"
      className="relative py-24 sm:py-32 bg-[#020512] overflow-hidden border-b border-white/5"
    >
      {/* Background ambient glows */}
      <div className="absolute inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-blue-600/10 to-indigo-600/10 blur-3xl opacity-60" />
        <div className="absolute top-0 right-1/4 h-[300px] w-[300px] rounded-full bg-cyan-600/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full bg-blue-600/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with animation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={headerVariants}
          className="text-center mb-16 sm:mb-20 space-y-4"
        >
          <span className="text-[#FF5533] text-[10px] font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-1.5 font-space">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5533] shadow-[0_0_8px_#FF5533]" />
            ELIGIBILITY
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-extrabold tracking-[0.1em] text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] uppercase">
            WHO CAN COMPETE
          </h2>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#FF5533] to-transparent mx-auto mt-2" />
        </motion.div>

        {/* Card Grid with staggered animations */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
        >
          {cardsData.map((card, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ 
                y: -6,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              className={`relative flex flex-col rounded-2xl md:rounded-3xl p-6 lg:p-8 bg-[#040817]/60 backdrop-blur-md transition-all duration-300 group select-none border ${
                card.highlight
                  ? "border-blue-500/40 shadow-[0_0_30px_rgba(0,102,255,0.15)]"
                  : "border-white/5 hover:border-blue-500/20"
              }`}
            >
              {/* Highlight bar for the active card (matches top border styling) */}
              {card.highlight && (
                <div className="absolute inset-x-0 -top-[1px] h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-t-3xl" />
              )}

              {/* Hologram / Blueprint grid container */}
              <div className="relative w-full h-52 sm:h-56 rounded-xl md:rounded-2xl overflow-hidden bg-slate-950/40 border border-white/5 flex items-center justify-center">
                
                {/* Blueprint grid background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,102,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,102,255,0.06)_1px,transparent_1px)] bg-[size:20px_20px] bg-center" />
                
                {/* Mask layer to fade the grid edges */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#040817_95%)] pointer-events-none" />

                {/* Floating Image Asset */}
                <motion.div
                  animate={{
                    y: [0, -12, 0],
                  }}
                  transition={{
                    duration: card.floatDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative w-36 h-36 flex items-center justify-center drop-shadow-[0_0_25px_rgba(0,149,255,0.35)]"
                >
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 768px) 144px, 144px"
                    className="object-contain filter brightness-110 contrast-110"
                    priority={idx === 1} // Prioritize center image load
                  />
                </motion.div>

                {/* Blueprint holographic radar scan effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/0 via-blue-500/5 to-blue-500/0 -translate-y-full group-hover:animate-[scan_2s_ease-in-out_infinite] pointer-events-none" />
              </div>

              {/* Text content */}
              <div className="text-center mt-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-lg sm:text-xl font-bold font-space text-white tracking-wide group-hover:text-blue-400 transition-colors duration-300">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed font-light">
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

    </section>
  );
}
