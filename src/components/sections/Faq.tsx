"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from "framer-motion";
import { Mail } from "lucide-react";
import { FaLinkedinIn, FaFacebookF, FaYoutube, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";

const socialLinks = [
  { icon: Mail, href: "mailto:projectnova.usj@gmail.com", label: "Mail" },
  { icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
  { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FaWhatsapp, href: "https://wa.me/94771234567", label: "WhatsApp" },
  { icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
  { icon: FaTiktok, href: "https://tiktok.com", label: "TikTok" },
];

const faqItems = [
  {
    question: "What is Project Nova?",
    answer: "Project Nova is a dynamic, tech-based ecosystem curated for school and university students, building an active bridge where future innovation meets direct corporate opportunities. Managed alongside a global student-driven non-profit network, it connects young thinkers directly with progressive enterprises.",
  },
  {
    question: "Who can participate?",
    answer: "The challenge is tailored broadly for school and university students across Sri Lanka who show a distinct curiosity for technical problem-solving, innovative ideation, and leadership development.",
  },
  {
    question: "How can participate in Project Nova?",
    answer: "Teams can register formally on our page during the initial launch, granting immediate access to the early workshop modules and proposal submission portals.",
  },
  {
    question: "What is the competition format?",
    answer: "The event runs over two major phases. First Phase handles conceptual proposal collection and essential skill-building workshops. Second Phase requires qualified teams to submit concrete project completions, leading to live panel presentations.",
  },
  {
    question: "When do registrations open?",
    answer: "Registrations will open soon! Keep an eye on our social media channels and the registration section of this website for the official announcement.",
  },
  {
    question: "Is participation free?",
    answer: "Yes! Participation in Project Nova is completely free, providing every eligible student with an equal opportunity to compete and innovate.",
  },
  {
    question: "What rewards can winners expect?",
    answer: "Teams compete for a comprehensive cash prize layout consisting of LKR 75,000 for 1st place, LKR 50,000 for 2nd place, LKR 30,000 for 3rd place, and LKR 10,000 each for the next 10 places, accompanied by extensive corporate visibility and performance validation reports.",
  },
];

interface FaqItemProps {
  item: typeof faqItems[number];
  index: number;
  openIndex: number | null;
  setOpenIndex: (index: number | null) => void;
  scrollYProgress: MotionValue<number>;
}

function FaqItem({ item, index, openIndex, setOpenIndex, scrollYProgress }: FaqItemProps) {
  const isLeft = index % 2 === 0;

  const x = useTransform(
    scrollYProgress,
    [0.30, 0.50],
    ["0vw", isLeft ? "-120vw" : "120vw"]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0.30, 0.50],
    [1, 0]
  );

  const isOpen = openIndex === index;

  return (
    <motion.div
      style={{ x, opacity }}
      className={`group rounded-2xl bg-slate-950/75 backdrop-blur-md border transition-all duration-300 ${
        isOpen
          ? "border-[#FF5533] shadow-[0_0_20px_rgba(255,85,51,0.25)]"
          : "border-white/10 hover:border-white/20"
      }`}
    >
      <div className="p-5 sm:p-6">
        <button
          onClick={() => setOpenIndex(isOpen ? null : index)}
          className="w-full flex items-center justify-between gap-4 text-left cursor-pointer"
        >
          <span
            className={`font-space font-semibold text-sm sm:text-base md:text-lg transition-colors duration-300 ${
              isOpen ? "text-[#FF5533]" : "text-white group-hover:text-slate-200"
            }`}
          >
            {item.question}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className={`text-xl font-bold flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 transition-all group-hover:bg-white/10 ${
              isOpen ? "text-[#FF5533]" : "text-slate-400"
            }`}
          >
            +
          </motion.span>
        </button>

        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="pt-4 mt-4 border-t border-white/5 text-slate-300 font-sans text-xs sm:text-sm md:text-base leading-relaxed">
            {item.answer}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Faq() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Track progress via ref for scroll-locking logic using Framer Motion event hook
  const progressRef = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    progressRef.current = latest;
  });

  // Scroll locking: stop scroll down at 0.70 progress to keep footer permanent
  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (progressRef.current >= 0.70 && e.touches.length > 0) {
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY; // positive deltaY = scrolling down
        
        if (deltaY > 0) {
          e.preventDefault();
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (progressRef.current >= 0.70 && e.deltaY > 0) {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (progressRef.current >= 0.70) {
        const keys = ["ArrowDown", "PageDown", " ", "End"];
        if (keys.includes(e.key)) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Background cross-fade: cosmic → rocket
  const cosmicBgScale = useTransform(scrollYProgress, [0, 0.35], [1.0, 1.08]);
  const rocketBgScale = useTransform(scrollYProgress, [0.35, 0.70], [1.08, 1.0]);
  const cosmicBgOpacity = useTransform(scrollYProgress, [0.25, 0.45], [1, 0]);
  const rocketBgOpacity = useTransform(scrollYProgress, [0.25, 0.45], [0, 1]);

  // FAQ content fades out first
  const faqContentOpacity = useTransform(scrollYProgress, [0.20, 0.40], [1, 0]);
  const faqHeaderY = useTransform(scrollYProgress, [0.20, 0.40], ["0px", "-60px"]);
  const faqPointerEvents = useTransform(scrollYProgress, (v) => v > 0.40 ? "none" : "auto");
  const faqVisibility = useTransform(scrollYProgress, (v) => v > 0.42 ? "hidden" : "visible");
  const cosmicBgVisibility = useTransform(scrollYProgress, (v) => v > 0.42 ? "hidden" : "visible");

  // Register section and footer fade in together between 0.50 and 0.70
  const registerOpacity = useTransform(scrollYProgress, [0.50, 0.70], [0, 1]);
  const registerY = useTransform(scrollYProgress, [0.50, 0.70], ["30px", "0px"]);
  const registerPointerEvents = useTransform(scrollYProgress, (v) => v >= 0.70 ? "auto" : "none");

  const footerScale = useTransform(scrollYProgress, [0.50, 0.70], [0.95, 1.0]);

  return (
    <section id="faq" className="relative z-10">
      
      {/* Pinned scroll container */}
      <div ref={containerRef} className="relative h-[300vh] z-10">
        <div className="sticky top-0 h-screen w-full overflow-hidden select-none z-10">

          {/* Backgrounds */}
          <div className="absolute inset-0 z-0">
            <motion.div
              style={{
                backgroundImage: "url('/images/cosmic_faq_bg.png')",
                scale: cosmicBgScale,
                opacity: cosmicBgOpacity,
                visibility: cosmicBgVisibility,
                filter: "brightness(0.4)",
              }}
              className="absolute inset-0 bg-cover bg-center origin-center z-0"
            />
            <motion.div
              style={{
                backgroundImage: "url('/images/rocket_launch_bg.png')",
                scale: rocketBgScale,
                opacity: rocketBgOpacity,
                filter: "brightness(0.4)",
              }}
              className="absolute inset-0 bg-cover bg-center origin-center z-10"
            />
          </div>

          {/* FAQ content */}
          <motion.div
            style={{ opacity: faqContentOpacity, pointerEvents: faqPointerEvents, visibility: faqVisibility }}
            className="relative z-10 w-full h-full flex flex-col justify-center py-20"
          >
            <motion.div
              style={{ y: faqHeaderY }}
              className="w-full text-center px-4 mb-8"
            >
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-orbitron font-bold tracking-wider text-white">
                FREQUENTLY ASKED <span className="text-[#FF5533]">QUESTIONS</span>
              </h2>
            </motion.div>

            <div className="w-full max-w-4xl mx-auto px-4">
              <div className="space-y-3 sm:space-y-4">
                {faqItems.map((item, index) => (
                  <FaqItem
                    key={index}
                    item={item}
                    index={index}
                    openIndex={openIndex}
                    setOpenIndex={setOpenIndex}
                    scrollYProgress={scrollYProgress}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Register CTA / Project Nova Description — fades in concurrently with the footer */}
          <motion.div
            style={{ opacity: registerOpacity, y: registerY, pointerEvents: registerPointerEvents }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4"
          >
            <div className="text-center max-w-3xl flex flex-col items-center justify-center z-10">
              <p className="text-white text-center text-xs sm:text-sm md:text-[15px] font-medium leading-relaxed max-w-2xl px-6 select-none opacity-85 tracking-wide">
                Join Project Nova — an inter-university startup competition by AIESEC in USJ. Transform your ideas into real-world ventures and compete for recognition, mentorship, and startup support.
              </p>
            </div>

            {/* Fading In High-Fidelity Footer (fades in together with register now) */}
            <motion.div
              style={{
                opacity: registerOpacity,
                y: registerY,
                scale: footerScale,
                pointerEvents: registerPointerEvents,
              }}
              className="absolute bottom-8 left-0 right-0 z-30 w-full"
            >
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-end justify-between gap-6 px-6 sm:px-8">
                
                {/* Left Column: System Status & Coordinates */}
                <div className="flex flex-col items-center md:items-start gap-1 select-none text-center md:text-left font-space">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF5533] shadow-[0_0_8px_#FF5533] animate-pulse" />
                    <span className="text-[#FF5533] font-bold text-[10px] sm:text-xs tracking-widest uppercase">SYS.ONLINE</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono tracking-wider">6.9271° N   79.8612° E</span>
                </div>

                {/* Middle Column: Comms link & Social icons */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[8px] sm:text-[9px] font-mono font-bold tracking-[0.25em] text-slate-500 uppercase select-none">COMMS_LINK</span>
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9.5 w-9.5 items-center justify-center rounded-md bg-slate-950/40 border border-white/5 text-slate-400 hover:text-white hover:border-[#FF5533]/40 hover:bg-[#FF5533]/10 transition-all duration-300"
                        aria-label={social.label}
                      >
                        <social.icon className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Right Column: Project Nova Logo & Copyright */}
                <div className="flex flex-col items-center md:items-end gap-1 text-center md:text-right select-none font-space">
                  <div className="font-extrabold text-sm sm:text-base tracking-wider uppercase">
                    <span className="text-white">PROJECT</span>
                    <span className="text-[#FF5533] ml-1">NOVA</span>
                  </div>
                  <div className="text-[8px] sm:text-[9px] text-slate-500 font-medium tracking-widest uppercase leading-tight">
                    COPYRIGHT © 2026 <br />
                    AIESEC IN USJ // DESIGN UNIT
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>

    </section>
  );
}
