"use client";

import * as React from "react";
import { Check, GraduationCap, School, Users } from "lucide-react";

export interface TeamOption {
  teamId: string;
  teamName: string;
  track: "school" | "university" | string;
  institutionName: string;
  memberCount: number;
}

interface TeamCardProps {
  team: TeamOption;
  selected: boolean;
  onSelect: (teamId: string) => void;
}

export function TeamCard({ team, selected, onSelect }: TeamCardProps) {
  const isSchool = team.track === "school";

  return (
    <button
      type="button"
      onClick={() => onSelect(team.teamId)}
      className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 relative group cursor-pointer ${
        selected
          ? "border-[#FFB81B] bg-[#FFB81B]/10 shadow-[0_0_25px_rgba(255,184,27,0.25)]"
          : "border-[#003599]/40 bg-[#00173d]/60 hover:border-[#FFB81B]/50 hover:bg-[#002066]/40"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-cinzel font-bold text-lg text-white group-hover:text-[#FFB81B] transition-colors truncate">
              {team.teamName}
            </h4>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                isSchool
                  ? "border-cyan-500/40 bg-cyan-950/40 text-cyan-300"
                  : "border-[#FFB81B]/40 bg-[#FFB81B]/10 text-[#FFB81B]"
              }`}
            >
              {isSchool ? (
                <School className="h-3 w-3" />
              ) : (
                <GraduationCap className="h-3 w-3" />
              )}
              {isSchool ? "School Track" : "University Track"}
            </span>
          </div>

          <p className="text-xs text-[#cbd5e0] truncate font-space">
            {team.institutionName || "Institution Not Specified"}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-[#8da2bd] font-space pt-1">
            <Users className="h-3.5 w-3.5 text-[#FFB81B]" />
            <span>{team.memberCount || 4} Crew Members</span>
          </div>
        </div>

        {/* Selected Check Indicator */}
        <div
          className={`h-6 w-6 rounded-full flex items-center justify-center border transition-all shrink-0 mt-1 ${
            selected
              ? "border-[#FFB81B] bg-[#FFB81B] text-[#001233]"
              : "border-[#003599]/60 bg-transparent text-transparent group-hover:border-[#FFB81B]/60"
          }`}
        >
          <Check className="h-4 w-4 stroke-[3]" />
        </div>
      </div>
    </button>
  );
}
