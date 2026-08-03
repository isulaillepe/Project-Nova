"use client";

import * as React from "react";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import type { TeamOption } from "./TeamCard";

interface ReviewSectionProps {
  email: string;
  team: TeamOption | null;
  projectTitle: string;
  problemStatement: string;
  proposedSolution: string;
  techStack?: string;
  githubUrl?: string;
  demoUrl?: string;
}

export function ReviewSection({
  email,
  team,
  projectTitle,
  problemStatement,
  proposedSolution,
  techStack,
  githubUrl,
  demoUrl,
}: ReviewSectionProps) {
  return (
    <div className="space-y-6 font-space text-left">
      {/* Email & Team Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-[#003599]/30 bg-[#00173d]/40">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8da2bd] block mb-1">
            Verified Email
          </span>
          <p className="text-sm font-semibold text-[#f7fafc] truncate">{email}</p>
        </div>

        <div className="p-4 rounded-xl border border-[#003599]/30 bg-[#00173d]/40">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8da2bd] block mb-1">
            Selected Team
          </span>
          <p className="text-sm font-semibold text-[#FFB81B] truncate">
            {team?.teamName || "N/A"}
          </p>
          <p className="text-[11px] text-[#cbd5e0] truncate">
            {team?.institutionName} ({team?.track === "school" ? "School" : "University"})
          </p>
        </div>
      </div>

      {/* Project Title */}
      <div className="p-4.5 rounded-xl border border-[#003599]/30 bg-[#00173d]/40 space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#8da2bd] block">
          Project Title
        </span>
        <h4 className="text-base sm:text-lg font-cinzel font-bold text-white">
          {projectTitle}
        </h4>
      </div>

      {/* Problem Statement */}
      <div className="p-4.5 rounded-xl border border-[#003599]/30 bg-[#00173d]/40 space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#8da2bd] block">
          Problem Statement
        </span>
        <p className="text-xs sm:text-sm text-[#cbd5e0] whitespace-pre-wrap leading-relaxed">
          {problemStatement}
        </p>
      </div>

      {/* Proposed Solution */}
      <div className="p-4.5 rounded-xl border border-[#003599]/30 bg-[#00173d]/40 space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#8da2bd] block">
          Proposed Solution
        </span>
        <p className="text-xs sm:text-sm text-[#cbd5e0] whitespace-pre-wrap leading-relaxed">
          {proposedSolution}
        </p>
      </div>

      {/* Tech Stack */}
      {techStack && (
        <div className="p-4 rounded-xl border border-[#003599]/30 bg-[#00173d]/40 space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8da2bd] block">
            Tech Stack
          </span>
          <div className="flex flex-wrap gap-2 pt-1">
            {techStack.split(",").map((tech, idx) => (
              <span
                key={idx}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-[#FFB81B]/10 text-[#FFB81B] border border-[#FFB81B]/25"
              >
                {tech.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {(githubUrl || demoUrl) && (
        <div className="p-4 rounded-xl border border-[#003599]/30 bg-[#00173d]/40 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8da2bd] block">
            Repository & Demo Links
          </span>
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#38bdf8] hover:underline"
              >
                <span>GitHub Repository</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#38bdf8] hover:underline"
              >
                <span>Live Demo / Video</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
