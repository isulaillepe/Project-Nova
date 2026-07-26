"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Download, ExternalLink, FileText, GraduationCap, School } from "lucide-react";

export default function BookletPage() {
  const universityPdfViewUrl = "https://drive.google.com/file/d/1yjWPZ9dqsjC9gEOxRnI6bQIPdt78FnD4/view?usp=sharing";
  const universityPdfEmbedUrl = "https://drive.google.com/file/d/1yjWPZ9dqsjC9gEOxRnI6bQIPdt78FnD4/preview";

  const schoolPdfViewUrl = "https://drive.google.com/file/d/1JInBHGQBzysNEp5ee4BbKk0K5UXlT-r6/view?usp=sharing";
  const schoolPdfEmbedUrl = "https://drive.google.com/file/d/1JInBHGQBzysNEp5ee4BbKk0K5UXlT-r6/preview";

  return (
    <div className="relative min-h-screen bg-[#020512] text-[#cbd5e0] font-space overflow-x-hidden selection:bg-[#FFB81B] selection:text-[#001233]">
      
      {/* Blueprint Grid Background Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-40 bg-[linear-gradient(to_right,rgba(0,53,153,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,53,153,0.08)_1px,transparent_1px)] bg-[size:32px_32px]" 
        aria-hidden="true" 
      />

      {/* Ambient Lighting Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-[#003599]/20 via-[#FFB81B]/10 to-transparent blur-[140px] opacity-70" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-[#FFB81B]/5 blur-[120px]" />
      </div>

      {/* Top Terminal Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#001233]/80 backdrop-blur-xl border-b border-[#003599]/30 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Return Home Link */}
          <Link
            href="/"
            className="group flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#cbd5e0] hover:text-[#FFB81B] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>&lt; // RETURN_HOME</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 space-y-16">
        
        {/* Title Block */}
        <div className="text-center space-y-6 flex flex-col items-center">
          {/* Project Nova Logo */}
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <img
              src="/images/project_nova_logo.png"
              alt="Project Nova"
              className="h-10 sm:h-14 w-auto object-contain filter drop-shadow-[0_0_20px_rgba(255,184,27,0.4)]"
            />
          </Link>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-space uppercase tracking-tight text-center select-none pt-2">
            <span 
              className="block font-black text-transparent leading-none"
              style={{
                WebkitTextStroke: "1.8px #FFB81B",
                filter: "drop-shadow(0 0 20px rgba(255, 184, 27, 0.25))",
              }}
            >
              EXECUTION
            </span>
            <span className="block font-cormorant italic font-medium text-white lowercase text-4xl sm:text-6xl md:text-7xl mt-[-0.15em]">
              Booklets<span className="animate-pulse text-[#FFB81B] font-sans font-bold">_</span>
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-xs sm:text-sm text-[#cbd5e0]/80 font-space font-light leading-relaxed tracking-wide pt-1">
            Access the official Project Nova delegate briefing documents for University and School categories.
          </p>
        </div>

        {/* Stats Metrics Card */}
        <div className="max-w-2xl mx-auto rounded-2xl bg-[#001233]/40 border border-[#003599]/30 backdrop-blur-md p-4 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
          <div className="grid grid-cols-3 divide-x divide-[#003599]/30 text-center">
            <div className="px-2 sm:px-4 space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#FFB81B] font-space tracking-tight">02</div>
              <div className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#cbd5e0]/60">DOCUMENTS</div>
            </div>
            <div className="px-2 sm:px-4 space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#FFB81B] font-space tracking-tight">V1.0</div>
              <div className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#cbd5e0]/60">REVISION</div>
            </div>
            <div className="px-2 sm:px-4 space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#FFB81B] font-space tracking-tight">OFFICIAL</div>
              <div className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#cbd5e0]/60">BRIEFINGS</div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1. UNIVERSITY CATEGORY DELEGATE BOOKLET */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          {/* Category Header Badge */}
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 rounded-xl bg-[#FFB81B]/15 border border-[#FFB81B]/40 text-[#FFB81B]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-cinzel font-extrabold text-white tracking-wide uppercase">
                University Category <span className="text-[#FFB81B]">Delegate Booklet</span>
              </h2>
              <p className="text-xs text-[#cbd5e0]/70 font-space font-light">
                Execution guidelines and essential rules for undergraduate participants.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-[#001233]/60 border border-[#003599]/40 p-4 sm:p-8 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,8,30,0.8)] space-y-6">
            {/* Card Terminal Header Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#003599]/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFB81B] animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FFB81B]">
                  NOVA_UNIVERSITY_DELEGATE_BRIEF
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#cbd5e0]/70">
                  DOC-001
                </span>
              </div>

              {/* Download Button */}
              <a
                href={universityPdfViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFB81B] text-[#001233] font-space font-extrabold text-xs tracking-widest uppercase shadow-[0_0_25px_rgba(255,184,27,0.35)] hover:scale-105 hover:bg-[#ffe9a8] transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD</span>
              </a>
            </div>

            {/* Embedded PDF Viewer Box */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#020512] shadow-2xl min-h-[550px] sm:min-h-[700px] md:min-h-[820px] flex flex-col group">
              {/* Popout Link Overlay Button */}
              <a
                href={universityPdfViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open full University booklet in new tab"
                className="absolute top-4 right-4 z-20 p-3 rounded-xl bg-[#001233]/90 border border-white/20 text-[#FFB81B] hover:bg-[#FFB81B] hover:text-[#001233] transition-all duration-300 backdrop-blur-md shadow-xl cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Google Drive PDF Preview iFrame */}
              <iframe
                src={universityPdfEmbedUrl}
                title="Project Nova University Delegate Booklet"
                className="w-full h-full flex-1 border-0 min-h-[550px] sm:min-h-[700px] md:min-h-[820px]"
                allow="autoplay"
                loading="lazy"
              />

              {/* Viewer Bottom Status Toolbar */}
              <div className="bg-[#001233]/90 border-t border-[#003599]/30 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#cbd5e0]/70">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#FFB81B]" />
                  <span>University Category // Official Briefing</span>
                </div>

                <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-[#FFB81B]">
                  <span>PROJECT NOVA // UNIVERSITY BRIEFING</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. SCHOOL CATEGORY DELEGATE BOOKLET */}
        {/* ========================================================================= */}
        <div className="space-y-4 pt-6">
          {/* Category Header Badge */}
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 rounded-xl bg-[#FFB81B]/15 border border-[#FFB81B]/40 text-[#FFB81B]">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-cinzel font-extrabold text-white tracking-wide uppercase">
                School Category <span className="text-[#FFB81B]">Delegate Booklet</span>
              </h2>
              <p className="text-xs text-[#cbd5e0]/70 font-space font-light">
                Execution guidelines and essential rules for school participants (aged 18+).
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-[#001233]/60 border border-[#003599]/40 p-4 sm:p-8 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,8,30,0.8)] space-y-6">
            {/* Card Terminal Header Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#003599]/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFB81B] animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FFB81B]">
                  NOVA_SCHOOL_DELEGATE_BRIEF
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#cbd5e0]/70">
                  DOC-002
                </span>
              </div>

              {/* Download Button */}
              <a
                href={schoolPdfViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFB81B] text-[#001233] font-space font-extrabold text-xs tracking-widest uppercase shadow-[0_0_25px_rgba(255,184,27,0.35)] hover:scale-105 hover:bg-[#ffe9a8] transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD</span>
              </a>
            </div>

            {/* Embedded PDF Viewer Box */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#020512] shadow-2xl min-h-[550px] sm:min-h-[700px] md:min-h-[820px] flex flex-col group">
              {/* Popout Link Overlay Button */}
              <a
                href={schoolPdfViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open full School booklet in new tab"
                className="absolute top-4 right-4 z-20 p-3 rounded-xl bg-[#001233]/90 border border-white/20 text-[#FFB81B] hover:bg-[#FFB81B] hover:text-[#001233] transition-all duration-300 backdrop-blur-md shadow-xl cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Google Drive PDF Preview iFrame */}
              <iframe
                src={schoolPdfEmbedUrl}
                title="Project Nova School Delegate Booklet"
                className="w-full h-full flex-1 border-0 min-h-[550px] sm:min-h-[700px] md:min-h-[820px]"
                allow="autoplay"
                loading="lazy"
              />

              {/* Viewer Bottom Status Toolbar */}
              <div className="bg-[#001233]/90 border-t border-[#003599]/30 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#cbd5e0]/70">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#FFB81B]" />
                  <span>School Category // Official Briefing</span>
                </div>

                <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-[#FFB81B]">
                  <span>PROJECT NOVA // SCHOOL BRIEFING</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Page Footer */}
      <footer className="border-t border-[#003599]/30 bg-[#001233]/40 py-8 text-center text-xs font-mono text-[#cbd5e0]/50 tracking-widest uppercase">
        <p>PROJECT NOVA // AIESEC IN USJ · ALL RIGHTS RESERVED</p>
      </footer>
    </div>
  );
}
