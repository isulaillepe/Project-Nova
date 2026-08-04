"use client";

import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const timelineSteps = [
  {
    step: "01",
    date: "26TH JULY – 03RD AUGUST",
    title: "Team Registration",
    description: "Team registration opened on 26th July and closed on 03rd August. Squads of 4 to 5 members registered for the competition.",
  },
  {
    step: "02",
    date: "05TH – 07TH AUGUST",
    title: "Registration Flash Round",
    description: "Flash round registration opens on 05th August and closes on 07th August. Assemble your squad of 4 to 5 members and register.",
  },
  {
    step: "03",
    date: "06TH – 12TH AUGUST",
    title: "Proposal Submission",
    description: "Proposal submission starts on 06th August. Teams submit their formal project concept proposals by 12th August.",
  },
  {
    step: "04",
    date: "08TH AUGUST",
    title: "Awareness Session",
    description: "Interactive awareness session held on 08th August to guide participating teams through the competition stages.",
  },
  {
    step: "05",
    date: "14TH AUGUST",
    title: "Flash Round Proposal Submission",
    description: "Submission deadline for flash round proposals on 14th August.",
  },
  {
    step: "06",
    date: "16TH AUGUST",
    title: "Workshop & Selected Teams Announcement",
    description: "Shortlisted teams are announced on 16th August and gain exclusive access to a hands-on workshop session with industry mentors.",
  },
  {
    step: "07",
    date: "17TH – 21ST AUGUST",
    title: "UI Prototype Submission",
    description: "Develop and submit the complete high-fidelity UI design of your proposed solution by 21st August.",
  },
  {
    step: "08",
    date: "25TH AUGUST",
    title: "Finalist Teams Selection",
    description: "Evaluation of UI submissions and official announcement of the finalist squads qualified for the next phase.",
  },
  {
    step: "09",
    date: "31ST AUG – 02ND SEPT",
    title: "Demo Video Submission",
    description: "Teams record and submit their video demonstration of the working solution by 02nd September.",
  },
  {
    step: "10",
    date: "05TH SEPTEMBER",
    title: "Grand Finale Event Day",
    description: "The ultimate showcase at the University of Sri Jayewardenepura on 05th September. Present live to judges and compete for the Grand Treasury.",
  },
];

export function Features() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track vertical scroll progress as user scrolls through the timeline section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 85%"]
  });

  // Dynamic height for continuous yellow timeline line fill
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} id="timeline" className="relative bg-black py-16 sm:py-28 overflow-hidden select-none">
      
      {/* Background Graphic Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/5 via-transparent to-transparent pointer-events-none z-0" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading - moves naturally with page scroll */}
        <div className="text-center space-y-2.5 sm:space-y-3 mb-10 sm:mb-20">
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-none text-white font-space uppercase">
            <span 
              className="font-extrabold"
              style={{ WebkitTextStroke: "1.5px #FFB81B", color: "transparent" }}
            >
              THE
            </span>{" "}
            <span className="font-cormorant italic text-white font-medium lowercase">Journey</span>
          </h2>
          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#FFB81B] to-transparent shadow-[0_0_10px_#FFB81B] mx-auto my-2" />
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-[0.2em] sm:tracking-[0.25em] font-space max-w-xl mx-auto px-2">
            KEY MILESTONES ON THE ROAD TO THE GRAND FINALE
          </p>
        </div>

        {/* Timeline Content Area */}
        <div className="relative pt-2">
          
          {/* Timeline Cards Container */}
          <div className="relative flex flex-col gap-8 sm:gap-14 md:gap-16 pb-12 sm:pb-16">
            
            {/* Continuous Vertical Timeline Line - Starts under subtitle and ends EXACTLY on the Grand Finale horizontal line */}
            <div className="absolute top-0 -bottom-12 sm:-bottom-16 left-4 sm:left-6 md:left-1/2 -translate-x-1/2 w-[2px] pointer-events-none z-10">
              <div className="absolute inset-0 bg-[#FFB81B]/20 shadow-[0_0_8px_rgba(255,184,27,0.15)]" />
              <motion.div
                style={{ height: progressHeight }}
                className="w-full bg-[#FFB81B] shadow-[0_0_12px_#FFB81B,0_0_24px_rgba(255,184,27,0.7)]"
              />
            </div>

            {timelineSteps.map((step, index) => {
              const isOdd = index % 2 === 0;
              return (
                <div
                  key={index}
                  className="relative w-full flex items-center group"
                >
                  {/* Central Timeline Node Square (On the continuous yellow line) */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.4 }}
                    className="absolute left-4 sm:left-6 md:left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-[2px] border-2 border-[#FFB81B] bg-black flex items-center justify-center z-20 shadow-[0_0_12px_rgba(255,184,27,0.5)] group-hover:scale-125 group-hover:shadow-[0_0_20px_#FFB81B] transition-all duration-300"
                  >
                    <div className="w-1.5 h-1.5 rounded-[1px] bg-[#FFB81B]" />
                  </motion.div>

                  {/* Horizontal Connector Arm (Desktop only) */}
                  <div 
                    className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-[2px] bg-[#FFB81B]/30 group-hover:bg-[#FFB81B] group-hover:shadow-[0_0_10px_#FFB81B] transition-all duration-300 z-10 ${
                      isOdd 
                        ? "right-1/2 w-10 lg:w-12 origin-right" 
                        : "left-1/2 w-10 lg:w-12 origin-left"
                    }`} 
                  />

                  {/* Card wrapper (Alternating desktop left/right, mobile right rail) */}
                  <div
                    className={`w-full pl-9 sm:pl-12 md:w-1/2 md:pl-0 flex ${
                      isOdd 
                        ? "md:pr-10 lg:pr-12 md:justify-end md:ml-0" 
                        : "md:pl-10 lg:pl-12 md:justify-start md:ml-auto"
                    }`}
                  >
                    {/* Card Element matching screenshot UI + yellow line + hover effect */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      className="relative w-full max-w-full sm:max-w-[440px] lg:max-w-[480px] bg-[#0c0c0f]/95 backdrop-blur-md border border-zinc-800/80 rounded-md p-4 sm:p-6 lg:p-7 text-left shadow-[0_10px_30px_rgba(0,0,0,0.7)] border-l-[3px] border-l-[#FFB81B] transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.015] hover:bg-[#111116] hover:border-zinc-700/80 hover:border-l-[4px] hover:border-l-[#FFB81B] hover:shadow-[0_15px_40px_rgba(255,184,27,0.25)] cursor-pointer group/card"
                    >
                      {/* Uppercase Yellow Date Header */}
                      <span className="text-[10px] sm:text-xs font-extrabold text-[#FFB81B] font-space tracking-[0.18em] sm:tracking-[0.2em] uppercase block mb-1.5 sm:mb-2">
                        {step.date}
                      </span>

                      {/* Uppercase Bold Title */}
                      <h3 className="text-sm sm:text-lg lg:text-xl font-extrabold text-white mb-2 sm:mb-2.5 uppercase font-space tracking-wide group-hover/card:text-[#FFB81B] transition-colors duration-300">
                        {step.title}
                      </h3>

                      {/* Description Text */}
                      <p className="text-xs sm:text-sm text-slate-400 font-space leading-relaxed font-light">
                        {step.description}
                      </p>
                    </motion.div>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Grand Finale Finish Marker - Vertical line terminates exactly on top edge of this horizontal line */}
          <div className="relative mt-12 sm:mt-16 z-20">
            <div className="absolute top-0 left-4 sm:left-6 -translate-x-1/2 md:left-1/2 md:-translate-x-1/2 w-44 sm:w-56 md:w-64 h-[2px] bg-[#FFB81B] shadow-[0_0_14px_#FFB81B] pointer-events-none origin-left md:origin-center" />
            
          </div>

        </div>

      </div>
    </section>
  );
}