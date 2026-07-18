import { RegistrationForm } from "@/components/sections/RegistrationForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - Project Nova",
  description: "Register your team for Project Nova - A dynamic tech-based event for school and university students organized by AIESEC in University of Sri Jayewardenepura.",
  keywords: ["Project Nova", "register", "team registration", "AIESEC", "Sri Jayewardenepura", "tech competition"],
};

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 pt-24 pb-16">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-violet-600/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-indigo-600/10 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RegistrationForm />
      </div>
    </div>
  );
}