import * as React from "react";
import { ProposalPortal } from "@/components/sections/ProposalPortal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proposal Submission - Project Nova",
  description: "Submit your finalized Canva proposal design link for Project Nova.",
};

export default function ProposalPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#000d21] flex items-center justify-center text-[#00e5ff]">
          <div className="flex flex-col items-center gap-3 font-space">
            <div className="w-10 h-10 border-4 border-[#00e5ff] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs uppercase tracking-widest font-bold">Loading Proposal Portal...</span>
          </div>
        </div>
      }
    >
      <ProposalPortal />
    </React.Suspense>
  );
}
