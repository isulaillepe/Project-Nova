"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldAlert, PlusCircle } from "lucide-react";
import { TeamCard, type TeamOption } from "../ui/TeamCard";

interface Step2TeamSelectProps {
  teams: TeamOption[];
  selectedTeamId: string;
  setSelectedTeamId: (teamId: string) => void;
  onNext: () => void;
  onBack: () => void;
  trackFilter?: "school" | "university" | null;
}

export function Step2TeamSelect({
  teams,
  selectedTeamId,
  setSelectedTeamId,
  onNext,
  onBack,
  trackFilter,
}: Step2TeamSelectProps) {
  const filteredTeams = React.useMemo(() => {
    if (!trackFilter) return teams;
    return teams.filter((t) => t.track === trackFilter);
  }, [teams, trackFilter]);

  const displayTeams = filteredTeams.length > 0 ? filteredTeams : teams;

  return (
    <div className="space-y-6 font-space">
      <div className="text-center sm:text-left">
        <h3 className="font-cinzel font-bold text-xl sm:text-2xl text-[#f7fafc] uppercase tracking-wide">
          Select Your Team
        </h3>
        <p className="text-xs sm:text-sm text-[#cbd5e0] mt-1 leading-relaxed">
          We found {teams.length} registered crew{teams.length === 1 ? "" : "s"} associated with your email address. Choose the team you are submitting this proposal for.
        </p>
      </div>

      {displayTeams.length === 0 ? (
        <div className="p-6 rounded-2xl border border-[#FFB81B]/40 bg-[#FFB81B]/5 text-center space-y-4">
          <ShieldAlert className="h-10 w-10 text-[#FFB81B] mx-auto" />
          <div className="space-y-1">
            <h4 className="font-cinzel font-bold text-lg text-white">No Registered Teams Found</h4>
            <p className="text-xs text-[#cbd5e0] max-w-sm mx-auto">
              No registered crews matching this email were found in our system. Make sure you registered your team first before submitting a proposal.
            </p>
          </div>
          <Link href="/register">
            <button className="py-3 px-6 rounded-xl bg-[#FFB81B] text-[#001233] font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 hover:brightness-105 cursor-pointer">
              <PlusCircle className="h-4 w-4" />
              <span>Register a Team Now</span>
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
          {displayTeams.map((team) => (
            <TeamCard
              key={team.teamId}
              team={team}
              selected={selectedTeamId === team.teamId}
              onSelect={setSelectedTeamId}
            />
          ))}
        </div>
      )}

      {/* Action Navigation */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="py-3.5 px-5 rounded-xl border border-[#003599]/40 bg-[#00173d]/60 hover:bg-[#002066]/40 text-[#cbd5e0] font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          disabled={!selectedTeamId}
          onClick={onNext}
          className="py-3.5 px-6 rounded-xl bg-[#FFB81B] hover:brightness-105 text-[#001233] font-bold uppercase tracking-wider text-xs sm:text-sm shadow-[0_0_20px_rgba(255,184,27,0.3)] transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
        >
          <span>Continue</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
