import { RegistrationForm } from "@/components/sections/RegistrationForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enlist - Project Nova",
  description: "Enlist your crew for Project Nova - A dynamic tech-based event for school and university students organized by AIESEC in University of Sri Jayewardenepura.",
  keywords: ["Project Nova", "enlist", "crew registration", "AIESEC", "Sri Jayewardenepura", "tech competition"],
};

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen bg-[#001233] pt-24 pb-16">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_75%_25%,rgba(255,184,27,0.12)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[#003599]/20 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RegistrationForm />
      </div>
    </div>
  );
}
