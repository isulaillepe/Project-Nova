"use client";

import React from "react";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { FaLinkedinIn, FaWhatsapp } from "react-icons/fa";

export interface ContactPerson {
  id: string;
  name: string;
  role: string;
  phone: string;
  phoneRaw: string;
  email: string;
  whatsapp: string;
  linkedin?: string;
  image: string;
  isMiddleOCP?: boolean;
}

export const CONTACTS: ContactPerson[] = [
  {
    id: "c1",
    name: "Manasha Fernando",
    role: "OC VP - DELEGATES",
    phone: "+94 74 119 0028",
    phoneRaw: "+94741190028",
    email: "manashafernando@aiesec.net",
    whatsapp: "https://wa.me/94741190028",
    image: "/images/committee/manasha.jpg",
    linkedin: "https://www.linkedin.com/in/manasha-fernando-83003b345",
  },
  {
    id: "c2",
    name: "Niyoma Bodinie",
    role: "ORGANIZING COMMITTEE PRESIDENT",
    phone: "+94 76 688 8848",
    phoneRaw: "+94766888848",
    email: "niyomabodinie@aiesec.net",
    whatsapp: "https://wa.me/94766888848",
    image: "/images/committee/niyoma.jpg",
    linkedin: "https://www.linkedin.com/in/niyoma",
    isMiddleOCP: true,
  },
  {
    id: "c3",
    name: "Vinothini Vickneshwaran",
    role: "OC VP - DELEGATES",
    phone: "+94 71 362 0303",
    phoneRaw: "+94713620303",
    email: "vinothinivickneshwaran27@gmail.com",
    whatsapp: "https://wa.me/94713620303",
    image: "/images/committee/vinothini.jpg",
    linkedin: "https://www.linkedin.com/in/vinothini-vickneshwaran-535071380",
  },
];

export function ContactCard({ contact }: { contact: ContactPerson }) {
  const isOCP = contact.isMiddleOCP;

  return (
    <div
      className={`relative bg-[#03081a]/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 flex flex-col items-center transition-all duration-300 group overflow-hidden select-none border ${
        isOCP
          ? "border-[#FFB81B]/60 shadow-[0_0_40px_rgba(255,184,27,0.25)] md:-translate-y-6 md:scale-105 z-20"
          : "border-[#003599]/30 hover:border-[#FFB81B]/40 hover:shadow-[0_0_30px_rgba(0,53,153,0.3)] md:translate-y-2 z-10"
      }`}
    >
      {/* Top OCP Badge Accent for Niyoma */}
      {isOCP && (
        <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-transparent via-[#FFB81B]/60 to-transparent h-[2px]" />
      )}

      {/* Corner Accent Glow */}
      <div
        className={`absolute top-0 right-0 w-28 h-28 rounded-full blur-2xl pointer-events-none transition-colors ${
          isOCP ? "bg-[#FFB81B]/15" : "bg-[#003599]/10 group-hover:bg-[#FFB81B]/10"
        }`}
      />

      {/* Avatar Container */}
      <div
        className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-[2.5px] shadow-[0_0_30px_rgba(0,53,153,0.5)] flex items-center justify-center overflow-hidden shrink-0 ${
          isOCP
            ? "bg-gradient-to-b from-[#FFB81B] via-[#FFB81B]/70 to-[#001233] shadow-[0_0_35px_rgba(255,184,27,0.4)]"
            : "bg-gradient-to-b from-[#FFB81B]/50 via-[#003599] to-[#001233]"
        }`}
      >
        <div className="w-full h-full rounded-full bg-[#001233] overflow-hidden relative flex items-center justify-center">
          <Image
            src={contact.image}
            alt={contact.name}
            fill
            sizes="128px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Name & Role */}
      <div className="text-center mt-5 flex-1 flex flex-col justify-between w-full">
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white font-space tracking-tight group-hover:text-[#FFB81B] transition-colors duration-300">
            {contact.name}
          </h3>
          <p
            className={`text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest mt-1 mb-5 ${
              isOCP ? "text-[#FFB81B]" : "text-slate-400"
            }`}
          >
            {contact.role}
          </p>
        </div>

        {/* Action Icon Row */}
        <div className="flex items-center justify-center gap-3.5 mb-4">
          {/* LinkedIn Link */}
          {contact.linkedin ? (
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-[#003599]/50 hover:text-white hover:border-[#003599] transition-all active:scale-95 shadow-sm"
              aria-label={`${contact.name}'s LinkedIn`}
            >
              <FaLinkedinIn className="w-4 h-4" />
            </a>
          ) : (
            <span className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-600 cursor-not-allowed">
              <FaLinkedinIn className="w-4 h-4 opacity-40" />
            </span>
          )}

          {/* WhatsApp Link */}
          <a
            href={contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-emerald-600/40 hover:text-emerald-400 hover:border-emerald-500/50 transition-all active:scale-95 shadow-sm"
            aria-label={`Chat with ${contact.name} on WhatsApp`}
          >
            <FaWhatsapp className="w-4 h-4" />
          </a>

          {/* Email Link */}
          <a
            href={`mailto:${contact.email}`}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-[#FFB81B]/20 hover:text-[#FFB81B] hover:border-[#FFB81B]/40 transition-all active:scale-95 shadow-sm"
            aria-label={`Email ${contact.name}`}
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-white/10 my-3" />

      {/* Phone Link */}
      <a
        href={`tel:${contact.phoneRaw}`}
        className="flex items-center gap-2 text-xs sm:text-sm font-mono font-semibold text-slate-300 hover:text-[#FFB81B] transition-colors py-1"
      >
        <Phone className="w-3.5 h-3.5 text-[#FFB81B] shrink-0" />
        <span>{contact.phone}</span>
      </a>
    </div>
  );
}

export default function ContactUs() {
  return (
    <section
      id="contact"
      className="relative bg-black py-28 sm:py-36 overflow-hidden border-t border-white/5"
    >
      {/* Background ambient radial highlight */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#003599]/15 blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 h-[350px] w-[350px] rounded-full bg-[#FFB81B]/5 blur-[140px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center space-y-3 mb-16 sm:mb-24 select-none">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-none text-white font-space uppercase">
            <span
              className="font-extrabold"
              style={{ WebkitTextStroke: "1.5px #FFB81B", color: "transparent" }}
            >
              CONTACT
            </span>{" "}
            <span className="font-cormorant italic text-white font-medium lowercase">
              Us
            </span>
          </h2>

          {/* Subtitle Underline Accent matching inspiration screenshot */}
          <div className="w-20 h-[3px] bg-gradient-to-r from-transparent via-[#FFB81B] to-transparent shadow-[0_0_12px_#FFB81B] rounded-full mx-auto mt-3" />

          <p className="text-xs sm:text-sm font-space text-slate-400 tracking-wider uppercase pt-2">
            REACH OUT TO THE PROJECT NOVA DELEGATE & ORGANIZING TEAM
          </p>
        </div>

        {/* 3 Contact Cards: Manasha (Left), Niyoma OCP (Middle - Elevated), Vinothini (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-center max-w-5xl mx-auto">
          {CONTACTS.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      </div>
    </section>
  );
}
