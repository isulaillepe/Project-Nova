import * as React from "react";
import { FigmaPortal } from "@/components/sections/FigmaPortal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UI/UX Prototype Submission | Project Nova",
  description: "Submit your Figma prototype for Project Nova UI/UX track",
};

export default function UIUXSubmitPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#000d21] flex items-center justify-center text-[#003599]">
          <div className="flex flex-col items-center gap-3 font-space">
            <div className="w-10 h-10 border-4 border-[#003599] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs uppercase tracking-widest font-bold">Loading UI/UX Portal...</span>
          </div>
        </div>
      }
    >
      <FigmaPortal />
    </React.Suspense>
  );
}