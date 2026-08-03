"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, Code2, FileText, Globe, Lightbulb } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import type { ProjectInput } from "@/lib/validations/proposal";

interface Step3ProjectDetailsProps {
  formData: ProjectInput;
  setFormData: React.Dispatch<React.SetStateAction<ProjectInput>>;
  onNext: () => void;
  onBack: () => void;
}

export function Step3ProjectDetails({
  formData,
  setFormData,
  onNext,
  onBack,
}: Step3ProjectDetailsProps) {
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.projectTitle || formData.projectTitle.trim().length < 5) {
      errs.projectTitle = "Project title must be at least 5 characters.";
    } else if (formData.projectTitle.length > 120) {
      errs.projectTitle = "Project title cannot exceed 120 characters.";
    }

    if (!formData.problemStatement || formData.problemStatement.trim().length < 50) {
      errs.problemStatement = "Problem statement must be at least 50 characters.";
    } else if (formData.problemStatement.length > 2000) {
      errs.problemStatement = "Problem statement cannot exceed 2000 characters.";
    }

    if (!formData.proposedSolution || formData.proposedSolution.trim().length < 50) {
      errs.proposedSolution = "Proposed solution must be at least 50 characters.";
    } else if (formData.proposedSolution.length > 3000) {
      errs.proposedSolution = "Proposed solution cannot exceed 3000 characters.";
    }

    if (formData.githubUrl && !/^https?:\/\/.+/.test(formData.githubUrl)) {
      errs.githubUrl = "Please enter a valid URL (starting with http:// or https://)";
    }

    if (formData.demoUrl && !/^https?:\/\/.+/.test(formData.demoUrl)) {
      errs.demoUrl = "Please enter a valid URL (starting with http:// or https://)";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  const updateField = (field: keyof ProjectInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-space">
      <div className="text-center sm:text-left">
        <h3 className="font-cinzel font-bold text-xl sm:text-2xl text-[#f7fafc] uppercase tracking-wide">
          Project Proposal Details
        </h3>
        <p className="text-xs sm:text-sm text-[#cbd5e0] mt-1 leading-relaxed">
          Provide full details of your project concept, target problem, and tech stack.
        </p>
      </div>

      {/* Project Title */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#cbd5e0] flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-[#FFB81B]" />
            Project Title *
          </span>
          <span className="text-[10px] text-[#8da2bd] font-normal">
            {formData.projectTitle?.length || 0}/120
          </span>
        </label>
        <input
          type="text"
          value={formData.projectTitle || ""}
          onChange={(e) => updateField("projectTitle", e.target.value)}
          placeholder="e.g. AgriVision - AI-Powered Crop Disease Detection"
          required
          maxLength={120}
          className={`w-full px-4 py-3.5 rounded-xl border bg-[#00173d]/60 text-white placeholder-[#8da2bd]/60 text-sm focus:outline-none transition-all ${
            errors.projectTitle
              ? "border-red-500/80 focus:ring-2 focus:ring-red-500/40"
              : "border-[#003599]/40 focus:border-[#FFB81B] focus:ring-2 focus:ring-[#FFB81B]/30"
          }`}
        />
        {errors.projectTitle && (
          <p className="text-xs text-red-400 font-medium">{errors.projectTitle}</p>
        )}
      </div>

      {/* Problem Statement */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#cbd5e0] flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Lightbulb className="h-4 w-4 text-[#FFB81B]" />
            Problem Statement *
          </span>
          <span className="text-[10px] text-[#8da2bd] font-normal">
            {formData.problemStatement?.length || 0}/2000
          </span>
        </label>
        <textarea
          rows={4}
          value={formData.problemStatement || ""}
          onChange={(e) => updateField("problemStatement", e.target.value)}
          placeholder="Describe the specific problem or challenge your project addresses in detail..."
          required
          maxLength={2000}
          className={`w-full px-4 py-3 rounded-xl border bg-[#00173d]/60 text-white placeholder-[#8da2bd]/60 text-sm focus:outline-none transition-all resize-y ${
            errors.problemStatement
              ? "border-red-500/80 focus:ring-2 focus:ring-red-500/40"
              : "border-[#003599]/40 focus:border-[#FFB81B] focus:ring-2 focus:ring-[#FFB81B]/30"
          }`}
        />
        {errors.problemStatement && (
          <p className="text-xs text-red-400 font-medium">{errors.problemStatement}</p>
        )}
      </div>

      {/* Proposed Solution */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#cbd5e0] flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Code2 className="h-4 w-4 text-[#FFB81B]" />
            Proposed Solution *
          </span>
          <span className="text-[10px] text-[#8da2bd] font-normal">
            {formData.proposedSolution?.length || 0}/3000
          </span>
        </label>
        <textarea
          rows={5}
          value={formData.proposedSolution || ""}
          onChange={(e) => updateField("proposedSolution", e.target.value)}
          placeholder="Explain your technical solution, core features, architecture, and expected impact..."
          required
          maxLength={3000}
          className={`w-full px-4 py-3 rounded-xl border bg-[#00173d]/60 text-white placeholder-[#8da2bd]/60 text-sm focus:outline-none transition-all resize-y ${
            errors.proposedSolution
              ? "border-red-500/80 focus:ring-2 focus:ring-red-500/40"
              : "border-[#003599]/40 focus:border-[#FFB81B] focus:ring-2 focus:ring-[#FFB81B]/30"
          }`}
        />
        {errors.proposedSolution && (
          <p className="text-xs text-red-400 font-medium">{errors.proposedSolution}</p>
        )}
      </div>

      {/* Tech Stack */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#cbd5e0] block">
          Tech Stack (Comma-separated)
        </label>
        <input
          type="text"
          value={formData.techStack || ""}
          onChange={(e) => updateField("techStack", e.target.value)}
          placeholder="e.g. Next.js, TensorFlow, Firebase, Python, React Native"
          className="w-full px-4 py-3.5 rounded-xl border border-[#003599]/40 bg-[#00173d]/60 text-white placeholder-[#8da2bd]/60 text-sm focus:border-[#FFB81B] focus:ring-2 focus:ring-[#FFB81B]/30 focus:outline-none transition-all"
        />
      </div>

      {/* Repository & Demo Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#cbd5e0] flex items-center gap-1.5">
            <FaGithub className="h-4 w-4 text-[#8da2bd]" />
            GitHub Repo (Optional)
          </label>
          <input
            type="url"
            value={formData.githubUrl || ""}
            onChange={(e) => updateField("githubUrl", e.target.value)}
            placeholder="https://github.com/..."
            className={`w-full px-4 py-3 rounded-xl border bg-[#00173d]/60 text-white placeholder-[#8da2bd]/60 text-xs focus:outline-none transition-all ${
              errors.githubUrl
                ? "border-red-500/80"
                : "border-[#003599]/40 focus:border-[#FFB81B]"
            }`}
          />
          {errors.githubUrl && (
            <p className="text-[11px] text-red-400">{errors.githubUrl}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[#cbd5e0] flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-[#8da2bd]" />
            Demo / Video Link (Optional)
          </label>
          <input
            type="url"
            value={formData.demoUrl || ""}
            onChange={(e) => updateField("demoUrl", e.target.value)}
            placeholder="https://youtu.be/..."
            className={`w-full px-4 py-3 rounded-xl border bg-[#00173d]/60 text-white placeholder-[#8da2bd]/60 text-xs focus:outline-none transition-all ${
              errors.demoUrl
                ? "border-red-500/80"
                : "border-[#003599]/40 focus:border-[#FFB81B]"
            }`}
          />
          {errors.demoUrl && (
            <p className="text-[11px] text-red-400">{errors.demoUrl}</p>
          )}
        </div>
      </div>

      {/* Action Navigation */}
      <div className="flex items-center justify-between gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="py-3.5 px-5 rounded-xl border border-[#003599]/40 bg-[#00173d]/60 hover:bg-[#002066]/40 text-[#cbd5e0] font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <button
          type="submit"
          className="py-3.5 px-6 rounded-xl bg-[#FFB81B] hover:brightness-105 text-[#001233] font-bold uppercase tracking-wider text-xs sm:text-sm shadow-[0_0_20px_rgba(255,184,27,0.3)] transition-all cursor-pointer flex items-center gap-2"
        >
          <span>Review Proposal</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
