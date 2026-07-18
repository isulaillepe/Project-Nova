"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EventItem {
  name: string;
  image: string;
  year: string;
  description: string;
}

const EVENTS_DATA: EventItem[] = [
  {
    name: "PROJECT NOVA 2.0",
    image: "/images/past-events/codesprint_2.png",
    year: "2017",
    description: "The spark that started it all - igniting startup collaboration and team building.",
  },
  {
    name: "PROJECT NOVA 3.0",
    image: "/images/past-events/codesprint_3.png",
    year: "2019",
    description: "Expanding the horizons with tech pitches in front of elite venture capitalists.",
  },
  {
    name: "PROJECT NOVA 4.0",
    image: "/images/past-events/codesprint_4.png",
    year: "2021",
    description: "Pioneering the hybrid hackathon model during global digital transformation.",
  },
  {
    name: "PROJECT NOVA 5.0",
    image: "/images/past-events/codesprint_5.png",
    year: "2023",
    description: "Fostering raw execution with intense 24-hour non-stop building and hacking.",
  },
  {
    name: "PROJECT NOVA 7.0",
    image: "/images/past-events/codesprint_7.png",
    year: "2025",
    description: "A monumental edition showcasing groundbreaking student-led startup creations.",
  },
];

export default function PastEvents() {
  const [currentIndex, setCurrentIndex] = useState(2); // Start with Project Nova 4.0 (index 2) as active
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Track scroll of this section relative to viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Map progress to opacity, scale, and transform Y
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 0.95], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.25, 0.75, 0.95], [0.92, 1, 1, 0.92]);
  const y = useTransform(scrollYProgress, [0, 0.25, 0.75, 0.95], [40, 0, 0, -40]);

  // Auto scroll every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % EVENTS_DATA.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + EVENTS_DATA.length) % EVENTS_DATA.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % EVENTS_DATA.length);
  };

  const handleIndicatorClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Beveled corner clip-path for both wrapper (border) and inner image container
  const clipPathString = "polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)";

  return (
    <section
      ref={sectionRef}
      id="past-events"
      className="relative py-20 sm:py-28 bg-black overflow-hidden border-t border-white/5"
      onMouseLeave={() => {
        setHoveredIndex(null);
      }}
    >
      <motion.div
        style={{ opacity, scale, y }}
        className="w-full h-full flex flex-col justify-center"
      >
        {/* Decorative gradient glowing backgrounds */}
        <div className="absolute inset-0 -z-10 overflow-hidden select-none pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#FF5533]/5 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading */}
          <div className="text-center space-y-2 mb-12 sm:mb-20">
            <span className="text-[#FF5533] text-[10px] font-bold uppercase tracking-[0.25em] flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5533] shadow-[0_0_8px_#FF5533]" />
              OUR LEGACY
            </span>
            <h2 className="text-4xl sm:text-5xl font-light tracking-tight leading-none text-white font-space uppercase">
              <span
                className="font-extrabold"
                style={{ WebkitTextStroke: "1px rgba(255, 255, 255, 0.4)", color: "transparent" }}
              >
                PAST
              </span>{" "}
              <span className="font-cormorant italic text-white font-medium lowercase">Events</span>
            </h2>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block font-space">
              MOMENTS FROM PREVIOUS COMPETITIONS
            </span>
          </div>

          {/* Carousel Container */}
          <div className="relative w-full h-[280px] sm:h-[380px] md:h-[440px] flex items-center justify-center">
            
            {/* Arrow Navigation Wrapper (directly positioned relative to the centers of the left and right sibling cards) */}
            <div className="absolute w-[90vw] sm:w-[75vw] md:w-[63vw] lg:w-[52.5vw] aspect-[16/10] pointer-events-none z-40 flex items-center justify-between">
              {/* Navigation Arrow Left */}
              <button
                onClick={handlePrev}
                className="pointer-events-auto p-2 sm:p-3 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 hover:border-[#FF5533]/50 text-slate-400 hover:text-white transition-all duration-300 active:scale-95 shadow-[0_0_15px_rgba(0,0,0,0.5)] -translate-x-1/2"
                aria-label="Previous event"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Navigation Arrow Right */}
              <button
                onClick={handleNext}
                className="pointer-events-auto p-2 sm:p-3 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 hover:border-[#FF5533]/50 text-slate-400 hover:text-white transition-all duration-300 active:scale-95 shadow-[0_0_15px_rgba(0,0,0,0.5)] translate-x-1/2"
                aria-label="Next event"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Carousel Slide Window */}
            <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-visible">
              {EVENTS_DATA.map((item, index) => {
                // Calculate offset index with wrap-around
                let offset = index - currentIndex;
                if (offset < -Math.floor(EVENTS_DATA.length / 2)) {
                  offset += EVENTS_DATA.length;
                } else if (offset > Math.floor(EVENTS_DATA.length / 2)) {
                  offset -= EVENTS_DATA.length;
                }

                const isActive = index === currentIndex;
                const isHovered = index === hoveredIndex;
                const isHighlighted = isActive || isHovered;

                // Translate and styling logic
                let x = "0%";
                let scaleVal = 0.8;
                let opacityVal = 0;
                let zIndexVal = 0;

                if (offset === 0) {
                  x = "0%";
                  scaleVal = 1.0;
                  opacityVal = 1;
                  zIndexVal = 30;
                } else if (offset === -1) {
                  x = "-75%";
                  scaleVal = 0.85;
                  opacityVal = 0.45;
                  zIndexVal = 20;
                } else if (offset === 1) {
                  x = "75%";
                  scaleVal = 0.85;
                  opacityVal = 0.45;
                  zIndexVal = 20;
                } else if (offset === -2) {
                  x = "-140%";
                  scaleVal = 0.7;
                  opacityVal = 0.15;
                  zIndexVal = 10;
                } else if (offset === 2) {
                  x = "140%";
                  scaleVal = 0.7;
                  opacityVal = 0.15;
                  zIndexVal = 10;
                } else {
                  x = offset > 0 ? "200%" : "-200%";
                  scaleVal = 0.5;
                  opacityVal = 0;
                  zIndexVal = 0;
                }

                return (
                  <motion.div
                    key={index}
                    animate={{
                      x,
                      scale: scaleVal,
                      opacity: isHovered && !isActive ? 0.85 : opacityVal,
                      zIndex: isHovered && !isActive ? 25 : zIndexVal,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 150,
                      damping: 24,
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => {
                      if (!isActive) setCurrentIndex(index);
                    }}
                    className={`absolute w-[85vw] sm:w-[50vw] md:w-[42vw] lg:w-[35vw] aspect-[16/10] cursor-pointer origin-center`}
                  >
                    {/* Beveled Border Wrapper */}
                    <div
                      className="w-full h-full p-[1.5px] transition-all duration-500 ease-out"
                      style={{
                        clipPath: clipPathString,
                        backgroundColor: isHighlighted ? "#FF5533" : "rgba(255,255,255,0.1)",
                        boxShadow: isActive ? "0 10px 30px -10px rgba(255,85,51,0.3)" : "none",
                      }}
                    >
                      {/* Beveled Inner Content Area */}
                      <div
                        className="relative w-full h-full bg-slate-950 overflow-hidden"
                        style={{ clipPath: clipPathString }}
                      >
                        {/* Event Image */}
                        <picture>
                          <img
                            src={item.image}
                            alt={item.name}
                            className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                              isHighlighted ? "grayscale-0 contrast-100 scale-100" : "grayscale contrast-[1.15] brightness-[0.6] scale-98"
                            }`}
                          />
                        </picture>

                        {/* Dark overlay for inactive slides */}
                        <div
                          className={`absolute inset-0 bg-black transition-opacity duration-700 pointer-events-none ${
                            isHighlighted ? "opacity-0" : "opacity-30"
                          }`}
                        />

                        {/* Event Tag Box - Bottom Left (renders dynamically or highlights when active/hovered) */}
                        <AnimatePresence>
                          {isHighlighted && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.3 }}
                              className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 bg-slate-950/90 border-l-[3.5px] border-[#FF5533] px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-2 pointer-events-none select-none"
                            >
                              <span className="text-[10px] sm:text-[11px] font-bold text-white tracking-widest font-space uppercase">
                                {item.name}
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Carousel Indicators (Dashes) */}
          <div className="flex items-center justify-center gap-2 mt-8 sm:mt-12 select-none">
            {EVENTS_DATA.map((_, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={index}
                  onClick={() => handleIndicatorClick(index)}
                  className={`h-[3.5px] rounded-full transition-all duration-500 cursor-pointer ${
                    isActive
                      ? "w-8 bg-[#FF5533] shadow-[0_0_8px_#FF5533]"
                      : "w-4 bg-slate-800 hover:bg-slate-700"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
