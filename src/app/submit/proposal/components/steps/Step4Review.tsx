"use client";

import * as React from "react";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { ReviewSection } from "../ui/ReviewSection";
import type { TeamOption } from "../ui/TeamCard";
import type { ProjectInput } from "@/lib/validations/proposal";
import { submitProposal } from "../../actions";

interface Step4ReviewProps {
  email: string;
  selectedTeam: TeamOption | null;
  projectDetails: ProjectInput;
  onSuccess: (referenceId: string) => void;
  onBack: () => void;
}

export function Step4Review({
  email,
  selectedTeam,
  projectDetails,
  onSuccess,
  onBack,
}: Step4ReviewProps) {
  const [confirmed, setConfirmed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) {
      setError("Please check the confirmation box before submitting.");
      return;
    }

    if (!selectedTeam) {
      setError("No team selected.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("teamId", selectedTeam.teamId);
      formData.append("projectTitle", projectDetails.projectTitle);
      formData.append("problemStatement", projectDetails.problemStatement);
      formData.append("proposedSolution", projectDetails.proposedSolution);
      formData.append("techStack", projectDetails.techStack || "");
      formData.append("githubUrl", projectDetails.githubUrl || "");
      formData.append("demoUrl", projectDetails.demoUrl || "");
      formData.append("confirmed", "true");

      const res = await submitProposal(formData);
      if (!res.success || !res.referenceId) {
        setError(res.error || "Failed to submit proposal. Please try again.");
      } else {
        onSuccess(res.referenceId);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-space">
      <div className="text-center sm:text-left">
        <h3 className="font-cinzel font-bold text-xl sm:text-2xl text-[#f7fafc] uppercase tracking-wide">
          Review & Submit Proposal
        </h3>
        <p className="text-xs sm:text-sm text-[#cbd5e0] mt-1 leading-relaxed">
          Please carefully verify all details before final submission. Submissions cannot be edited after dispatch.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl border border-red-500/50 bg-red-500/10 text-red-300 text-xs sm:text-sm flex items-start gap-2 animate-fadeIn">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Summary View */}
      <ReviewSection
        email={email}
        team={selectedTeam}
        projectTitle={projectDetails.projectTitle}
        problemStatement={projectDetails.problemStatement}
        proposedSolution={projectDetails.proposedSolution}
        techStack={projectDetails.techStack}
        githubUrl={projectDetails.githubUrl}
        demoUrl={projectDetails.demoUrl}
      />

      {/* Confirmation Checkbox */}
      <div className="p-4 rounded-xl border border-[#FFB81B]/40 bg-[#FFB81B]/10">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => {
              setConfirmed(e.target.checked);
              if (error) setError(null);
            }}
            className="mt-0.5 h-4 w-4 rounded border-[#FFB81B] bg-[#00173d] text-[#FFB81B] focus:ring-[#FFB81B] focus:ring-offset-[#001233]"
          />
          <span className="text-xs sm:text-sm text-[#f7fafc] leading-snug">
            I confirm that this proposal is complete, accurate, and represents original work by team{" "}
            <strong className="text-[#FFB81B]">{selectedTeam?.teamName}</strong>.
          </span>
        </label>
      </div>

      {/* Action Navigation */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          type="button"
          disabled={loading}
          onClick={onBack}
          className="py-3.5 px-5 rounded-xl border border-[#003599]/40 bg-[#00173d]/60 hover:bg-[#002066]/40 text-[#cbd5e0] font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Edit Details</span>
        </button>

        <button
          type="submit"
          disabled={loading || !confirmed}
          className="py-4 px-8 rounded-xl bg-[#FFB81B] hover:brightness-105 text-[#001233] font-extrabold uppercase tracking-widest text-xs sm:text-sm shadow-[0_0_25px_rgba(255,184,27,0.4)] transition-all cursor-pointer flex items-center gap-2.5 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Submit Proposal</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
