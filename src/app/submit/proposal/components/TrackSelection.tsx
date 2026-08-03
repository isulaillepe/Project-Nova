"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, GraduationCap, School } from "lucide-react";

interface TrackSelectionProps {
  onSelectTrack: (track: "university" | "school") => void;
}

export function TrackSelection({ onSelectTrack }: TrackSelectionProps) {
  return (
    <div className="relative min-h-screen bg-[#001233] text-white flex flex-col items-center justify-between overflow-hidden px-4 py-6 sm:py-8 select-none">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_75%_25%,rgba(255,184,27,0.12)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[#003599]/20 to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00359910_1px,transparent_1px),linear-gradient(to_bottom,#00359910_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      </div>

      {/* Top Header Navigation */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between z-20 pt-2">
        <Link href="/">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#FFB81B]/40 bg-[#FFB81B]/10 hover:bg-[#FFB81B]/20 text-[#FFB81B] text-xs font-bold font-space uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(255,184,27,0.2)]">
            <ArrowLeft className="h-4 w-4" />
            <span>BACK TO HOME</span>
          </button>
        </Link>
      </header>

      {/* Main Content Area */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center my-auto z-10 space-y-10 sm:space-y-14 py-6">
        {/* Main Title */}
        <div className="text-center space-y-3">
          <h1 className="font-cinzel font-black text-3xl sm:text-5xl md:text-6xl tracking-[0.08em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-[0_4px_30px_rgba(255,255,255,0.25)]">
            READY TO BEGIN?
          </h1>
          <p className="text-xs sm:text-sm text-[#cbd5e0] font-space uppercase tracking-widest max-w-md mx-auto">
            Select your registered competition track to enter the submission portal
          </p>
        </div>

        {/* Track Selection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-3xl px-2">
          {/* Card 1: UNIVERSITY TIER (Project Nova University Track) */}
          <button
            type="button"
            onClick={() => onSelectTrack("university")}
            className="group relative flex flex-col items-center justify-between p-8 sm:p-10 rounded-[24px] border border-[#003599]/30 bg-[#002066]/40 backdrop-blur-xl hover:border-[#FFB81B]/60 hover:bg-[#002066]/60 transition-all duration-300 shadow-[0_12px_40px_rgba(0,8,30,0.65)] hover:shadow-[0_0_35px_rgba(255,184,27,0.25)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-center min-h-[340px]"
          >
            {/* Pill Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#FFB81B]/40 bg-[#FFB81B]/10 text-[#FFB81B] text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(255,184,27,0.2)]">
                <GraduationCap className="h-3.5 w-3.5" />
                UNIVERSITY TIER
              </span>
            </div>

            {/* Official Project Nova Logo Artwork */}
            <div className="my-auto py-4 flex flex-col items-center justify-center space-y-3">
              <img
                src="/images/project_nova_logo.png"
                alt="Project Nova"
                className="h-14 sm:h-16 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(255,184,27,0.4)] group-hover:scale-105 transition-transform duration-300"
              />
              <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-[#FFB81B] border border-[#FFB81B]/30 px-3 py-0.5 rounded bg-[#FFB81B]/10">
                INTER-UNIVERSITY CHALLENGE
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-2 mt-4 font-space">
              <h3 className="font-cinzel font-bold text-xl sm:text-2xl text-white tracking-wide group-hover:text-[#FFB81B] transition-colors">
                University Track
              </h3>
              <p className="text-xs sm:text-sm text-[#cbd5e0] max-w-xs leading-relaxed">
                Sri Lanka&apos;s premier Inter-university technology & startup competition
              </p>
            </div>
          </button>

          {/* Card 2: SCHOOL TIER (Project Nova School Track) */}
          <button
            type="button"
            onClick={() => onSelectTrack("school")}
            className="group relative flex flex-col items-center justify-between p-8 sm:p-10 rounded-[24px] border border-[#003599]/30 bg-[#002066]/40 backdrop-blur-xl hover:border-[#FFB81B]/60 hover:bg-[#002066]/60 transition-all duration-300 shadow-[0_12px_40px_rgba(0,8,30,0.65)] hover:shadow-[0_0_35px_rgba(255,184,27,0.25)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-center min-h-[340px]"
          >
            {/* Pill Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#FFB81B]/40 bg-[#FFB81B]/10 text-[#FFB81B] text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(255,184,27,0.2)]">
                <School className="h-3.5 w-3.5" />
                SCHOOL TIER
              </span>
            </div>

            {/* Official Project Nova Logo Artwork */}
            <div className="my-auto py-4 flex flex-col items-center justify-center space-y-3">
              <img
                src="/images/project_nova_logo.png"
                alt="Project Nova"
                className="h-14 sm:h-16 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(255,184,27,0.4)] group-hover:scale-105 transition-transform duration-300"
              />
              <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-[#FFB81B] border border-[#FFB81B]/30 px-3 py-0.5 rounded bg-[#FFB81B]/10">
                INTER-SCHOOL INNOVATION
              </span>
            </div>

            {/* Title & Description */}
            <div className="space-y-2 mt-4 font-space">
              <h3 className="font-cinzel font-bold text-xl sm:text-2xl text-white tracking-wide group-hover:text-[#FFB81B] transition-colors">
                School Track
              </h3>
              <p className="text-xs sm:text-sm text-[#cbd5e0] max-w-xs leading-relaxed">
                The ultimate inter-school technology innovation challenge
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Watermark Text at Bottom Background */}
      <div className="w-full overflow-hidden flex justify-center pointer-events-none select-none my-4 opacity-10">
        <span className="font-cinzel font-black text-6xl sm:text-8xl md:text-[11vw] leading-none tracking-widest text-transparent border-text stroke-text text-slate-400">
          PROJECT NOVA
        </span>
      </div>

      {/* Footer copyright */}
      <footer className="w-full text-center py-4 text-[10px] sm:text-xs font-space text-[#8da2bd]/70 tracking-widest uppercase z-10 border-t border-[#003599]/20">
        © 2026 PROJECT NOVA. ORGANIZED BY AIESEC IN UNIVERSITY OF SRI JAYEWARDENEPURA. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}
