"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  CheckCircle2,
  Upload,
  UserCheck,
  ShieldCheck,
  FileText,
  ExternalLink,
  FileUp,
  AlertCircle,
  Loader2,
  RefreshCw,
  Download,
  PartyPopper
} from "lucide-react";

export function ProposalPortal() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "university";
  const tierName = categoryParam === "school" ? "Project Nova Jr." : "Project Nova";

  // Step State: 1 = IDENTIFY, 2 = VERIFY, 3 = UPLOAD, 4 = SUCCESS
  const [currentStep, setCurrentStep] = React.useState<number>(1);

  // Form State
  const [email, setEmail] = React.useState("");
  const [teamName, setTeamName] = React.useState("");
  const [leaderName, setLeaderName] = React.useState("");

  // OTP State - single string instead of array for better performance
  const [otp, setOtp] = React.useState("");
  const otpInputsRef = React.useRef<(HTMLInputElement | null)[]>([]);
  const [timerSeconds, setTimerSeconds] = React.useState<number>(60);
  const timerIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Upload State
  // const [youtubeUrl, setYoutubeUrl] = React.useState(""); // Commented out - YouTube not needed
  const [pdfFile, setPdfFile] = React.useState<File | null>(null);
  const [pdfBase64, setPdfBase64] = React.useState<string>("");
  const [dragActive, setDragActive] = React.useState(false);

  // Status & API State
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [submissionId, setSubmissionId] = React.useState("");
  const [submissionTimestamp, setSubmissionTimestamp] = React.useState("");
  const [driveFileUrl, setDriveFileUrl] = React.useState("");

  // OTP Resend Countdown Timer - fixed stale closure bug
  React.useEffect(() => {
    if (currentStep === 2 && timerSeconds > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
              timerIntervalRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [currentStep]);

  // Core verification code sending logic (extracted from handleSendCode for reuse)
  const sendVerificationCode = async (emailToVerify: string) => {
    const cleanEmail = emailToVerify.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid registered email address.");
      return false;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "VERIFY_EMAIL", email: cleanEmail }),
      });

      const resData = await response.json();

      if (resData.success) {
        if (resData.teamName) setTeamName(resData.teamName);
        if (resData.leaderName) setLeaderName(resData.leaderName);
        setCurrentStep(2);
        setTimerSeconds(60);
        return true;
      } else {
        setErrorMessage(resData.error || "Email address not found in registered teams list.");
        return false;
      }
    } catch (err) {
      console.error("Verification code dispatch failed:", err);
      setErrorMessage("Failed to send verification code. Please check your connection and try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Step 1: Send Verification Code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendVerificationCode(email);
  };

  // Handle OTP Inputs
  const handleOtpChange = (index: number, value: string) => {
    if (/[^0-9]/.test(value)) return;
    setOtp((prev) => prev.slice(0, index) + value + prev.slice(index + 1));

    // Auto-focus next box
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData);
      otpInputsRef.current[5]?.focus();
    }
  };

  // Handle Step 2: Verify Code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const fullOtp = otp.trim();
    if (fullOtp.length < 6) {
      setErrorMessage("Please enter the complete 6-digit OTP code.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "VERIFY_OTP", email: email.trim().toLowerCase(), otp: fullOtp }),
      });

      const resData = await response.json();

      if (resData.success) {
        if (resData.teamName) setTeamName(resData.teamName);
        if (resData.leaderName) setLeaderName(resData.leaderName);
        setCurrentStep(3);
      } else {
        setErrorMessage(resData.error || "Invalid OTP code.");
      }
    } catch (err) {
      console.error("OTP verification failed:", err);
      setErrorMessage("Verification failed. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle File Drag & Drop & Base64 Encoding
  const handleFile = (file: File) => {
    if (file.type !== "application/pdf") {
      setErrorMessage("Only PDF format files are allowed.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage("File capacity should not exceed 15 MB.");
      return;
    }

    setErrorMessage("");
    setPdfFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Robust base64 extraction - handles both data URLs and raw base64
      let base64Str = result;
      if (result.startsWith("data:")) {
        const commaIndex = result.indexOf(",");
        if (commaIndex !== -1) {
          base64Str = result.slice(commaIndex + 1);
        }
      }
      setPdfBase64(base64Str);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Handle Step 3: Final Upload & Submission
  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!pdfFile || !pdfBase64) {
      setErrorMessage("Please select or upload your proposal PDF document.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SUBMIT_PROPOSAL",
          email: email.trim().toLowerCase(),
          youtubeUrl: "",
          fileBase64: pdfBase64,
          fileName: pdfFile.name,
        }),
      });

      const resData = await response.json();

      if (resData.success) {
        setSubmissionId(resData.submissionId || `NOVA-SUB-${Math.floor(100000 + Math.random() * 900000)}`);
        setSubmissionTimestamp(resData.timestamp || new Date().toLocaleString());
        if (resData.fileUrl) setDriveFileUrl(resData.fileUrl);
        setCurrentStep(4);
      } else {
        setErrorMessage(resData.error || "Submission failed.");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setErrorMessage("Submission failed due to a network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#000d21] text-[#f7fafc] font-sans overflow-x-hidden selection:bg-[#00e5ff]/30">
      {/* Subtle cosmic stars background */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,53,153,0.15)_0%,transparent_70%)] pointer-events-none" 
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* Top Header Row */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 border border-[#003885]/60 hover:border-[#00e5ff]/60 bg-[#00173d]/60 hover:bg-[#002259] text-xs font-bold uppercase tracking-widest text-[#cbd5e0] hover:text-[#00e5ff] px-4 py-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.4)]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>BACK TO HUB</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-[#003885]/60 hover:border-[#00e5ff]/60 bg-[#00173d]/60 hover:bg-[#002259] text-xs font-bold uppercase tracking-widest text-[#cbd5e0] hover:text-[#00e5ff] px-4 py-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.4)]"
          >
            <Home className="h-4 w-4" />
            <span>GO TO HOMEPAGE</span>
          </Link>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT PANEL: Multi-step Form (7 Cols on desktop) */}
          <div className="lg:col-span-7 bg-[#001433]/80 border border-[#003885]/50 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex flex-col justify-between min-h-[620px]">
            <div>
              {/* Title & Category Subtitle */}
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-wider font-space">
                  {tierName} Proposal
                </h1>
                <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-[#00e5ff] font-bold font-space mt-1">
                  PROPOSAL SUBMISSION PORTAL
                </p>
              </div>

              {/* Stepper Navigation (1 IDENTIFY, 2 VERIFY, 3 UPLOAD) */}
              <div className="flex items-center justify-center gap-3 sm:gap-6 mb-10 font-space select-none">
                {/* Step 1 Indicator */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      currentStep > 1
                        ? "bg-[#00e5ff] text-[#001233] shadow-[0_0_15px_rgba(0,229,255,0.6)]"
                        : currentStep === 1
                        ? "bg-[#00e5ff] text-[#001233] shadow-[0_0_20px_rgba(0,229,255,0.8)] ring-4 ring-[#00e5ff]/20"
                        : "bg-[#002452] text-[#718096] border border-[#003885]"
                    }`}
                  >
                    {currentStep > 1 ? <CheckCircle2 className="h-5 w-5" /> : "1"}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                      currentStep >= 1 ? "text-[#00e5ff]" : "text-[#718096]"
                    }`}
                  >
                    IDENTIFY
                  </span>
                </div>

                <div className={`h-[1px] w-8 sm:w-16 transition-colors ${currentStep > 1 ? "bg-[#00e5ff]" : "bg-[#003885]"}`} />

                {/* Step 2 Indicator */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      currentStep > 2
                        ? "bg-[#00e5ff] text-[#001233] shadow-[0_0_15px_rgba(0,229,255,0.6)]"
                        : currentStep === 2
                        ? "bg-[#00e5ff] text-[#001233] shadow-[0_0_20px_rgba(0,229,255,0.8)] ring-4 ring-[#00e5ff]/20"
                        : "bg-[#002452] text-[#718096] border border-[#003885]"
                    }`}
                  >
                    {currentStep > 2 ? <CheckCircle2 className="h-5 w-5" /> : "2"}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                      currentStep >= 2 ? "text-[#00e5ff]" : "text-[#718096]"
                    }`}
                  >
                    VERIFY
                  </span>
                </div>

                <div className={`h-[1px] w-8 sm:w-16 transition-colors ${currentStep > 2 ? "bg-[#00e5ff]" : "bg-[#003885]"}`} />

                {/* Step 3 Indicator */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      currentStep >= 3
                        ? "bg-[#00e5ff] text-[#001233] shadow-[0_0_20px_rgba(0,229,255,0.8)] ring-4 ring-[#00e5ff]/20"
                        : "bg-[#002452] text-[#718096] border border-[#003885]"
                    }`}
                  >
                    {currentStep === 4 ? <CheckCircle2 className="h-5 w-5" /> : "3"}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                      currentStep >= 3 ? "text-[#00e5ff]" : "text-[#718096]"
                    }`}
                  >
                    UPLOAD
                  </span>
                </div>
              </div>

              {/* Display Error Message Banner */}
              {errorMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-3 animate-shake">
                  <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* STEP 1: EMAIL IDENTIFICATION */}
              {currentStep === 1 && (
                <form onSubmit={handleSendCode} className="space-y-6">
                  <div className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider text-[#cbd5e0] mb-4">
                    <UserCheck className="h-4 w-4 text-[#00e5ff]" />
                    <span>Email Verification</span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#a0aec0] block font-space">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your registered email address"
                      className="w-full bg-[#000d21]/80 border border-[#003885]/80 focus:border-[#00e5ff] rounded-2xl px-5 py-4 text-sm text-white placeholder-[#4a5568] outline-none transition-all focus:ring-2 focus:ring-[#00e5ff]/20"
                    />
                  </div>

                  {/* Send Code Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full group bg-gradient-to-r from-[#00b0ff] to-[#0080ff] hover:brightness-110 text-white font-black text-sm uppercase tracking-widest py-4 px-6 rounded-2xl shadow-[0_4px_25px_rgba(0,176,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <span>SEND VERIFICATION CODE</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* STEP 2: VERIFY OTP */}
              {currentStep === 2 && (
                <form onSubmit={handleVerifyCode} className="space-y-6 text-center">
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold uppercase tracking-wider text-white font-space">
                      Verify Your Email
                    </h2>
                    <p className="text-xs text-[#a0aec0]">
                      A 6-digit OTP code has been sent to{" "}
                      <span className="font-bold text-white">{email}</span>.
                    </p>
                  </div>

                  {/* 6 Digit Inputs matching screenshot 3 */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3 py-4">
                    {Array.from({ length: 6 }, (_, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          otpInputsRef.current[index] = el;
                        }}
                        type="text"
                        maxLength={1}
                        value={otp[index] || ""}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className="w-10 h-12 sm:w-12 sm:h-14 bg-[#000d21]/90 border border-[#003885] focus:border-[#00e5ff] rounded-xl text-center text-xl font-black text-[#00e5ff] outline-none transition-all focus:ring-2 focus:ring-[#00e5ff]/30"
                      />
                    ))}
                  </div>

                  {/* Verify Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#00b0ff] to-[#0080ff] hover:brightness-110 text-white font-black text-sm uppercase tracking-widest py-4 px-6 rounded-2xl shadow-[0_4px_25px_rgba(0,176,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <span>VERIFY CODE</span>
                        <CheckCircle2 className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  {/* Bottom Row Actions */}
                  <div className="flex items-center justify-between pt-4 font-space text-xs">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="border border-[#003885] hover:border-[#00e5ff]/50 bg-[#001d4a]/50 text-[#cbd5e0] hover:text-white px-4 py-2 rounded-xl uppercase tracking-wider font-bold transition-all"
                    >
                      EDIT DETAILS
                    </button>

                    <span className="text-[#a0aec0]">
                      {timerSeconds > 0 ? (
                        `Resend OTP in ${timerSeconds}s`
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setTimerSeconds(60);
                            sendVerificationCode(email);
                          }}
                          className="text-[#00e5ff] underline font-bold uppercase cursor-pointer"
                        >
                          Resend OTP Code
                        </button>
                      )}
                    </span>
                  </div>
                </form>
              )}

              {/* STEP 3: PROPOSAL UPLOAD */}
              {currentStep === 3 && (
                <form onSubmit={handleSubmitProposal} className="space-y-6">
                  {/* Submitter Team Banner matching screenshot 4 */}
                  <div className="text-center space-y-1 py-2 border-b border-[#003885]/50 pb-4">
                    <h2 className="text-xs uppercase tracking-widest text-[#a0aec0] font-bold font-space">
                      Proposal Upload
                    </h2>
                    <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00e5ff] to-white font-space">
                      {teamName}
                    </h3>
                    <p className="text-xs text-[#a0aec0]">
                      Submitter: <span className="text-white font-semibold">{leaderName} (Leader)</span>
                    </p>
                  </div>

                  {/* YouTube Video Link Input (Commented Out) */}
                  {/* <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#a0aec0] block font-space flex items-center gap-2">
                      <Video className="h-4 w-4 text-[#00e5ff]" />
                      <span>YOUTUBE VIDEO LINK</span>
                    </label>
                    <input
                      type="url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full bg-[#000d21]/80 border border-[#003885]/80 focus:border-[#00e5ff] rounded-2xl px-5 py-3.5 text-sm text-white placeholder-[#4a5568] outline-none transition-all focus:ring-2 focus:ring-[#00e5ff]/20"
                    />
                    <p className="text-[10px] text-[#a0aec0]">
                      Provide the link to your project demonstration video. Ensure it is set to Public or Unlisted.
                    </p>
                  </div> */}

                  {/* Proposal PDF Drag & Drop Zone matching screenshot 4 */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#a0aec0] block font-space flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#00e5ff]" />
                      <span>PROPOSAL DOCUMENT (PDF)</span>
                    </label>

                    <div
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[160px] ${
                        dragActive
                          ? "border-[#00e5ff] bg-[#00e5ff]/10"
                          : pdfFile
                          ? "border-[#22c55e] bg-[#22c55e]/10"
                          : "border-[#003885] bg-[#000d21]/60 hover:border-[#00e5ff]/60"
                      }`}
                    >
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => e.target.files && e.target.files[0] && handleFile(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />

                      {pdfFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle2 className="h-10 w-10 text-[#22c55e]" />
                          <span className="text-sm font-bold text-white truncate max-w-xs">{pdfFile.name}</span>
                          <span className="text-xs text-[#a0aec0]">
                            {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB · Ready to submit
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <FileUp className="h-10 w-10 text-[#00e5ff]" />
                          <span className="text-xs font-bold text-white">Click or drag PDF file here</span>
                          <span className="text-[10px] text-[#a0aec0]">Maximum size 15MB</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Buttons Row */}
                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="border border-[#003885] hover:border-[#00e5ff]/50 bg-[#001d4a]/50 text-[#cbd5e0] hover:text-white px-5 py-3 rounded-xl uppercase tracking-wider font-bold text-xs transition-all cursor-pointer"
                    >
                      GO BACK
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-[#00b0ff] to-[#0080ff] hover:brightness-110 text-white font-black text-xs uppercase tracking-widest py-3.5 px-8 rounded-xl shadow-[0_4px_25px_rgba(0,176,255,0.4)] transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <span>UPLOAD & SUBMIT</span>
                          <Upload className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 4: SUCCESS / THANK YOU RECEIPT */}
              {currentStep === 4 && (
                <div className="text-center space-y-6 py-6 font-space animate-fade-in">
                  <div className="relative inline-flex items-center justify-center">
                    <div className="absolute inset-0 bg-[#00e5ff]/20 rounded-full blur-2xl animate-pulse" />
                    <div className="w-20 h-20 bg-gradient-to-tr from-[#00e5ff] to-[#0080ff] rounded-full flex items-center justify-center text-[#001233] shadow-[0_0_30px_rgba(0,229,255,0.8)]">
                      <PartyPopper className="h-10 w-10" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-wider">
                      SUBMISSION SUCCESSFUL!
                    </h2>
                    <p className="text-xs text-[#00e5ff] uppercase tracking-widest font-bold">
                      Your proposal has been officially registered
                    </p>
                  </div>

                  {/* Submission Receipt Box */}
                  <div className="bg-[#000d21]/90 border border-[#003885] rounded-2xl p-6 text-left space-y-3 font-sans text-xs">
                    <div className="flex items-center justify-between border-b border-[#003885]/60 pb-3">
                      <span className="text-[#a0aec0]">SUBMISSION REFERENCE:</span>
                      <span className="font-mono font-bold text-[#00e5ff] text-sm">{submissionId}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-[#003885]/60 pb-3">
                      <span className="text-[#a0aec0]">TEAM NAME:</span>
                      <span className="font-bold text-white">{teamName}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-[#003885]/60 pb-3">
                      <span className="text-[#a0aec0]">TEAM LEADER:</span>
                      <span className="font-bold text-white">{leaderName}</span>
                    </div>
                    {/* {youtubeUrl && (
                      <div className="flex items-center justify-between border-b border-[#003885]/60 pb-3">
                        <span className="text-[#a0aec0]">YOUTUBE LINK:</span>
                        <a href={youtubeUrl} target="_blank" rel="noreferrer" className="text-[#00e5ff] underline truncate max-w-[200px]">
                          {youtubeUrl}
                        </a>
                      </div>
                    )} */}
                    {driveFileUrl && (
                      <div className="flex items-center justify-between border-b border-[#003885]/60 pb-3">
                        <span className="text-[#a0aec0]">DRIVE PROPOSAL PDF:</span>
                        <a href={driveFileUrl} target="_blank" rel="noreferrer" className="text-[#00e5ff] underline flex items-center gap-1 font-bold">
                          <span>View in Drive</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                    <div className="flex items-center justify-between border-b border-[#003885]/60 pb-3">
                      <span className="text-[#a0aec0]">SUBMISSION DESTINATION FOLDER:</span>
                      <a
                        href="https://drive.google.com/drive/folders/1QVNh76dTlw4PcV7ZLpZyNxfAzZ3XBi0w?usp=sharing"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#00e5ff] underline flex items-center gap-1 font-bold"
                      >
                        <span>Open Drive Folder</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#a0aec0]">SUBMISSION TIME:</span>
                      <span className="text-[#cbd5e0] font-mono">{submissionTimestamp}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <a
                      href="https://drive.google.com/drive/folders/1QVNh76dTlw4PcV7ZLpZyNxfAzZ3XBi0w?usp=sharing"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto border border-[#00e5ff]/60 hover:border-[#00e5ff] bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 text-[#00e5ff] text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>VIEW GOOGLE DRIVE FOLDER</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>

                    <Link href="/submit" className="w-full sm:w-auto">
                      <button className="w-full sm:w-auto border border-[#003885] hover:border-[#00e5ff] bg-[#00173d] text-white text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all cursor-pointer">
                        RETURN TO HUB
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Submission Guidelines & Template (5 Cols on desktop) matching screenshot 2, 3, 4 */}
          <div className="lg:col-span-5 bg-[#001433]/80 border border-[#003885]/50 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] space-y-6">
            
            {/* Logo */}
            <div className="flex items-center justify-center py-2">
              <Image
                src="/images/project_nova_logo.png"
                alt="Project Nova"
                width={160}
                height={32}
                className="h-8 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(255,184,27,0.4)]"
              />
            </div>

            {/* Section Heading & Intro */}
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white uppercase tracking-wider font-space">
                Submission Portal
              </h2>
              <p className="text-xs text-[#a0aec0] leading-relaxed font-sans">
                Welcome to the {tierName} Proposal Submission panel. Ensure that you upload the complete, finalized project blueprint document in PDF.
              </p>
            </div>

            {/* Official Proposal Template Block matching screenshots */}
            <div className="space-y-3 pt-2">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-white font-space flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#00e5ff]" />
                <span>OFFICIAL PROPOSAL TEMPLATE:</span>
              </h3>

              {/* Red callout note */}
              <div className="bg-[#240a10]/80 border border-red-900/60 rounded-xl p-3.5 text-xs text-red-200 space-y-1 font-sans">
                <div className="font-bold text-red-400 flex items-center gap-1.5">
                  <span>📌 Important Note:</span>
                </div>
                <p className="text-[11px] leading-normal text-red-300/90">
                  This proposal template is hosted on Canva. You can view and use the design preview as a guide for your proposal.
                </p>
              </div>

              {/* Download/View Template Button */}
              <a
                href="https://www.canva.com/design/DAHRQVe6Z6s/hxuD8RdqyIJhidSDu_42Nw/view?mode=preview&utm_campaign=designshare&utm_content=DAHRQVe6Z6s&utm_medium=link&utm_source=publishsharelink"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full group bg-gradient-to-r from-[#00a8ff] to-[#0070f3] hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-5 rounded-2xl shadow-[0_0_20px_rgba(0,168,255,0.3)] transition-all cursor-pointer flex items-center justify-between font-space"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4" />
                  <span>PROJECT NOVA PROPOSAL TEMPLATE</span>
                </div>
                <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

            {/* Upload Requirements Checklist matching screenshots */}
            <div className="space-y-3 pt-4 border-t border-[#002866]/60">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-white font-space flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#00e5ff]" />
                <span>UPLOAD REQUIREMENTS:</span>
              </h3>

              <ul className="space-y-2.5 text-xs text-[#cbd5e0] font-sans">
                <li className="flex items-start gap-2">
                  <span className="text-[#00e5ff] font-bold">•</span>
                  <span>Blueprint format must be in <strong className="text-white">PDF format</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00e5ff] font-bold">•</span>
                  <span>File capacity should not exceed <strong className="text-white">15 MB</strong>.</span>
                </li>

                {/* <li className="flex items-start gap-2">
                  <span className="text-[#00e5ff] font-bold">•</span>
                  <span>YouTube URLs must be valid and viewable (<strong className="text-white">Public or Unlisted</strong>).</span>
                </li> */}
                <li className="flex items-start gap-2">
                  <span className="text-[#00e5ff] font-bold">•</span>
                  <span>Submissions can be updated/overwritten if submitted again before the deadline.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
