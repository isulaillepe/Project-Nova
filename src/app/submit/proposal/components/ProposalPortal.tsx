"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  HelpCircle,
  Loader2,
  Mail,
  Send,
  AlertCircle,
} from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import { sendOTP, verifyOTP, getTeamsByEmail, submitProposal } from "../actions";
import { OTPInput } from "./ui/OTPInput";
import type { TeamOption } from "./ui/TeamCard";

interface ProposalPortalProps {
  track: "university" | "school";
  onBackToHub: () => void;
}

export function ProposalPortal({ track, onBackToHub }: ProposalPortalProps) {
  // Stepper State: 1 = IDENTIFY, 2 = VERIFY, 3 = UPLOAD, 4 = SUCCESS
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);

  // Form inputs & State
  const [email, setEmail] = React.useState("");
  const [otpCode, setOtpCode] = React.useState("");
  const [teams, setTeams] = React.useState<TeamOption[]>([]);
  const [selectedTeam, setSelectedTeam] = React.useState<TeamOption | null>(null);

  // Step 3 Inputs
  const [youtubeUrl, setYoutubeUrl] = React.useState("");
  const [pdfFile, setPdfFile] = React.useState<File | null>(null);
  const [pdfFileName, setPdfFileName] = React.useState("");

  // Loading & Errors
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [cooldown, setCooldown] = React.useState(0);
  const [referenceId, setReferenceId] = React.useState("");

  const trackTitle = track === "school" ? "Project Nova - School Track" : "Project Nova - University Track";

  // Countdown timer for OTP resend
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Step 1: Send Verification Code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // First check if email is registered with any team
      const teamsRes = await getTeamsByEmail(email);
      if (!teamsRes.success || !teamsRes.teams || teamsRes.teams.length === 0) {
        setError("This email address is not registered with any team.");
        setLoading(false);
        return;
      }

      setTeams(teamsRes.teams);
      setSelectedTeam(teamsRes.teams[0]);

      const formData = new FormData();
      formData.append("email", email);

      const otpRes = await sendOTP(formData);
      if (!otpRes.success) {
        setError(otpRes.error || "Failed to send verification code.");
      } else {
        setStep(2);
        setCooldown(60);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("code", otpCode);

      const res = await verifyOTP(formData);
      if (!res.success) {
        setError(res.error || "Verification failed.");
      } else {
        setStep(3);
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Handle PDF Drop / Select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Please upload a document in PDF format.");
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setError("File capacity should not exceed 50 MB.");
        return;
      }
      setError(null);
      setPdfFile(file);
      setPdfFileName(file.name);
    }
  };

  // Step 3: Upload & Submit Proposal
  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) {
      setError("No registered team found.");
      return;
    }

    if (!youtubeUrl) {
      setError("Please enter a valid YouTube video link.");
      return;
    }

    if (!pdfFile && !pdfFileName) {
      setError("Please upload your proposal document in PDF format.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("teamId", selectedTeam.teamId);
      formData.append("projectTitle", `${selectedTeam.teamName} Proposal`);
      formData.append("problemStatement", `Proposal document submitted: ${pdfFileName}`);
      formData.append("proposedSolution", `YouTube Pitch: ${youtubeUrl}`);
      formData.append("demoUrl", youtubeUrl);
      formData.append("confirmed", "true");
      if (pdfFile) {
        formData.append("pdfFile", pdfFile);
      }

      const res = await submitProposal(formData);
      if (!res.success || !res.referenceId) {
        setError(res.error || "Submission failed. Please try again.");
      } else {
        setReferenceId(res.referenceId);
        setStep(4);
      }
    } catch {
      setError("An error occurred during submission. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#001233] text-white flex flex-col font-space relative overflow-x-hidden pt-28 sm:pt-32 pb-16">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_75%_25%,rgba(255,184,27,0.12)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[#003599]/20 to-transparent blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00359910_1px,transparent_1px),linear-gradient(to_bottom,#00359910_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      </div>

      {/* Top Header Navigation with Top Padding */}
      <header className="px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto flex items-center justify-between z-20 mb-6 pt-4 sm:pt-6">
        <button
          onClick={onBackToHub}
          className="inline-flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-full border border-[#FFB81B]/40 bg-[#FFB81B]/10 hover:bg-[#FFB81B]/20 text-[#FFB81B] text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(255,184,27,0.2)]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>BACK TO HUB</span>
        </button>
      </header>

      {/* Main Container: Two Column Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-2 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Card */}
        <div className="lg:col-span-8 bg-[#002066]/40 backdrop-blur-xl border border-[#003599]/30 rounded-[24px] p-6 sm:p-10 shadow-[0_12px_40px_rgba(0,8,30,0.65)] flex flex-col justify-between min-h-[560px] relative overflow-hidden">
          
          {/* Header Title inside Card */}
          <div className="text-center space-y-1 mb-8">
            <h2 className="font-cinzel font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
              {trackTitle}
            </h2>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFB81B]">
              PROPOSAL SUBMISSION PORTAL
            </p>
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center justify-center gap-4 sm:gap-12 relative mb-10 max-w-md mx-auto w-full">
            {/* Connecting Lines */}
            <div className="absolute top-4 left-8 right-8 h-[2px] bg-[#003599]/40 -z-10" />
            <div
              className="absolute top-4 left-8 h-[2px] bg-[#FFB81B] transition-all duration-500 -z-10"
              style={{
                width: step === 1 ? "0%" : step === 2 ? "50%" : "100%",
              }}
            />

            {/* Step 1 Node */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step > 1
                    ? "bg-[#FFB81B] text-[#001233] shadow-[0_0_15px_rgba(255,184,27,0.4)]"
                    : step === 1
                    ? "bg-[#00173d] border-2 border-[#FFB81B] text-[#FFB81B] shadow-[0_0_20px_rgba(255,184,27,0.3)] ring-2 ring-[#FFB81B]/30 ring-offset-2 ring-offset-[#001233]"
                    : "bg-[#00173d] border border-[#003599]/60 text-[#8da2bd]"
                }`}
              >
                {step > 1 ? <Check className="h-4 w-4 stroke-[3]" /> : "1"}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= 1 ? "text-[#FFB81B]" : "text-[#8da2bd]"}`}>
                IDENTIFY
              </span>
            </div>

            {/* Step 2 Node */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step > 2
                    ? "bg-[#FFB81B] text-[#001233] shadow-[0_0_15px_rgba(255,184,27,0.4)]"
                    : step === 2
                    ? "bg-[#00173d] border-2 border-[#FFB81B] text-[#FFB81B] shadow-[0_0_20px_rgba(255,184,27,0.3)] ring-2 ring-[#FFB81B]/30 ring-offset-2 ring-offset-[#001233]"
                    : "bg-[#00173d] border border-[#003599]/60 text-[#8da2bd]"
                }`}
              >
                {step > 2 ? <Check className="h-4 w-4 stroke-[3]" /> : "2"}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= 2 ? "text-[#FFB81B]" : "text-[#8da2bd]"}`}>
                VERIFY
              </span>
            </div>

            {/* Step 3 Node */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step >= 3
                    ? "bg-[#00173d] border-2 border-[#FFB81B] text-[#FFB81B] shadow-[0_0_20px_rgba(255,184,27,0.3)] ring-2 ring-[#FFB81B]/30 ring-offset-2 ring-offset-[#001233]"
                    : "bg-[#00173d] border border-[#003599]/60 text-[#8da2bd]"
                }`}
              >
                3
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= 3 ? "text-[#FFB81B]" : "text-[#8da2bd]"}`}>
                UPLOAD
              </span>
            </div>
          </div>

          {/* Global Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl border border-red-500/50 bg-red-950/40 text-red-300 text-xs sm:text-sm flex items-center gap-3 animate-fadeIn">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Step 1 Form: IDENTIFY */}
          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-6 max-w-lg mx-auto w-full my-auto">
              <div className="text-center flex items-center justify-center gap-2 mb-4">
                <Mail className="h-5 w-5 text-[#FFB81B]" />
                <h3 className="font-cinzel font-bold text-lg text-white">Email Verification</h3>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#cbd5e0] block">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter your registered email address"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-[#003599]/40 bg-[#00173d]/60 text-white placeholder-[#8da2bd]/50 text-sm focus:border-[#FFB81B] focus:ring-2 focus:ring-[#FFB81B]/30 focus:outline-none transition-all"
                />
              </div>

              {/* Minimal Verification Box */}
              <div className="flex justify-center pt-2">
                <div className="p-3 px-5 rounded-xl border border-[#003599]/40 bg-[#00173d]/60 flex items-center justify-between gap-6 max-w-sm w-full">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-[#FFB81B]/20 border border-[#FFB81B] flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-[#FFB81B] stroke-[3]" />
                    </div>
                    <span className="text-xs font-semibold text-white">Verification Ready</span>
                  </div>
                  <div className="flex flex-col items-end text-[9px] text-[#8da2bd]">
                    <span className="font-bold text-[#FFB81B] tracking-wider uppercase">PROJECT NOVA</span>
                    <span>Secure Verification</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-xl bg-[#FFB81B] hover:brightness-105 text-[#001233] font-bold uppercase tracking-widest text-xs sm:text-sm shadow-[0_0_20px_rgba(255,184,27,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>SEND VERIFICATION CODE</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2 Form: VERIFY */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-8 max-w-lg mx-auto w-full my-auto">
              <div className="text-center space-y-2">
                <h3 className="font-cinzel font-bold text-xl text-white">Verify Your Email</h3>
                <p className="text-xs text-[#cbd5e0]">
                  A 6-digit OTP code has been sent to <strong className="text-[#FFB81B]">{email}</strong>.
                </p>
              </div>

              <div className="pt-2">
                <OTPInput
                  value={otpCode}
                  onChange={(val) => {
                    setOtpCode(val);
                    if (error) setError(null);
                  }}
                  disabled={loading}
                  error={!!error}
                />
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full py-4 px-6 rounded-xl bg-[#FFB81B] hover:brightness-105 text-[#001233] font-bold uppercase tracking-widest text-xs sm:text-sm shadow-[0_0_20px_rgba(255,184,27,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>VERIFY CODE</span>
                    <Check className="h-4 w-4 stroke-[3]" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-4 text-xs font-space">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtpCode("");
                    setError(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-[#003599]/40 bg-[#00173d]/60 text-[#cbd5e0] hover:text-[#FFB81B] font-bold uppercase tracking-wider cursor-pointer"
                >
                  EDIT DETAILS
                </button>

                <button
                  type="button"
                  disabled={cooldown > 0 || loading}
                  onClick={handleSendCode}
                  className="text-[#8da2bd] hover:text-[#FFB81B] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          )}

          {/* Step 3 Form: UPLOAD */}
          {step === 3 && (
            <form onSubmit={handleSubmitProposal} className="space-y-6 max-w-xl mx-auto w-full my-auto">
              <div className="text-center space-y-1">
                <h3 className="font-cinzel font-bold text-xl sm:text-2xl text-white">Proposal Upload</h3>
                <h4 className="font-cinzel font-black text-2xl text-[#FFB81B]">
                  {selectedTeam?.teamName || "Team"}
                </h4>
                <p className="text-xs text-[#cbd5e0]">
                  Submitter: {email} (Leader)
                </p>
              </div>

              {/* YouTube Video Link Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#cbd5e0] flex items-center gap-1.5">
                  <FaYoutube className="h-4 w-4 text-red-500" />
                  YOUTUBE VIDEO LINK
                </label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => {
                    setYoutubeUrl(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-[#003599]/40 bg-[#00173d]/60 text-white placeholder-[#8da2bd]/50 text-sm focus:border-[#FFB81B] focus:ring-2 focus:ring-[#FFB81B]/30 focus:outline-none transition-all"
                />
                <p className="text-[10px] text-[#8da2bd] font-normal">
                  Provide the link to your project demonstration video. Ensure it is set to Public or Unlisted.
                </p>
              </div>

              {/* Proposal PDF Document File Drag & Drop Zone */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#cbd5e0] flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-[#FFB81B]" />
                  PROPOSAL DOCUMENT (PDF)
                </label>

                <label className="relative border-2 border-dashed border-[#003599]/50 hover:border-[#FFB81B] bg-[#00173d]/40 hover:bg-[#002066]/30 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group text-center min-h-[160px]">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="sr-only"
                  />

                  <FileText className="h-10 w-10 text-[#FFB81B] mb-3 group-hover:scale-110 transition-transform" />

                  {pdfFileName ? (
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-[#FFB81B] truncate max-w-xs">{pdfFileName}</p>
                      <p className="text-[10px] text-emerald-400">✓ Ready for submission (PDF)</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white">Click or drag PDF file here</p>
                      <p className="text-xs text-[#8da2bd]">Maximum size 50MB</p>
                    </div>
                  )}
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3.5 rounded-xl border border-[#003599]/40 bg-[#00173d]/60 text-[#cbd5e0] hover:text-[#FFB81B] font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  GO BACK
                </button>

                <button
                  type="submit"
                  disabled={loading || !youtubeUrl || (!pdfFile && !pdfFileName)}
                  className="py-4 px-8 rounded-xl bg-[#FFB81B] hover:brightness-105 text-[#001233] font-extrabold uppercase tracking-widest text-xs sm:text-sm shadow-[0_0_20px_rgba(255,184,27,0.35)] transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <span>UPLOAD & SUBMIT</span>
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 4: Success View */}
          {step === 4 && (
            <div className="text-center py-10 space-y-6 max-w-md mx-auto my-auto">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-full bg-[#FFB81B]/20" />
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#FFB81B] to-[#e0a015] flex items-center justify-center shadow-[0_0_40px_rgba(255,184,27,0.4)]">
                  <CheckCircle2 className="h-10 w-10 text-[#001233]" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-cinzel font-black text-2xl text-white">PROPOSAL SUBMITTED!</h3>
                <p className="text-xs text-[#cbd5e0]">
                  Your proposal blueprint and video submission for team{" "}
                  <strong className="text-[#FFB81B]">{selectedTeam?.teamName}</strong> has been received.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-[#003599]/40 bg-[#00173d]/60 text-left text-xs space-y-2 font-mono">
                <div className="flex justify-between border-b border-[#003599]/30 pb-2">
                  <span className="text-[#8da2bd]">Reference ID:</span>
                  <span className="text-[#FFB81B] font-bold">{referenceId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8da2bd]">Team:</span>
                  <span className="text-white">{selectedTeam?.teamName}</span>
                </div>
              </div>

              <button
                onClick={onBackToHub}
                className="w-full py-4 px-6 rounded-xl bg-[#FFB81B] text-[#001233] font-extrabold text-xs uppercase tracking-widest cursor-pointer hover:brightness-105 transition-all shadow-[0_0_20px_rgba(255,184,27,0.35)]"
              >
                RETURN TO HUB
              </button>
            </div>
          )}

        </div>

        {/* Right Column: Sidebar Panel */}
        <aside className="lg:col-span-4 bg-[#002066]/40 backdrop-blur-xl border border-[#003599]/30 rounded-[24px] p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,8,30,0.65)] flex flex-col space-y-6">
          {/* Project Nova Logo at top */}
          <div className="flex justify-center py-2">
            <img
              src="/images/project_nova_logo.png"
              alt="Project Nova"
              className="h-12 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(255,184,27,0.4)]"
            />
          </div>

          <div className="space-y-3 text-left border-b border-[#003599]/30 pb-6 font-space">
            <h3 className="font-cinzel font-bold text-lg text-white">Submission Portal</h3>
            <p className="text-xs text-[#cbd5e0] leading-relaxed">
              Welcome to the {trackTitle} Submission panel. Ensure that you upload the complete, finalized project blueprint document in PDF format along with your YouTube pitch video link.
            </p>
          </div>

          {/* Upload Requirements Section */}
          <div className="space-y-4 text-left font-space">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#FFB81B] flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              UPLOAD REQUIREMENTS:
            </h4>

            <ul className="space-y-3 text-xs text-[#cbd5e0] leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#FFB81B]">•</span>
                <span>
                  Blueprint format must be in <strong className="text-white">PDF format</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FFB81B]">•</span>
                <span>
                  File capacity should not exceed <strong className="text-white">50 MB</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FFB81B]">•</span>
                <span>YouTube URLs must be valid and viewable (Public or Unlisted).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FFB81B]">•</span>
                <span>Submissions can be updated/overwritten if submitted again before the deadline.</span>
              </li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}
