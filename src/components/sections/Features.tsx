"use client";

import React, { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { Shield } from "lucide-react";

const timelineSteps = [
  {
    step: "01",
    date: "26TH – 30TH JULY",
    title: "Team Registration",
    description: "Registration opens on 26th July and closes on 30th July. Assemble your squad of 4 to 5 members representing your school or university and register.",
  },
  {
    step: "02",
    date: "01ST – 06TH AUGUST",
    title: "Proposal & Flash Round Submission",
    description: "Submissions start on 1st August. Teams submit their formal project concept proposals and flash round entries by 6th–7th August.",
  },
  {
    step: "03",
    date: "09TH AUGUST",
    title: "Workshop & Shortlist Announcement",
    description: "Shortlisted teams are announced on 9th August and gain exclusive access to a hands-on workshop session with industry mentors.",
  },
  {
    step: "04",
    date: "12TH AUGUST",
    title: "UI Submission",
    description: "Develop and submit the complete high-fidelity UI design of your proposed solution by 12th August.",
  },
  {
    step: "05",
    date: "15TH AUGUST",
    title: "Finalist Teams Selection",
    description: "Evaluation of UI submissions and official announcement of the finalist squads qualified for the Grand Finale on 15th August.",
  },
  {
    step: "06",
    date: "30TH AUGUST",
    title: "Grand Finale Event Day",
    description: "The ultimate showcase at the University of Sri Jayewardenepura on 30th August. Present live to judges and compete for the Grand Treasury.",
  },
];

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Track vertical scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Measure how far the column must pan upward: its full height minus the visible viewport
  const [travel, setTravel] = useState(0);
  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const columnHeight = trackRef.current.scrollHeight;
      setTravel(Math.max(0, columnHeight - window.innerHeight));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Pan the column upward (Scroll 0 -> 0.85, then holds static at the end)
  const timelineY = useTransform(scrollYProgress, [0, 0.85], [0, -travel]);

  // Fill vertical progress bar (Scroll 0 -> 0.85, then holds static at 100%)
  const progressHeight = useTransform(scrollYProgress, [0, 0.85], ["0%", "100%"]);

  // Horizontal "finish" cap reveals once the vertical line is fully filled
  const finishOpacity = useTransform(scrollYProgress, [0.82, 0.9], [0, 1]);
  const finishScale = useTransform(scrollYProgress, [0.82, 0.92], [0, 1]);

  // Fades in the Greek Temple statue photo background when nearing the end (Pre-reveals Poseidon)
  const finalBgOpacity = useTransform(scrollYProgress, [0.45, 0.72], [0, 0.72]);
  const finalBgScale = useTransform(scrollYProgress, [0.45, 0.72], [0.97, 1]);

  // Node square and inner dot animations
  const nodeVariants = {
    hidden: { scale: 0.9, borderColor: "rgba(255,255,255,0.15)" },
    visible: { 
      scale: 1, 
      borderColor: "#FFB81B", 
      boxShadow: "0 0 10px rgba(255,184,27,0.2)",
      transition: { duration: 0.4 } 
    }
  };

  const dotVariants = {
    hidden: { scale: 0, backgroundColor: "rgba(255,255,255,0.2)" },
    visible: { 
      scale: 1, 
      backgroundColor: "#FFB81B", 
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
            backgroundImage: "url('/images/stone_journey.png')"
          }}
          className="absolute inset-0 bg-cover bg-center mix-blend-screen filter brightness-[0.7] z-0 pointer-events-none"
        />

        {/* Huge Background Date Text behind final step */}
        <motion.div 
          style={{ opacity: finalBgOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
        >
          <span className="text-[14vw] font-black text-white/5 font-space tracking-widest select-none uppercase">
            30 AUG
          </span>
        </motion.div>

        {/* Outlined Heading Title with header offset padding */}
        <div className="absolute top-28 sm:top-36 left-0 right-0 text-center space-y-2 z-30">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-none text-white font-space uppercase">
            <span 
              className="font-extrabold"
              style={{ WebkitTextStroke: "1.5px #FFB81B", color: "transparent" }}
            >
              THE
            </span>{" "}
            <span className="font-cormorant italic text-white font-medium lowercase">Journey</span>
          </h2>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-space">
            KEY MILESTONES ON THE ROAD TO THE GRAND FINALE
          </span>
        </div>

        {/* Vertical Timeline Track */}
        <div className="relative w-full flex-1 flex justify-center overflow-hidden mt-6 sm:mt-10">

          {/* Main Static Line Track - vertical, centered (md) / left rail (mobile) */}
          <div className="absolute top-0 bottom-0 left-4 md:left-1/2 -translate-x-1/2 w-[1.5px] bg-white/10 z-10 pointer-events-none" />

          {/* Scrolling Orange Progress Bar Line */}
          <div className="absolute top-0 bottom-0 left-4 md:left-1/2 -translate-x-1/2 w-[1.5px] z-10 pointer-events-none overflow-hidden">
            <motion.div
              style={{ height: progressHeight }}
              className="w-full bg-[#FFB81B] shadow-[0_0_8px_#FFB81B]"
            />
          </div>

          {/* Horizontal Finish Line - vertical progress connects into this once complete */}
          <motion.div
            style={{ opacity: finishOpacity, scaleX: finishScale }}
            className="absolute bottom-0 left-4 md:left-1/2 -translate-x-1/2 w-40 sm:w-64 h-[1.5px] bg-[#FFB81B] shadow-[0_0_10px_#FFB81B] z-20 pointer-events-none origin-center"
          />

          {/* Finish label */}
          <motion.span
            style={{ opacity: finishOpacity }}
            className="absolute bottom-3 left-4 md:left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#FFB81B] uppercase tracking-[0.25em] font-space z-20 pointer-events-none whitespace-nowrap drop-shadow-[0_0_8px_rgba(255,184,27,0.4)]"
          >
            The Grand Finale
          </motion.span>

          {/* Alternating Event Column */}
          <motion.div
            ref={trackRef}
            style={{ y: timelineY }}
            className="absolute left-0 right-0 top-0 flex flex-col gap-10 sm:gap-14 z-20 py-[20vh] px-4 sm:px-8"
          >
            {timelineSteps.map((step, index) => {
              const isOdd = index % 2 === 0;
              return (
                <div
                  key={index}
                  className="relative w-full flex group"
                >

                  {/* Glowing Node Dot (Square) - sits on the vertical line */}
                  <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, amount: 0.5 }}
                    variants={nodeVariants}
                    className="absolute top-1/2 -translate-y-1/2 left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-sm border border-[#FFB81B]/40 bg-black flex items-center justify-center z-30 transition-transform duration-300 group-hover:scale-110 shadow-[0_0_10px_rgba(255,184,27,0.3)]"
                  >
                    <motion.div
                      variants={dotVariants}
                      className="w-1.5 h-1.5 rounded-sm"
                    />
                  </motion.div>

                  {/* Alternating Card layout: Odd left, Even right (md+) */}
                  <div
                    className={`w-full pl-10 md:w-1/2 md:pl-0 flex ${
                      isOdd ? "md:pr-10 lg:pr-12 md:justify-end" : "md:ml-auto md:pl-10 lg:pl-12 md:justify-start"
                    }`}
                  >
                    <div className="relative w-full max-w-[390px] md:max-w-[460px] lg:max-w-[500px] bg-[#001233]/80 border border-white/10 rounded-2xl p-4 sm:p-5 lg:p-6 hover:border-[#FFB81B]/40 transition-all duration-300 text-left border-l-2 border-l-[#FFB81B] shadow-[0_6px_24px_rgba(0,0,0,0.45)]">
                      {/* Event Step & Date Badge */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] sm:text-xs font-bold text-[#FFB81B] font-space tracking-widest uppercase">
                          STEP {step.step}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-[#FFB81B]/15 border border-[#FFB81B]/40 text-[#FFB81B] text-[10px] sm:text-xs font-bold font-space tracking-wider shadow-[0_0_10px_rgba(255,184,27,0.15)]">
                          {step.date}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-1.5 uppercase font-space tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 font-space leading-relaxed font-light opacity-90">
                        {step.description}
                      </p>
                    </div>
                  </div>

                </div>
              );
            })}
          </motion.div>

        </div>

      </div>
    </div>
  );
}