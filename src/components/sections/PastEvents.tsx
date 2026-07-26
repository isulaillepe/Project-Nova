"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

interface EventItem {
  name: string;
  image: string;
  url: string;
}

const EVENTS_DATA: EventItem[] = [
  {
    name: "Oceana After Movie",
    image: "https://i.ytimg.com/vi/DDPcTk39bi0/hqdefault.jpg",
    url: "https://youtu.be/DDPcTk39bi0?si=D5u9I9Ix8vQkiVzI",
  },
  {
    name: "LaunchPad 3.0 After Movie",
    image: "https://i.ytimg.com/vi/9PwS06duexc/hqdefault.jpg",
    url: "https://youtu.be/9PwS06duexc?si=zZxT0plOBBwaY_T2",
  },
  {
    name: "Winter Induction 25.26 Aftermovie",
    image: "https://i.ytimg.com/vi/hxSPTD9Pt9g/hqdefault.jpg",
    url: "https://youtu.be/hxSPTD9Pt9g?si=Up8wFL501KPnaicF",
  },
  {
    name: "Go Beyond - Dare to Explore",
    image: "https://i.ytimg.com/vi/Tn4ZuYdjxf0/hqdefault.jpg",
    url: "https://youtu.be/Tn4ZuYdjxf0?si=VhLbc9IJqLYsdBfQ",
  },
  {
    name: "Avurudu LCM '25",
    image: "https://i.ytimg.com/vi/gci6Yfkr4M4/hqdefault.jpg",
    url: "https://youtu.be/gci6Yfkr4M4?si=lRIlVDwAUKl_Ze8h",
  },
];

export default function PastEvents() {
  const [currentIndex, setCurrentIndex] = useState(2); // Start with middle item as active
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

  // Auto scroll every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % EVENTS_DATA.length);
    }, 4000);

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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#FFB81B]/5 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading */}
          <div className="text-center space-y-2 mb-12 sm:mb-20">
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
              MOMENTS FROM PREVIOUS COMPETITIONS & EVENTS
            </span>
          </div>

          {/* Carousel Container */}
          <div className="relative w-full h-[280px] sm:h-[380px] md:h-[440px] flex items-center justify-center">
            
            {/* Arrow Navigation Wrapper */}
            <div className="absolute w-[90vw] sm:w-[75vw] md:w-[63vw] lg:w-[52.5vw] aspect-[16/10] pointer-events-none z-40 flex items-center justify-between">
              {/* Navigation Arrow Left */}
              <button
                onClick={handlePrev}
                className="pointer-events-auto p-2 sm:p-3 rounded-full bg-[#001233]/60 backdrop-blur-md border border-white/10 hover:border-[#FFB81B]/50 text-slate-400 hover:text-white transition-all duration-300 active:scale-95 shadow-[0_0_15px_rgba(0,0,0,0.5)] -translate-x-1/2"
                aria-label="Previous event"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Navigation Arrow Right */}
              <button
                onClick={handleNext}
                className="pointer-events-auto p-2 sm:p-3 rounded-full bg-[#001233]/60 backdrop-blur-md border border-white/10 hover:border-[#FFB81B]/50 text-slate-400 hover:text-white transition-all duration-300 active:scale-95 shadow-[0_0_15px_rgba(0,0,0,0.5)] translate-x-1/2"
                aria-label="Next event"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Carousel Slide Window */}
            <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-visible">
              {EVENTS_DATA.map((item, index) => {
                let offset = index - currentIndex;
                if (offset < -Math.floor(EVENTS_DATA.length / 2)) {
                  offset += EVENTS_DATA.length;
                } else if (offset > Math.floor(EVENTS_DATA.length / 2)) {
                  offset -= EVENTS_DATA.length;
                }

                const isActive = index === currentIndex;
                const isHovered = index === hoveredIndex;
                const isHighlighted = isActive || isHovered;

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
                      if (!isActive) {
                        setCurrentIndex(index);
                      } else {
                        window.open(item.url, "_blank", "noopener,noreferrer");
                      }
                    }}
                    className="absolute w-[85vw] sm:w-[50vw] md:w-[42vw] lg:w-[35vw] aspect-[16/10] cursor-pointer origin-center group"
                  >
                    {/* Beveled Border Wrapper */}
                    <div
                      className="w-full h-full p-[1.5px] transition-all duration-500 ease-out"
                      style={{
                        clipPath: clipPathString,
                        backgroundColor: isHighlighted ? "#FFB81B" : "rgba(255,255,255,0.1)",
                        boxShadow: isActive ? "0 10px 30px -10px rgba(255,184,27,0.3)" : "none",
                      }}
                    >
                      {/* Beveled Inner Content Area */}
                      <div
                        className="relative w-full h-full bg-[#001233] overflow-hidden"
                        style={{ clipPath: clipPathString }}
                      >
                        {/* Event Image */}
                        <picture>
                          <img
                            src={item.image}
                            alt={item.name}
                            className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                              isHighlighted ? "grayscale-0 contrast-100 scale-105" : "grayscale contrast-[1.15] brightness-[0.6] scale-100"
                            }`}
                          />
                        </picture>

                        {/* Dark overlay for inactive slides */}
                        <div
                          className={`absolute inset-0 bg-black transition-opacity duration-700 pointer-events-none ${
                            isHighlighted ? "opacity-20" : "opacity-50"
                          }`}
                        />

                        {/* Play Button Overlay on Active Card */}
                        {isActive && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FFB81B] text-[#001233] flex items-center justify-center shadow-[0_0_24px_rgba(255,184,27,0.6)] group-hover:scale-110 transition-transform duration-300">
                              <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current translate-x-0.5" />
                            </div>
                          </div>
                        )}

                        {/* Event Tag Box - Bottom Left */}
                        <AnimatePresence>
                          {isHighlighted && (
                            <motion.div
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.3 }}
                              className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 max-w-[85%] bg-[#001233]/90 border-l-[3.5px] border-[#FFB81B] px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-2 pointer-events-none select-none"
                            >
                              <Play className="w-3 h-3 text-[#FFB81B] shrink-0 fill-[#FFB81B]" />
                              <span className="text-[10px] sm:text-[11px] font-bold text-white tracking-wider font-space truncate">
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
                      ? "w-8 bg-[#FFB81B] shadow-[0_0_8px_#FFB81B]"
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
