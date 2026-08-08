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
  const [timerSeconds, setTimerSeconds] = React.useState<number>(300);
  const timerIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Upload State
  // const [youtubeUrl, setYoutubeUrl] = React.useState(""); // Commented out - YouTube link not needed
  // Google Drive PDF Upload State (Commented out - changed to Canva link submission)
  // const [pdfFile, setPdfFile] = React.useState<File | null>(null);
  // const [pdfBase64, setPdfBase64] = React.useState<string>("");
  // const [dragActive, setDragActive] = React.useState(false);
  const [canvaUrl, setCanvaUrl] = React.useState("");
  const [submittedCanvaUrl, setSubmittedCanvaUrl] = React.useState("");

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
        setTimerSeconds(300);
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

  // Canva URL validation helper (supports standard canva.com/design/... & short links canva.link/...)
  const isValidCanvaUrl = (url: string) => {
    const clean = url.trim().toLowerCase();
    if (!clean) return false;
    return (
      clean.includes("canva.com/") ||
      clean.includes("canva.link/") ||
      clean.startsWith("https://www.canva.com") ||
      clean.startsWith("https://canva.com") ||
      clean.startsWith("https://canva.link") ||
      clean.startsWith("http://canva.link")
    );
  };

  /*
  // Handle File Drag & Drop & Base64 Encoding (Commented out - PDF submission disabled in favor of Canva link)
  const handleFile = (file: File) => {
    if (file.type !== "application/pdf") {
      setErrorMessage("Only PDF format files are allowed.");
      return;
    }
    if (file.size > 4.5 * 1024 * 1024) {
      setErrorMessage("File capacity should not exceed 4.5 MB.");
      return;
    }

    setErrorMessage("");
    setPdfFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
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
  */

  // Handle Step 3: Final Upload & Submission (Canva Design Link)
  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanCanvaUrl = canvaUrl.trim();
    if (!cleanCanvaUrl) {
      setErrorMessage("Please enter your Canva proposal design link.");
      return;
    }

    if (!isValidCanvaUrl(cleanCanvaUrl)) {
      setErrorMessage("Invalid Canva link format. Please provide a valid Canva URL (e.g. https://www.canva.com/design/... or https://canva.link/...).");
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
          canvaUrl: cleanCanvaUrl,
          youtubeUrl: cleanCanvaUrl, // Passed for backward compatibility
          fileUrl: cleanCanvaUrl,    // Passed for backward compatibility
          fileBase64: "",
          fileName: "Canva_Proposal_Link",
        }),
      });

      const resData = await response.json();

      if (resData.success) {
        setSubmissionId(resData.submissionId || `NOVA-SUB-${Math.floor(100000 + Math.random() * 900000)}`);
        setSubmissionTimestamp(resData.timestamp || new Date().toLocaleString());
        setSubmittedCanvaUrl(cleanCanvaUrl);
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
          <div className="lg:col-span-7 bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-xl flex flex-col justify-between min-h-[620px]">
            <div>
              {/* Title & Category Subtitle */}
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-4xl font-black text-black uppercase tracking-wider font-space">
                  {tierName} Proposal
                </h1>
                <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-black font-bold font-space mt-1">
                  PROPOSAL SUBMISSION PORTAL
                </p>
              </div>

              {/* Stepper Navigation (1 IDENTIFY, 2 VERIFY, 3 UPLOAD) */}
              <div className="flex items-center justify-center gap-3 sm:gap-6 mb-10 font-space select-none">
                {/* Step 1 Indicator */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      currentStep >= 1
                        ? "bg-black text-white shadow-md"
                        : "bg-gray-100 text-gray-400 border border-gray-300"
                    }`}
                  >
                    {currentStep > 1 ? <CheckCircle2 className="h-5 w-5 text-white" /> : "1"}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                      currentStep >= 1 ? "text-black" : "text-gray-400"
                    }`}
                  >
                    IDENTIFY
                  </span>
                </div>

                <div className={`h-[1px] w-8 sm:w-16 transition-colors ${currentStep > 1 ? "bg-black" : "bg-gray-200"}`} />

                {/* Step 2 Indicator */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      currentStep >= 2
                        ? "bg-black text-white shadow-md"
                        : "bg-gray-100 text-gray-400 border border-gray-300"
                    }`}
                  >
                    {currentStep > 2 ? <CheckCircle2 className="h-5 w-5 text-white" /> : "2"}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                      currentStep >= 2 ? "text-black" : "text-gray-400"
                    }`}
                  >
                    VERIFY
                  </span>
                </div>

                <div className={`h-[1px] w-8 sm:w-16 transition-colors ${currentStep > 2 ? "bg-black" : "bg-gray-200"}`} />

                {/* Step 3 Indicator */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      currentStep >= 3
                        ? "bg-black text-white shadow-md"
                        : "bg-gray-100 text-gray-400 border border-gray-300"
                    }`}
                  >
                    {currentStep === 4 ? <CheckCircle2 className="h-5 w-5 text-white" /> : "3"}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                      currentStep >= 3 ? "text-black" : "text-gray-400"
                    }`}
                  >
                    UPLOAD
                  </span>
                </div>
              </div>

              {/* Display Error Message Banner */}
              {errorMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-black text-xs flex items-center gap-3 animate-shake">
                  <AlertCircle className="h-5 w-5 text-black shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* STEP 1: EMAIL IDENTIFICATION */}
              {currentStep === 1 && (
                <form onSubmit={handleSendCode} className="space-y-6">
                  <div className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider text-black mb-4">
                    <UserCheck className="h-4 w-4 text-black" />
                    <span>Email Verification</span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-black block font-space">
                      TEAM LEADER EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter team leader's registered email address"
                      className="w-full bg-gray-50 border border-gray-300 focus:border-black rounded-2xl px-5 py-4 text-sm text-black placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-black/10"
                    />
                    <p className="text-[10px] text-black mt-1.5 font-sans">
                      Only team leaders are authorized to submit proposals on behalf of their team.
                    </p>
                  </div>

                  {/* Send Code Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full group bg-black hover:bg-gray-800 text-white font-black text-sm uppercase tracking-widest py-4 px-6 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
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
                    <h2 className="text-xl font-bold uppercase tracking-wider text-black font-space">
                      Verify Your Email
                    </h2>
                    <p className="text-xs text-black">
                      A 6-digit OTP code has been sent to{" "}
                      <span className="font-bold text-black">{email}</span>.
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
                        className="w-10 h-12 sm:w-12 sm:h-14 bg-gray-50 border border-gray-300 focus:border-black rounded-xl text-center text-xl font-black text-black outline-none transition-all focus:ring-2 focus:ring-black/20"
                      />
                    ))}
                  </div>

                  {/* Verify Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black hover:bg-gray-800 text-white font-black text-sm uppercase tracking-widest py-4 px-6 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                    ) : (
                      <>
                        <span>VERIFY CODE</span>
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </>
                    )}
                  </button>

                  {/* Bottom Row Actions */}
                  <div className="flex items-center justify-between pt-4 font-space text-xs">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="border border-gray-300 hover:border-black bg-gray-100 text-black px-4 py-2 rounded-xl uppercase tracking-wider font-bold transition-all"
                    >
                      EDIT DETAILS
                    </button>

                    <span className="text-black">
                      {timerSeconds > 0 ? (
                        `Resend OTP in ${Math.floor(timerSeconds / 60)}:${String(timerSeconds % 60).padStart(2, "0")}`
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setTimerSeconds(300);
                            sendVerificationCode(email);
                          }}
                          className="text-black underline font-bold uppercase cursor-pointer"
                        >
                          Resend OTP Code
                        </button>
                      )}
                    </span>
                  </div>
                </form>
              )}

              {/* STEP 3: PROPOSAL SUBMISSION (CANVA LINK) */}
              {currentStep === 3 && (
                <form onSubmit={handleSubmitProposal} className="space-y-6">
                  {/* Submitter Team Banner */}
                  <div className="text-center space-y-1 py-2 border-b border-gray-200 pb-4">
                    <h2 className="text-xs uppercase tracking-widest text-black font-bold font-space">
                      Proposal Submission
                    </h2>
                    <h3 className="text-3xl font-black text-black font-space">
                      {teamName}
                    </h3>
                    {email && (
                      <p className="text-xs text-black">
                        Submitter Email: <span className="text-black font-semibold">{email}</span>
                      </p>
                    )}
                  </div>

                  {/* Canva Proposal Design Link Input */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-black block font-space flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-black" />
                      <span>CANVA PROPOSAL DESIGN LINK</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={canvaUrl}
                      onChange={(e) => {
                        setCanvaUrl(e.target.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      placeholder="https://www.canva.com/design/... or https://canva.link/..."
                      className="w-full bg-gray-50 border border-gray-300 focus:border-black rounded-2xl px-5 py-4 text-sm text-black placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-black/10 font-sans"
                    />
                    <p className="text-[10px] text-black font-sans">
                      Provide the view or edit link to your finalized proposal design on Canva. Ensure sharing permissions allow viewing.
                    </p>
                  </div>

                  {/* Buttons Row */}
                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="border border-gray-300 hover:border-black bg-gray-100 text-black px-5 py-3 rounded-xl uppercase tracking-wider font-bold text-xs transition-all cursor-pointer"
                    >
                      GO BACK
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-black hover:bg-gray-800 text-white font-black text-xs uppercase tracking-widest py-3.5 px-8 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                      ) : (
                        <>
                          <span>SUBMIT PROPOSAL</span>
                          <ArrowRight className="h-4 w-4" />
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
                    <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white shadow-lg">
                      <PartyPopper className="h-10 w-10 text-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-3xl sm:text-4xl font-black text-black uppercase tracking-wider">
                      SUBMISSION SUCCESSFUL!
                    </h2>
                    <p className="text-xs text-black uppercase tracking-widest font-bold">
                      Your proposal has been officially registered
                    </p>
                  </div>

                  {/* Submission Receipt Box */}
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-left space-y-3 font-sans text-xs">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                      <span className="text-black">SUBMISSION REFERENCE:</span>
                      <span className="font-mono font-bold text-black text-sm">{submissionId}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                      <span className="text-black">TEAM NAME:</span>
                      <span className="font-bold text-black">{teamName}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                      <span className="text-black">TEAM LEADER:</span>
                      <span className="font-bold text-black">{leaderName}</span>
                    </div>
                    {(submittedCanvaUrl || driveFileUrl) && (
                      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                        <span className="text-black">CANVA PROPOSAL LINK:</span>
                        <a
                          href={submittedCanvaUrl || driveFileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-black underline truncate max-w-[200px] sm:max-w-[280px]"
                        >
                          {submittedCanvaUrl || driveFileUrl}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-black">SUBMISSION TIME:</span>
                      <span className="text-black font-mono">{submissionTimestamp}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <a
                      href={submittedCanvaUrl || driveFileUrl || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto border border-black bg-black text-white text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>VIEW CANVA PROPOSAL</span>
                      <ExternalLink className="h-4 w-4 text-white" />
                    </a>

                    <Link href="/submit" className="w-full sm:w-auto">
                      <button className="w-full sm:w-auto border border-gray-300 hover:border-black bg-gray-100 text-black text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all cursor-pointer">
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
                Welcome to the {tierName} Proposal Submission panel. Submit your finalized project blueprint via a valid Canva link.
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
                <span>SUBMISSION REQUIREMENTS:</span>
              </h3>

              <ul className="space-y-2.5 text-xs text-[#cbd5e0] font-sans">
                <li className="flex items-start gap-2">
                  <span className="text-[#00e5ff] font-bold">•</span>
                  <span>Proposal must be submitted as a valid <strong className="text-white">Canva Link</strong> (<code className="text-[#00e5ff] text-[10px]">canva.com/design/...</code> or <code className="text-[#00e5ff] text-[10px]">canva.link/...</code>).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00e5ff] font-bold">•</span>
                  <span>Ensure your Canva design access setting is set to <strong className="text-white">Anyone with the link can view</strong>.</span>
                </li>
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
