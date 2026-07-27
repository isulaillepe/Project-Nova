"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from "framer-motion";
import { Mail } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

const socialLinks = [
  { icon: Mail, href: "mailto:niyomabodinie@aiesec.net", label: "Mail" },
  { icon: FaFacebookF, href: "https://www.facebook.com/share/19AgfSadu1/?mibextid=wwXIfr", label: "Facebook" },
  { icon: FaInstagram, href: "https://www.instagram.com/lc_usj?igsh=MWJqeXppczg1Nm9wdQ==", label: "Instagram" },
  { icon: FaWhatsapp, href: "https://chat.whatsapp.com/IsT7zFu6AIu0tTvkhY1oRB", label: "WhatsApp" },
];

const faqItems = [
  {
    question: "What is Project Nova?",
    answer: "Project Nova is a dynamic tech based initiative organized by AIESEC in the University of Sri Jayewardenepura, designed to empower school and university students by providing a platform where innovation, creativity, and opportunity come together. Through workshops, proposal submissions, and a final showcase, participants develop practical solutions to real-world challenges.",
  },
  {
    question: "Who can participate?",
    answer: "Undergraduates from any university (University Category) and school students aged 18+ (School Category) across Sri Lanka can participate. All teams must comprise of 4 to 5 members. Solo participation or teams of fewer than 4 members are strictly not permitted.",
  },
  {
    question: "How many members can join a team?",
    answer: "All teams must comprise of 4 to 5 members (including the team leader). Solo participation is not allowed. One person can represent only one team, and all team members must represent the same institution.",
  },
  {
    question: "What is the competition format & timeline?",
    answer: "Key stages include Team Registration (26–30 July), Proposal Submissions (1–6 Aug), Workshop (9 Aug), UI Submissions (12 Aug), and Finalist Selection (15 Aug), culminating in the Grand Finale on 30th August.",
  },
  {
    question: "Is participation free?",
    answer: "Yes! Participation in Project Nova is completely free, with no registration fees or hidden costs.",
  },
  {
    question: "What rewards can winners expect?",
    answer: "A total prize pool of LKR 180,000 across University (up to LKR 75,000) and School (up to LKR 20,000) categories, plus certificates and corporate exposure.",
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
      className={`group rounded-2xl bg-[#001233]/75 backdrop-blur-md border transition-all duration-300 ${
        isOpen
          ? "border-[#FFB81B] shadow-[0_0_20px_rgba(255,184,27,0.25)]"
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
              isOpen ? "text-[#FFB81B]" : "text-white group-hover:text-slate-200"
            }`}
          >
            {item.question}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className={`text-xl font-bold flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 transition-all group-hover:bg-white/10 ${
              isOpen ? "text-[#FFB81B]" : "text-slate-400"
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
  const pathname = usePathname();
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

  // Scroll locking: stop scroll down at 0.95 progress to keep footer permanent
  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.innerWidth >= 768 && progressRef.current >= 0.95 && e.touches.length > 0) {
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY; // positive deltaY = scrolling down

        if (deltaY > 0) {
          e.preventDefault();
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth >= 768 && progressRef.current >= 0.95 && e.deltaY > 0) {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (window.innerWidth >= 768 && progressRef.current >= 0.95) {
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

  // Greek Gods background scale: starts small (scale 0.5) at top of FAQ and gradually becomes large (scale 1.15) at bottom of FAQ page
  const greekGodsScale = useTransform(scrollYProgress, [0, 1.0], [0.5, 1.15]);

  // FAQ content fades out first
  const faqContentOpacity = useTransform(scrollYProgress, [0.20, 0.40], [1, 0]);
  const faqHeaderY = useTransform(scrollYProgress, [0.20, 0.40], ["0px", "-60px"]);
  const faqPointerEvents = useTransform(scrollYProgress, (v) => v > 0.40 ? "none" : "auto");
  const faqVisibility = useTransform(scrollYProgress, (v) => v > 0.42 ? "hidden" : "visible");

  // Register section and footer fade in together between 0.50 and 1.0
  const registerOpacity = useTransform(scrollYProgress, [0.50, 1.0], [0, 1]);
  const registerY = useTransform(scrollYProgress, [0.50, 1.0], ["30px", "0px"]);
  const registerPointerEvents = useTransform(scrollYProgress, (v) => v >= 1.0 ? "auto" : "none");

  const footerScale = useTransform(scrollYProgress, [0.50, 1.0], [0.95, 1.0]);

  return (
    <section id="faq" className="relative z-10 bg-black">

      {/* Pinned scroll container */}
      <div ref={containerRef} className="relative h-[210vh] z-10 bg-black">
        <div className="sticky top-0 h-screen w-full overflow-hidden select-none z-10 bg-black">

          {/* Backgrounds */}
          <div className="absolute inset-0 z-0 bg-black">
            <motion.div
              style={{
                backgroundImage: "url('/images/greek_gods_footer.jpeg')",
                scale: greekGodsScale,
                filter: "brightness(0.45)",
              }}
              className="absolute inset-0 bg-cover bg-center origin-center z-0"
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
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-none text-white font-space uppercase">
                <span
                  className="font-extrabold"
                  style={{ WebkitTextStroke: "1.5px #FFB81B", color: "transparent" }}
                >
                  FREQUENTLY ASKED
                </span>{" "}
                <span className="font-cormorant italic text-white font-medium lowercase">Questions</span>
              </h2>
              <div className="w-20 h-[3px] bg-gradient-to-r from-transparent via-[#FFB81B] to-transparent shadow-[0_0_12px_#FFB81B] rounded-full mx-auto mt-3" />
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
                Project Nova connects young innovators with industry leaders, mentors, and organizations — inspiring the next generation of school and university students to learn, collaborate, and create meaningful impact through technology.
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
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB81B] shadow-[0_0_8px_#FFB81B] animate-pulse" />
                    <span className="text-[#FFB81B] font-bold text-[10px] sm:text-xs tracking-widest uppercase">SYS.ONLINE</span>
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
                        className="flex h-9.5 w-9.5 items-center justify-center rounded-md bg-[#001233]/40 border border-white/5 text-slate-400 hover:text-white hover:border-[#FFB81B]/40 hover:bg-[#FFB81B]/10 transition-all duration-300"
                        aria-label={social.label}
                      >
                        <social.icon className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Right Column: Project Nova Logo & Copyright */}
                <Link
                  href="/"
                  onClick={(e) => {
                    if (pathname === "/") {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className="flex flex-col items-center md:items-end gap-1 text-center md:text-right select-none font-space cursor-pointer hover:opacity-80 transition-opacity"
                  aria-label="Project Nova Home"
                >
                  <div className="font-extrabold text-sm sm:text-base tracking-wider uppercase">
                    <span className="text-white">PROJECT</span>
                    <span className="text-[#FFB81B] ml-1">NOVA</span>
                  </div>
                  
                </Link>

              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>

    </section>
  );
}
