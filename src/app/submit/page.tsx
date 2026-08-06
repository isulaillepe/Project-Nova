"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CategorySelectionPage() {
  return (
    <div className="relative min-h-screen bg-[#000d21] text-[#f7fafc] flex flex-col justify-between overflow-x-hidden font-space select-none">
      {/* Background blueprint grid and subtle radial lighting */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#0a254015_1px,transparent_1px),linear-gradient(to_bottom,#0a254015_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" 
      />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.08)_0%,rgba(0,53,153,0.05)_50%,transparent_70%)] blur-3xl pointer-events-none" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8 z-10">
        <div className="max-w-5xl w-full text-center space-y-10 sm:space-y-14">
          
          {/* Main Title */}
          <div className="space-y-3 animate-fade-in">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-wider text-white filter drop-shadow-[0_0_25px_rgba(255,255,255,0.2)] font-space">
              READY TO BEGIN?
            </h1>
            <p className="text-xs sm:text-sm text-[#cbd5e0]/70 uppercase tracking-[0.25em]">
              Select your competition tier to access the proposal portal
            </p>
          </div>

          {/* Category Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto">
            
            {/* University Tier Card */}
            <Link
              href="/submit/proposal?category=university"
              className="group relative bg-[#00173d]/60 backdrop-blur-xl border border-[#003885]/60 hover:border-[#00e5ff]/80 rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-between text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(0,229,255,0.25)] cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(0,229,255,0.15),transparent_70%)] pointer-events-none" />
              
              {/* Badge */}
              <div className="bg-[#002b66]/80 border border-[#00e5ff]/40 text-[#00e5ff] text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-8 shadow-[0_0_12px_rgba(0,229,255,0.2)]">
                UNIVERSITY TIER
              </div>

              {/* Logo / Graphic */}
              <div className="my-4 relative flex items-center justify-center h-28 w-full">
                <div className="absolute inset-0 bg-[#00e5ff]/10 rounded-full blur-2xl group-hover:bg-[#00e5ff]/20 transition-all" />
                <div className="relative flex flex-col items-center">
                  <Image
                    src="/images/project_nova_logo.png"
                    alt="Project Nova"
                    width={200}
                    height={40}
                    className="h-10 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(255,184,27,0.4)] group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="text-xl sm:text-2xl font-black text-white tracking-widest mt-2">
                    1.0
                  </span>
                </div>
              </div>

              {/* Text Info */}
              <div className="space-y-2 mt-4">
                <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wider group-hover:text-[#00e5ff] transition-colors">
                  Project Nova 1.0
                </h2>
                <p className="text-xs text-[#a0aec0] leading-relaxed max-w-xs font-sans">
                  Sri Lanka&apos;s premier inter-university startup and technology challenge
                </p>
              </div>

              {/* Action Prompt */}
              <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#00e5ff] group-hover:translate-x-1 transition-transform">
                <span>Proceed to Portal</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>

            {/* School Tier Card */}
            <Link
              href="/submit/proposal?category=school"
              className="group relative bg-[#00173d]/60 backdrop-blur-xl border border-[#003885]/60 hover:border-[#FFB81B]/80 rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-between text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(255,184,27,0.25)] cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(255,184,27,0.15),transparent_70%)] pointer-events-none" />

              {/* Badge */}
              <div className="bg-[#3d2b00]/80 border border-[#FFB81B]/40 text-[#FFB81B] text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-8 shadow-[0_0_12px_rgba(255,184,27,0.2)]">
                SCHOOL TIER
              </div>

              {/* Logo / Graphic */}
              <div className="my-4 relative flex items-center justify-center h-28 w-full">
                <div className="absolute inset-0 bg-[#FFB81B]/10 rounded-full blur-2xl group-hover:bg-[#FFB81B]/20 transition-all" />
                <div className="relative flex flex-col items-center">
                  <Image
                    src="/images/project_nova_logo.png"
                    alt="Project Nova Jr."
                    width={200}
                    height={40}
                    className="h-10 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(255,184,27,0.4)] group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="text-xl sm:text-2xl font-black text-[#FFB81B] tracking-widest mt-2">
                    Jr. 1.0
                  </span>
                </div>
              </div>

              {/* Text Info */}
              <div className="space-y-2 mt-4">
                <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wider group-hover:text-[#FFB81B] transition-colors">
                  Project Nova Jr. 1.0
                </h2>
                <p className="text-xs text-[#a0aec0] leading-relaxed max-w-xs font-sans">
                  The ultimate inter-school tech & innovation competition
                </p>
              </div>

              {/* Action Prompt */}
              <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FFB81B] group-hover:translate-x-1 transition-transform">
                <span>Proceed to Portal</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>

          </div>
        </div>
      </div>

      {/* Watermark / Large Graphic Text in Background */}
      <div className="relative w-full overflow-hidden flex justify-center items-center py-4 opacity-10 pointer-events-none">
        <span className="text-[12vw] font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-transparent select-none">
          PROJECT NOVA
        </span>
      </div>
    </div>
  );
}
