"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Home, Sparkles, Calendar, ArrowRight } from "lucide-react";
import type { TeamOption } from "../ui/TeamCard";

interface Step5SuccessProps {
  referenceId: string;
  selectedTeam: TeamOption | null;
  onReset: () => void;
}

export function Step5Success({ referenceId, selectedTeam, onReset }: Step5SuccessProps) {
  const formattedDate = React.useMemo(() => {
    return new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  return (
    <div className="text-center py-6 font-space space-y-6">
      {/* Icon Graphic */}
      <div className="relative inline-flex items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-[#FFB81B]/20" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#FFB81B] to-[#e0a015] shadow-[0_0_40px_rgba(255,184,27,0.4)]">
          <CheckCircle2 className="h-10 w-10 text-[#001233]" />
        </div>
      </div>

      {/* Success Title */}
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#FFB81B]/10 text-[#FFB81B] border border-[#FFB81B]/30">
          <Sparkles className="h-3.5 w-3.5" /> Proposal Submitted
        </span>
        <h3 className="font-cinzel font-extrabold text-2xl sm:text-3xl text-[#f7fafc] uppercase tracking-wide">
          Proposal Received
        </h3>
        <p className="text-xs sm:text-sm text-[#cbd5e0] max-w-md mx-auto leading-relaxed">
          Your project proposal for team{" "}
          <strong className="text-[#FFB81B]">{selectedTeam?.teamName || "your team"}</strong> has been successfully inscribed into Project Nova.
        </p>
      </div>

      {/* Reference Card */}
      <div className="p-5 rounded-2xl border border-[#003599]/40 bg-[#00173d]/60 max-w-md mx-auto text-left space-y-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-[#003599]/30 pb-2.5">
          <span className="text-xs text-[#8da2bd] font-bold uppercase tracking-wider">
            Reference ID
          </span>
          <span className="font-mono text-sm font-bold text-[#FFB81B]">
            {referenceId}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-[#cbd5e0]">
          <span>Submitted On</span>
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-[#cbd5e0]">
          <span>Track</span>
          <span className="capitalize">{selectedTeam?.track || "University"} Track</span>
        </div>
      </div>

      {/* Next Steps Timeline Box */}
      <div className="p-5 rounded-2xl border border-[#003599]/30 bg-[#001233]/40 max-w-md mx-auto text-left space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-widest text-[#FFB81B] flex items-center gap-2">
          <Calendar className="h-4 w-4" /> Next Steps & Timeline
        </h4>
        <ul className="space-y-2 text-xs text-[#cbd5e0]">
          <li className="flex items-start gap-2">
            <span className="text-[#FFB81B] font-bold">•</span>
            <span>
              <strong>Proposal Evaluation:</strong> 03rd Aug – 06th Aug 2026
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#FFB81B] font-bold">•</span>
            <span>
              <strong>Shortlist Announcement:</strong> 09th Aug 2026
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#FFB81B] font-bold">•</span>
            <span>
              <strong>Mentorship Workshop:</strong> 09th Aug 2026
            </span>
          </li>
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link href="/" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-[#FFB81B] hover:brightness-105 text-[#001233] font-extrabold uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(255,184,27,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2">
            <Home className="h-4 w-4" />
            <span>Return to Home</span>
          </button>
        </Link>

        <button
          onClick={onReset}
          className="w-full sm:w-auto py-3.5 px-6 rounded-xl border border-[#003599]/40 bg-[#00173d]/60 hover:bg-[#002066]/40 text-[#cbd5e0] font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 transition-colors"
        >
          <span>Submit Another Proposal</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
