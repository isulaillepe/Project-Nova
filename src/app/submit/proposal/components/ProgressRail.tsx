"use client";

import * as React from "react";
import { Check } from "lucide-react";

interface StepItem {
  id: number;
  label: string;
  shortLabel: string;
}

const STEPS: StepItem[] = [
  { id: 1, label: "VERIFY EMAIL", shortLabel: "VERIFY" },
  { id: 2, label: "SELECT TEAM", shortLabel: "TEAM" },
  { id: 3, label: "PROJECT DETAILS", shortLabel: "PROJECT" },
  { id: 4, label: "REVIEW & SUBMIT", shortLabel: "REVIEW" },
  { id: 5, label: "SUBMITTED", shortLabel: "DONE" },
];

interface ProgressRailProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function ProgressRail({ currentStep, onStepClick }: ProgressRailProps) {
  return (
    <>
      {/* Desktop Vertical Progress Rail (≥md) */}
      <div className="hidden md:flex flex-col items-start space-y-8 relative pl-2 pr-6">
        {/* Continuous Background Line */}
        <div className="absolute left-[19px] top-3 bottom-3 w-[2px] bg-[#003599]/30 -z-10" />

        {/* Progress Fill Line */}
        <div
          className="absolute left-[19px] top-3 w-[2px] bg-[#FFB81B] transition-all duration-500 ease-out -z-10"
          style={{
            height: `${Math.min(((currentStep - 1) / (STEPS.length - 1)) * 100, 100)}%`,
          }}
        />

        {STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          const isClickable = step.id < currentStep && onStepClick;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3.5 group transition-colors ${
                isClickable ? "cursor-pointer" : ""
              }`}
              onClick={() => isClickable && onStepClick(step.id)}
            >
              {/* Node Icon/Box */}
              <div
                className={`h-6 w-6 rounded-md flex items-center justify-center border text-[11px] font-bold font-space transition-all duration-300 ${
                  isCompleted
                    ? "border-[#FFB81B] bg-[#FFB81B] text-[#001233] shadow-[0_0_12px_rgba(255,184,27,0.4)]"
                    : isActive
                    ? "border-[#FFB81B] bg-[#FFB81B]/20 text-[#FFB81B] scale-110 shadow-[0_0_15px_rgba(255,184,27,0.3)] ring-2 ring-[#FFB81B]/30 ring-offset-2 ring-offset-[#001233]"
                    : "border-[#003599]/50 bg-[#00173d] text-[#8da2bd]"
                }`}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : step.id}
              </div>

              {/* Label */}
              <span
                className={`text-xs font-bold font-space uppercase tracking-wider transition-colors ${
                  isActive
                    ? "text-[#FFB81B]"
                    : isCompleted
                    ? "text-[#f7fafc]"
                    : "text-[#8da2bd]/70"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Horizontal Stepper (<md) */}
      <div className="md:hidden w-full mb-6">
        <div className="flex items-center justify-between relative px-2">
          {/* Background Connector Line */}
          <div className="absolute left-6 right-6 top-3 h-[2px] bg-[#003599]/30 -z-10" />

          {/* Active Connector Fill */}
          <div
            className="absolute left-6 top-3 h-[2px] bg-[#FFB81B] transition-all duration-500 ease-out -z-10"
            style={{
              width: `calc(${((currentStep - 1) / (STEPS.length - 1)) * 100}% - 12px)`,
            }}
          />

          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep;
            const isActive = step.id === currentStep;

            return (
              <div key={step.id} className="flex flex-col items-center gap-1.5">
                <div
                  className={`h-6 w-6 rounded-md flex items-center justify-center border text-[10px] font-bold font-space transition-all ${
                    isCompleted
                      ? "border-[#FFB81B] bg-[#FFB81B] text-[#001233]"
                      : isActive
                      ? "border-[#FFB81B] bg-[#FFB81B]/20 text-[#FFB81B] scale-110 shadow-[0_0_10px_rgba(255,184,27,0.3)]"
                      : "border-[#003599]/50 bg-[#00173d] text-[#8da2bd]"
                  }`}
                >
                  {isCompleted ? <Check className="h-3 w-3 stroke-[3]" /> : step.id}
                </div>
                <span
                  className={`text-[9px] font-bold font-space uppercase tracking-tight ${
                    isActive ? "text-[#FFB81B]" : "text-[#8da2bd]/70"
                  }`}
                >
                  {step.shortLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
