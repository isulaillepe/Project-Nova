"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
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
    answer: "Project Nova is a dynamic tech-based initiative organized by AIESEC in the University of Sri Jayewardenepura, designed to empower school and university students by providing a platform where innovation, creativity, and opportunity come together. Through workshops, proposal submissions, and a final showcase, participants develop practical solutions to real-world challenges.",
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
    answer: "The event timeline key milestones are: Team Registration (26th-30th July, Flash Round 01st-03rd Aug) → Proposal Submissions (01st-06th Aug) → Workshop & Shortlist Announcement (09th Aug) → UI Submission (12th Aug) → Final Teams Selection (15th Aug) → Grand Finale Event Day (30th Aug at USJ).",
  },
  {
    question: "Is participation free?",
    answer: "Yes! Participation in Project Nova is completely free, with no registration fees or hidden costs.",
  },
  {
    question: "What rewards can winners expect?",
    answer: "Teams compete for an overall cash prize treasury of LKR 180,000. University Category: LKR 75,000 (Champion), LKR 40,000 (1st Runner-Up), LKR 20,000 (2nd Runner-Up). School Category: LKR 20,000 (1st Place), LKR 15,000 (2nd Place), LKR 10,000 (3rd Place), along with certificates and corporate visibility.",
  },
];

interface FaqItemProps {
  item: typeof faqItems[number];
  index: number;
  openIndex: number | null;
  setOpenIndex: (index: number | null) => void;
}

function FaqItem({ item, index, openIndex, setOpenIndex }: FaqItemProps) {
  const isOpen = openIndex === index;

  return (
    <div
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
            className={`text-xl font-bold flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 transition-all group-hover:bg-white/10 shrink-0 ${
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
    </div>
  );
}

export default function Faq() {
  const pathname = usePathname();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative z-10 bg-black pt-20 sm:pt-28 pb-12 overflow-hidden">
      {/* Background graphic */}
      <div
        style={{
          backgroundImage: "url('/images/cosmic_faq_bg.png')",
          filter: "brightness(0.35)",
        }}
        className="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* FAQ Header */}
        <div className="w-full text-center mb-12 sm:mb-16">
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
        </div>

        {/* FAQ Accordion List */}
        <div className="w-full max-w-4xl mx-auto space-y-3 sm:space-y-4 mb-20">
          {faqItems.map((item, index) => (
            <FaqItem
              key={index}
              item={item}
              index={index}
              openIndex={openIndex}
              setOpenIndex={setOpenIndex}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="w-full border-t border-white/10 pt-10">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 px-2 sm:px-4">
            
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
              <div className="text-[8px] sm:text-[9px] text-slate-500 font-medium tracking-widest uppercase leading-tight">
                COPYRIGHT © 2026 <br />
                AIESEC IN USJ // DESIGN UNIT
              </div>
            </Link>

          </div>
        </div>

      </div>
    </section>
  );
}

