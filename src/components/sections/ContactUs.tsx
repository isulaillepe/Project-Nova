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
      className={`relative bg-[#03081a]/90 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col items-center transition-all duration-300 group overflow-hidden select-none border border-[#003599]/30 hover:border-[#FFB81B]/60 hover:shadow-[0_0_40px_rgba(255,184,27,0.25)] ${
        isOCP ? "md:-translate-y-4 md:scale-105 z-20" : "md:translate-y-2 z-10"
      }`}
    >
      {/* Top Accent Line on Hover */}
      <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-transparent via-[#FFB81B]/60 to-transparent h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Yellow Shining Background Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFB81B]/12 via-[#FFB81B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Corner Accent Glow */}
      <div className="absolute top-0 right-0 w-28 h-28 sm:w-32 sm:h-32 rounded-full blur-2xl pointer-events-none bg-[#003599]/10 group-hover:bg-[#FFB81B]/25 transition-colors duration-500" />

      {/* Avatar Container */}
      <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full p-[2.5px] bg-gradient-to-b from-[#FFB81B]/40 via-[#003599] to-[#001233] group-hover:from-[#FFB81B] group-hover:via-[#FFB81B]/80 group-hover:to-[#001233] shadow-[0_0_20px_rgba(0,53,153,0.4)] group-hover:shadow-[0_0_35px_rgba(255,184,27,0.4)] flex items-center justify-center overflow-hidden shrink-0 transition-all duration-300">
        <div className="w-full h-full rounded-full bg-[#001233] overflow-hidden relative flex items-center justify-center">
          <Image
            src={contact.image}
            alt={contact.name}
            fill
            sizes="(max-width: 640px) 96px, 128px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Name & Role */}
      <div className="text-center mt-4 sm:mt-5 flex-1 flex flex-col justify-between w-full relative z-10">
        <div>
          <h3 className="text-lg sm:text-2xl font-extrabold text-white font-space tracking-tight group-hover:text-[#FFB81B] transition-colors duration-300">
            {contact.name}
          </h3>
          <p className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest mt-1 mb-4 sm:mb-5 text-[#FFB81B]">
            {contact.role}
          </p>
        </div>

        {/* Action Icon Row - Minimum 44px tap targets for mobile touch ergonomics */}
        <div className="flex items-center justify-center gap-3 sm:gap-3.5 mb-3 sm:mb-4">
          {/* LinkedIn Link */}
          {contact.linkedin ? (
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-[#003599]/50 hover:text-white hover:border-[#003599] transition-all active:scale-95 shadow-sm"
              aria-label={`${contact.name}'s LinkedIn`}
            >
              <FaLinkedinIn className="w-4 h-4" />
            </a>
          ) : (
            <span className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-600 cursor-not-allowed">
              <FaLinkedinIn className="w-4 h-4 opacity-40" />
            </span>
          )}

          {/* WhatsApp Link */}
          <a
            href={contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-emerald-600/40 hover:text-emerald-400 hover:border-emerald-500/50 transition-all active:scale-95 shadow-sm"
            aria-label={`Chat with ${contact.name} on WhatsApp`}
          >
            <FaWhatsapp className="w-4 h-4" />
          </a>

          {/* Email Link */}
          <a
            href={`mailto:${contact.email}`}
            className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-[#FFB81B]/20 hover:text-[#FFB81B] hover:border-[#FFB81B]/40 transition-all active:scale-95 shadow-sm"
            aria-label={`Email ${contact.name}`}
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-white/10 my-2.5 sm:my-3 relative z-10" />

      {/* Phone Link */}
      <a
        href={`tel:${contact.phoneRaw}`}
        className="flex items-center gap-2 text-xs sm:text-sm font-mono font-semibold text-slate-300 hover:text-[#FFB81B] transition-colors py-1 relative z-10"
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
      className="relative bg-black py-16 sm:py-28 md:py-36 overflow-hidden border-t border-white/5 px-4 sm:px-6 lg:px-8"
    >
      {/* Background ambient radial highlight */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] sm:h-[600px] w-[400px] sm:w-[600px] rounded-full bg-[#003599]/15 blur-[120px] sm:blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 h-[250px] sm:h-[350px] w-[250px] sm:w-[350px] rounded-full bg-[#FFB81B]/5 blur-[100px] sm:blur-[140px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Heading */}
        <div className="text-center space-y-3 mb-12 sm:mb-20 md:mb-24 select-none">
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

          <p className="text-[11px] sm:text-xs md:text-sm font-space text-slate-400 tracking-wider uppercase pt-2 max-w-md sm:max-w-none mx-auto leading-relaxed">
            REACH OUT TO THE PROJECT NOVA DELEGATE & ORGANIZING TEAM
          </p>
        </div>

        {/* 3 Contact Cards: Manasha (Left), Niyoma OCP (Middle - Elevated on Desktop), Vinothini (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center max-w-6xl mx-auto">
          {CONTACTS.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      </div>
    </section>
  );
}
