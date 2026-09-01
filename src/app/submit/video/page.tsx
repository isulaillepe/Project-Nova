import * as React from "react";
import { DemoVideoPortal } from "@/components/sections/DemoVideoPortal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo Video Submission | Project Nova",
  description: "Submit your YouTube demo video for Project Nova",
};

export default function VideoSubmitPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#000d21] flex items-center justify-center text-[#003599]">
          <div className="flex flex-col items-center gap-3 font-space">
            <div className="w-10 h-10 border-4 border-[#003599] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs uppercase tracking-widest font-bold">Loading Demo Video Portal...</span>
          </div>
        </div>
      }
    >
      <DemoVideoPortal />
    </React.Suspense>
  );
}
