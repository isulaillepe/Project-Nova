"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const cardsData = [
  {
    image: "/images/david_plain.png",
    title: "Build a Team",
    description:
      "Team up with 4 to 5 fellow students from your school or university and bring your best ideas to life!",
    floatDuration: 5,
    highlight: false,
  },
  {
    image: "/images/david_vr.png",
    title: "Start Your Journey",
    description:
      "Brainstorm and formulate an innovative solution addressing real-world challenges with strong practical impact.",
    floatDuration: 6,
    highlight: true,
  },
  {
    image: "/images/david_sunglasses.png",
    title: "Submit Your Idea",
    description:
      "Start building your final product and submit your project proposal for the competition.",
    floatDuration: 5.5,
    highlight: false,
  },
];

const importantGuidelines = [
  {
    number: "01",
    title: "Category Eligibility",
    description: "Undergraduates from any university participate under University Category. School students (aged 18+) participate under School Category.",
  },
  {
    number: "02",
    title: "Team Size",
    description: "All teams must comprise of 4 to 5 members including the team leader.",
  },
  {
    number: "03",
    title: "Exclusive Representation",
    description: "One person can represent only one team throughout the entire competition.",
  },
  {
    number: "04",
    title: "Innovative Ideas",
    description: "All project concepts must be original and innovative, addressing real-world challenges.",
  },
  {
    number: "05",
    title: "Proposal Structure",
    description: "Ideas must be presented in a formal proposal following the official sample structure and guidelines given.",
  },
  {
    number: "06",
    title: "Idea Lock",
    description: "The proposed idea cannot be changed after proposal submission. The final product may only include added features.",
  },
  {
    number: "07",
    title: "Final Decision",
    description: "In every phase of the competition, the judging panel's decision is the final decision.",
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-bg-[#FFB81B]/10 to-bg-[#003599]/10 blur-3xl opacity-60" />
        <div className="absolute top-0 right-1/4 h-[300px] w-[300px] rounded-full bg-cyan-600/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full bg-bg-[#FFB81B]/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Section Heading with animation */}
        <div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={headerVariants}
            className="text-center mb-16 sm:mb-20 space-y-4"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-none text-white font-space uppercase">
              <span
                className="font-extrabold"
                style={{ WebkitTextStroke: "1.5px #FFB81B", color: "transparent" }}
              >
                IMPORTANT
              </span>{" "}
              <span className="font-cormorant italic text-white font-medium lowercase">Guidelines</span>
            </h2>
            <div className="w-20 h-[3px] bg-gradient-to-r from-transparent via-[#FFB81B] to-transparent shadow-[0_0_12px_#FFB81B] rounded-full mx-auto mt-3" />
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
                    ? "border-bg-[#FFB81B]/15 shadow-[0_0_30px_rgba(0,102,255,0.15)]"
                    : "border-white/5 hover:border-bg-[#FFB81B]/10"
                }`}
              >
                {/* Highlight bar for the active card (matches top border styling) */}
                {card.highlight && (
                  <div className="absolute inset-x-0 -top-[1px] h-[2px] bg-gradient-to-r from-transparent via-text-[#FFB81B] to-transparent rounded-t-3xl" />
                )}

                {/* Hologram / Blueprint grid container */}
                <div className="relative w-full h-52 sm:h-56 rounded-xl md:rounded-2xl overflow-hidden bg-[#001233]/40 border border-white/5 flex items-center justify-center">
                  
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
                    className="relative w-40 h-44 flex items-center justify-center drop-shadow-[0_0_25px_rgba(0,149,255,0.35)]"
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
                  <div className="absolute inset-0 bg-gradient-to-b from-bg-[#FFB81B]/0 via-bg-[#FFB81B]/5 to-bg-[#FFB81B]/0 -translate-y-full group-hover:animate-[scan_2s_ease-in-out_infinite] pointer-events-none" />
                </div>

                {/* Text content */}
                <div className="text-center mt-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-lg sm:text-xl font-bold font-space text-white tracking-wide group-hover:text-text-[#FFB81B] transition-colors duration-300">
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

        {/* Important Guidelines Grid from Delegate Booklet */}
        <div className="space-y-8">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {importantGuidelines.map((item, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl bg-[#001233]/40 border border-[#003599]/30 p-6 backdrop-blur-sm hover:border-[#FFB81B]/30 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-[#FFB81B] tracking-wider">
                    {item.number}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#FFB81B]/40 group-hover:bg-[#FFB81B] transition-colors" />
                </div>
                <h4 className="text-base font-space font-bold text-white mb-2 group-hover:text-[#FFB81B] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}

