"use client";

import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { Shield } from "lucide-react";

const timelineSteps = [
  {
    step: "01",
    title: "Registration of Teams",
    description: "Sign up your team to claim your place in this national innovation experience",
    details: [
      "Form teams of 3-5 members",
      "Choose School or University track",
      "Get immediate access to resources"
    ]
  },
  {
    step: "02",
    title: "Proposal Submission",
    description: "Submit your project concept and foundational framework during the initial rollout phase",
    details: [
      "Technical project proposal",
      "Problem statement & solution",
      "Implementation roadmap"
    ]
  },
  {
    step: "03",
    title: "Reviewing the Proposals",
    description: "Submissions are formally evaluated to shortlist the most promising tech solutions",
    details: [
      "Expert panel evaluation",
      "Innovation & feasibility scoring",
      "Shortlist announcement"
    ]
  },
  {
    step: "04",
    title: "Workshops for Selected Teams",
    description: "Access deep-dive technical workshops designed to equip participants with expert knowledge and career tools",
    details: [
      "Technical skill building",
      "Mentorship sessions",
      "Industry expert talks"
    ]
  },
  {
    step: "05",
    title: "Implementation of Projects",
    description: "Develop and refine your active engineering solution before the final project submission window closes",
    details: [
      "Build & iterate on solution",
      "Technical mentorship",
      "Mid-project checkpoints"
    ]
  },
  {
    step: "06",
    title: "The Final Event Day",
    description: "Present your complete project live to judges and engage in panel discussions at the University of Sri Jayewardenepura campus",
    details: [
      "Live project presentations",
      "Panel discussions",
      "Award ceremony"
    ]
  }
];

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track vertical scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Translate horizontal coordinates (Scroll 0 -> 0.82, then holds static at centering offset)
  const timelineX = useTransform(scrollYProgress, [0, 0.82], ["20vw", "-175vw"]);

  // Fill horizontal progress bar (Scroll 0 -> 0.82, then holds static at 100%)
  const progressWidth = useTransform(scrollYProgress, [0, 0.82], ["0%", "100%"]);

  // Fades in the Greek Temple statue photo background when nearing the end (Pre-reveals Poseidon)
  const finalBgOpacity = useTransform(scrollYProgress, [0.45, 0.72], [0, 0.72]);
  const finalBgScale = useTransform(scrollYProgress, [0.45, 0.72], [0.97, 1]);

  const handleSkip = () => {
    if (containerRef.current) {
      const top = containerRef.current.offsetTop + containerRef.current.offsetHeight;
      window.scrollTo({
        top,
        behavior: "smooth"
      });
    }
  };

  // Node square and inner dot animations
  const nodeVariants = {
    hidden: { scale: 0.9, borderColor: "rgba(255,255,255,0.15)" },
    visible: { 
      scale: 1, 
      borderColor: "#FF5533", 
      boxShadow: "0 0 10px rgba(255,85,51,0.2)",
      transition: { duration: 0.4 } 
    }
  };

  const dotVariants = {
    hidden: { scale: 0, backgroundColor: "rgba(255,255,255,0.2)" },
    visible: { 
      scale: 1, 
      backgroundColor: "#FF5533", 
      transition: { duration: 0.4 } 
    }
  };

  return (
    <div ref={containerRef} id="timeline" className="relative h-[250vh] bg-black">
      
      {/* Sticky Viewport Wrapper */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center pt-28 sm:pt-36 select-none z-10">
        
        {/* Fading Greek Temple & Marble Poseidon Statue Background */}
        <motion.div 
          style={{ 
            opacity: finalBgOpacity,
            scale: finalBgScale,
            backgroundImage: "url('/images/greek_temple_statue.png')"
          }}
          className="absolute inset-0 bg-cover bg-center mix-blend-screen filter brightness-[0.7] z-0 pointer-events-none"
        />

        {/* Huge Background Date Text behind final step */}
        <motion.div 
          style={{ opacity: finalBgOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
        >
          <span className="text-[14vw] font-black text-white/5 font-space tracking-widest select-none uppercase">
            NOV 11
          </span>
        </motion.div>

        {/* Outlined Heading Title with header offset padding */}
        <div className="absolute top-28 sm:top-36 left-0 right-0 text-center space-y-2 z-30">
          <span className="text-[#FF5533] text-[10px] font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5533] shadow-[0_0_8px_#FF5533]" />
            OUR JOURNEY
          </span>
          <h2 className="text-4xl sm:text-5xl font-light tracking-tight leading-none text-white font-space uppercase">
            <span 
              className="font-extrabold"
              style={{ WebkitTextStroke: "1px rgba(255, 255, 255, 0.4)", color: "transparent" }}
            >
              THE
            </span>{" "}
            <span className="font-cormorant italic text-white font-medium lowercase">Journey</span>
          </h2>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-space">
            KEY MILESTONES ON THE ROAD TO THE GRAND FINALE
          </span>
        </div>

        {/* Horizontal Timeline Track */}
        <div className="relative w-full h-[560px] flex items-center overflow-hidden mt-6 sm:mt-10">
          
          {/* Main Static Line Track - stretched fully to side boundaries and centered to top-[50%] */}
          <div className="absolute left-0 right-0 top-[50%] -translate-y-1/2 h-[1.5px] bg-white/10 z-10 pointer-events-none" />

          {/* Scrolling Orange Progress Bar Line */}
          <div className="absolute left-0 right-0 top-[50%] -translate-y-1/2 h-[1.5px] z-10 pointer-events-none overflow-hidden">
            <motion.div 
              style={{ width: progressWidth }} 
              className="h-full bg-[#FF5533] shadow-[0_0_8px_#FF5533]" 
            />
          </div>

          {/* Alternating Event Container Flex Row */}
          <motion.div 
            style={{ x: timelineX }}
            className="absolute left-0 top-0 bottom-0 flex items-center gap-16 sm:gap-24 z-20 w-max px-[15vw]"
          >
            {timelineSteps.map((step, index) => {
              const isOdd = index % 2 === 0;
              return (
                <div 
                  key={index} 
                  className="relative h-full w-[85vw] sm:w-[60vw] md:w-[44vw] lg:w-[34vw] shrink-0 flex items-center justify-center group"
                >
                  
                  {/* Glowing Node Dot (Square) - centered to top-[50%] */}
                  <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.5 }}
                    variants={nodeVariants}
                    className="absolute top-[50%] -translate-y-1/2 left-1/2 -translate-x-1/2 w-4.5 h-4.5 rounded-sm border bg-black flex items-center justify-center z-30 transition-transform duration-300 group-hover:scale-110"
                  >
                    <motion.div 
                      variants={dotVariants}
                      className="w-1.5 h-1.5 rounded-sm" 
                    />
                  </motion.div>

                  {/* Alternating Card layout: Odd cards above, Even cards below the top-[50%] line */}
                  <div 
                    className={`absolute left-0 right-0 bg-slate-950/65 border border-white/10 rounded-xl p-4 sm:p-5 hover:border-[#FF5533]/35 transition-all duration-300 text-left border-l-[3px] border-l-[#FF5533] ${
                      isOdd ? "bottom-[50%] mb-4" : "top-[50%] mt-4"
                    }`}
                  >
                    {/* Event Step & Title */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-slate-500 font-space tracking-widest">
                        STEP {step.step}
                      </span>
                      <Shield className="w-3.5 h-3.5 text-[#FF5533]" />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 uppercase font-space tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-300 font-space leading-relaxed font-light mb-3 opacity-90">
                      {step.description}
                    </p>

                    {/* Bullet Info list */}
                    <div className="space-y-1.5 pt-3 border-t border-white/5">
                      {step.details.map((detail, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center gap-2 text-[10.5px] sm:text-xs text-slate-200 font-space"
                        >
                          <span className="w-1 h-1 rounded-full bg-cyan-400 shrink-0 shadow-[0_0_6px_#22d3ee]" />
                          <span className="opacity-95">{detail}</span>
                        </div>
                      ))}
                    </div>

                    {/* Date marker directly below/under the card container for Step 4 and Step 6 */}
                    {(step.step === "04" || step.step === "06") && (
                      <div className="absolute top-[calc(100%+12px)] left-0 right-0 text-center pointer-events-none">
                        <span className="text-[#FF5533] font-black text-xl sm:text-2xl md:text-3xl uppercase tracking-widest block font-space drop-shadow-[0_0_10px_rgba(255,85,51,0.35)]">
                          {step.step === "04" ? "31st of July" : "30th of August"}
                        </span>
                      </div>
                    )}

                  </div>

                </div>
              );
            })}
          </motion.div>

        </div>

        {/* Skip Timeline Button */}
        <button
          onClick={handleSkip}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 px-5 py-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-widest hover:border-[#FF5533]/50 hover:text-white hover:shadow-[0_0_15px_rgba(255,85,51,0.2)] transition-all duration-300"
        >
          Skip Timeline »
        </button>

      </div>
    </div>
  );
}