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
  ExternalLink,
  AlertCircle,
  Loader2,
  PartyPopper,
  ShieldCheck,
  Video,
  Play,
  Clock,
  Tv,
  HelpCircle,
  Sparkles,
  Users,
  Share2,
} from "lucide-react";
import { FaLinkedinIn } from "react-icons/fa";

export function DemoVideoPortal() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "university";
  const tierName = categoryParam === "school" ? "Project Nova Jr." : "Project Nova";

  // Step State: 1 = IDENTIFY, 2 = VERIFY, 3 = SUBMIT, 4 = SUCCESS
  const [currentStep, setCurrentStep] = React.useState<number>(1);

  // Form State
  const [email, setEmail] = React.useState("");
  const [teamName, setTeamName] = React.useState("");
  const [leaderName, setLeaderName] = React.useState("");

  // OTP State
  const [otp, setOtp] = React.useState("");
  const otpInputsRef = React.useRef<(HTMLInputElement | null)[]>([]);
  const [timerSeconds, setTimerSeconds] = React.useState<number>(300);
  const timerIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Video & LinkedIn Links State
  const [youtubeUrl, setYoutubeUrl] = React.useState("");
  const [linkedin1, setLinkedin1] = React.useState("");
  const [linkedin2, setLinkedin2] = React.useState("");
  const [linkedin3, setLinkedin3] = React.useState("");
  const [linkedin4, setLinkedin4] = React.useState("");
  const [linkedin5, setLinkedin5] = React.useState("");

  // Submitted State for Success Receipt
  const [submittedYoutubeUrl, setSubmittedYoutubeUrl] = React.useState("");
  const [submittedLinkedinLinks, setSubmittedLinkedinLinks] = React.useState<string[]>([]);

  // Status & API State
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [submissionId, setSubmissionId] = React.useState("");
  const [submissionTimestamp, setSubmissionTimestamp] = React.useState("");

  // OTP Resend Countdown Timer
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
  }, [currentStep, timerSeconds]);

  // Core verification code sending logic
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

  // YouTube URL validation helper (supports watch, youtu.be, shorts, live, embed)
  const isValidYoutubeUrl = (url: string) => {
    const clean = url.trim();
    if (!clean) return false;
    const youtubePattern = /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)[\w-]{11}(\S*)?$/i;
    return (
      youtubePattern.test(clean) ||
      clean.includes("youtube.com/watch") ||
      clean.includes("youtu.be/") ||
      clean.includes("youtube.com/shorts/") ||
      clean.includes("youtube.com/live/") ||
      clean.includes("youtube.com/embed/")
    );
  };

  // LinkedIn URL validation helper (supports linkedin.com and lnkd.in short URLs)
  const isValidLinkedinUrl = (url: string) => {
    const clean = url.trim();
    if (!clean) return false;
    return /^(https?:\/\/)?(www\.)?(linkedin\.com|lnkd\.in)\/.+$/i.test(clean);
  };

  // Extract video ID for embed preview if valid
  const extractYoutubeId = (url: string): string | null => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/);
    return match ? match[1] : null;
  };

  // Handle Step 3: Final Submission (YouTube Demo Video Link + 4 Required + 1 Optional LinkedIn Links)
  const handleSubmitDemoVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const cleanYoutubeUrl = youtubeUrl.trim();
    if (!cleanYoutubeUrl) {
      setErrorMessage("Please enter your YouTube demo video link.");
      return;
    }

    if (!isValidYoutubeUrl(cleanYoutubeUrl)) {
      setErrorMessage("Invalid YouTube link format. Please provide a valid YouTube URL (e.g. https://www.youtube.com/watch?v=..., https://youtu.be/..., https://www.youtube.com/live/..., or https://www.youtube.com/shorts/...).");
      return;
    }

    // Validate Required LinkedIn Links (Members 1 - 4)
    const l1 = linkedin1.trim();
    const l2 = linkedin2.trim();
    const l3 = linkedin3.trim();
    const l4 = linkedin4.trim();
    const l5 = linkedin5.trim();

    if (!l1) {
      setErrorMessage("Member 1 (Team Leader) LinkedIn post link is required.");
      return;
    }
    if (!isValidLinkedinUrl(l1)) {
      setErrorMessage("Member 1 LinkedIn post URL is invalid. Please provide a valid LinkedIn URL (e.g. https://www.linkedin.com/posts/...).");
      return;
    }

    if (!l2) {
      setErrorMessage("Member 2 LinkedIn post link is required.");
      return;
    }
    if (!isValidLinkedinUrl(l2)) {
      setErrorMessage("Member 2 LinkedIn post URL is invalid. Please provide a valid LinkedIn URL (e.g. https://www.linkedin.com/posts/...).");
      return;
    }

    if (!l3) {
      setErrorMessage("Member 3 LinkedIn post link is required.");
      return;
    }
    if (!isValidLinkedinUrl(l3)) {
      setErrorMessage("Member 3 LinkedIn post URL is invalid. Please provide a valid LinkedIn URL (e.g. https://www.linkedin.com/posts/...).");
      return;
    }

    if (!l4) {
      setErrorMessage("Member 4 LinkedIn post link is required.");
      return;
    }
    if (!isValidLinkedinUrl(l4)) {
      setErrorMessage("Member 4 LinkedIn post URL is invalid. Please provide a valid LinkedIn URL (e.g. https://www.linkedin.com/posts/...).");
      return;
    }

    // Member 5 is optional, but if provided, must be a valid LinkedIn link
    if (l5 && !isValidLinkedinUrl(l5)) {
      setErrorMessage("Member 5 LinkedIn post URL is invalid. Please provide a valid LinkedIn URL or leave blank.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SUBMIT_DEMO_VIDEO",
          email: email.trim().toLowerCase(),
          youtubeUrl: cleanYoutubeUrl,
          videoUrl: cleanYoutubeUrl,
          demoUrl: cleanYoutubeUrl,
          linkedin1: l1,
          linkedin2: l2,
          linkedin3: l3,
          linkedin4: l4,
          linkedin5: l5,
          linkedinLinks: [l1, l2, l3, l4, ...(l5 ? [l5] : [])],
        }),
      });

      const resData = await response.json();

      if (resData.success) {
        setSubmissionId(resData.submissionId || `NOVA-YT-${Math.floor(100000 + Math.random() * 900000)}`);
        setSubmissionTimestamp(resData.timestamp || new Date().toLocaleString());
        setSubmittedYoutubeUrl(cleanYoutubeUrl);
        setSubmittedLinkedinLinks([l1, l2, l3, l4, ...(l5 ? [l5] : [])]);
        setCurrentStep(4);
      } else {
        setErrorMessage(resData.error || "Submission failed. Please try again.");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      setErrorMessage("Submission failed due to a network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const previewVideoId = extractYoutubeId(youtubeUrl);

  return (
    <div className="relative min-h-screen bg-[#000d21] text-[#f7fafc] font-sans overflow-x-hidden selection:bg-[#ffb81c]/30">
      {/* Subtle cosmic background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,53,153,0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Top Header Row */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 border border-[#003599]/60 hover:border-[#ffb81c]/60 bg-[#00173d]/60 hover:bg-[#002259] text-xs font-bold uppercase tracking-widest text-[#cbd5e0] hover:text-[#ffb81c] px-4 py-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.4)]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>BACK TO HUB</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-[#003599]/60 hover:border-[#ffb81c]/60 bg-[#00173d]/60 hover:bg-[#002259] text-xs font-bold uppercase tracking-widest text-[#cbd5e0] hover:text-[#ffb81c] px-4 py-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.4)]"
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
                  {tierName} Demo Video &amp; LinkedIn
                </h1>
                <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-[#003599] font-bold font-space mt-1">
                  OFFICIAL SUBMISSION PORTAL
                </p>
              </div>

              {/* Stepper Navigation (1 IDENTIFY, 2 VERIFY, 3 SUBMIT) */}
              <div className="flex items-center justify-center gap-3 sm:gap-6 mb-10 font-space select-none">
                {/* Step 1 Indicator */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      currentStep >= 1
                        ? "bg-[#003599] text-white shadow-md"
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

                <div
                  className={`h-[1px] w-8 sm:w-16 transition-colors ${
                    currentStep > 1 ? "bg-[#003599]" : "bg-gray-200"
                  }`}
                />

                {/* Step 2 Indicator */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      currentStep >= 2
                        ? "bg-[#003599] text-white shadow-md"
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

                <div
                  className={`h-[1px] w-8 sm:w-16 transition-colors ${
                    currentStep > 2 ? "bg-[#003599]" : "bg-gray-200"
                  }`}
                />

                {/* Step 3 Indicator */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      currentStep >= 3
                        ? "bg-[#003599] text-white shadow-md"
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
                    SUBMIT
                  </span>
                </div>
              </div>

              {/* Display Error Message Banner */}
              {errorMessage && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-black text-xs flex items-center gap-3 animate-shake">
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                  <span className="text-red-800 font-medium">{errorMessage}</span>
                </div>
              )}

              {/* STEP 1: EMAIL IDENTIFICATION */}
              {currentStep === 1 && (
                <form onSubmit={handleSendCode} className="space-y-6">
                  <div className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider text-black mb-4">
                    <ShieldCheck className="h-4 w-4 text-[#003599]" />
                    <span>Team Leader Authorization</span>
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
                      className="w-full bg-gray-50 border border-gray-300 focus:border-[#003599] rounded-2xl px-5 py-4 text-sm text-black placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-[#003599]/10 font-sans"
                    />
                    <p className="text-[10px] text-gray-500 mt-1.5 font-sans">
                      Only registered team leaders are authorized to submit the demo video and LinkedIn links on behalf of their team.
                    </p>
                  </div>

                  {/* Send Code Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full group bg-[#003599] hover:bg-[#002877] text-white font-black text-sm uppercase tracking-widest py-4 px-6 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
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
                    <p className="text-xs text-gray-600">
                      A 6-digit verification code has been sent to{" "}
                      <span className="font-bold text-black">{email}</span>.
                    </p>
                  </div>

                  {/* 6 Digit Inputs */}
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
                        className="w-10 h-12 sm:w-12 sm:h-14 bg-gray-50 border border-gray-300 focus:border-[#003599] rounded-xl text-center text-xl font-black text-black outline-none transition-all focus:ring-2 focus:ring-[#003599]/20"
                      />
                    ))}
                  </div>

                  {/* Verify Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#003599] hover:bg-[#002877] text-white font-black text-sm uppercase tracking-widest py-4 px-6 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
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
                      className="border border-gray-300 hover:border-[#003599] bg-gray-100 text-black px-4 py-2 rounded-xl uppercase tracking-wider font-bold transition-all cursor-pointer"
                    >
                      EDIT DETAILS
                    </button>

                    <span className="text-gray-600">
                      {timerSeconds > 0 ? (
                        `Resend code in ${Math.floor(timerSeconds / 60)}:${String(timerSeconds % 60).padStart(2, "0")}`
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setTimerSeconds(300);
                            sendVerificationCode(email);
                          }}
                          className="text-[#003599] underline font-bold uppercase cursor-pointer"
                        >
                          Resend Verification Code
                        </button>
                      )}
                    </span>
                  </div>
                </form>
              )}

              {/* STEP 3: DEMO VIDEO & LINKEDIN LINKS SUBMISSION */}
              {currentStep === 3 && (
                <form onSubmit={handleSubmitDemoVideo} className="space-y-6">
                  {/* Submitter Team Banner */}
                  <div className="text-center space-y-1 py-2 border-b border-gray-200 pb-4">
                    <h2 className="text-xs uppercase tracking-widest text-[#003599] font-bold font-space">
                      Video Proposal &amp; Member LinkedIn Posts
                    </h2>
                    <h3 className="text-3xl font-black text-black font-space">
                      {teamName}
                    </h3>
                    {email && (
                      <p className="text-xs text-gray-600">
                        Submitter Email: <span className="text-black font-semibold">{email}</span> (Team Leader)
                      </p>
                    )}
                  </div>

                  {/* Section A: YouTube Demo Video Link */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-black block font-space flex items-center gap-2">
                      <Video className="h-4 w-4 text-[#ff0000]" />
                      <span>1. YOUTUBE DEMO VIDEO LINK</span>
                      <span className="ml-auto text-[9px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">REQUIRED</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={youtubeUrl}
                      onChange={(e) => {
                        setYoutubeUrl(e.target.value);
                        if (errorMessage) setErrorMessage("");
                      }}
                      placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                      className="w-full bg-gray-50 border border-gray-300 focus:border-[#003599] rounded-2xl px-5 py-3.5 text-sm text-black placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-[#003599]/10 font-sans"
                    />
                    <p className="text-[10px] text-gray-500 font-sans">
                      Paste the YouTube link for your product demo video (Max 5 minutes). Privacy must be <strong className="text-black">Public</strong> or <strong className="text-black">Unlisted</strong>.
                    </p>
                  </div>

                  {/* Live Video Preview */}
                  {previewVideoId && (
                    <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-700 uppercase tracking-wider font-space">
                        <Play className="h-3.5 w-3.5 text-[#ff0000]" />
                        <span>Video Preview Detected</span>
                      </div>
                      <div className="aspect-video w-full rounded-xl overflow-hidden shadow-inner bg-black">
                        <iframe
                          src={`https://www.youtube.com/embed/${previewVideoId}`}
                          title="YouTube Demo Preview"
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}

                  {/* Section B: LinkedIn Member Post Links */}
                  <div className="pt-2 border-t border-gray-200 space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-black font-space font-bold text-xs uppercase tracking-wider">
                        <Share2 className="h-4 w-4 text-[#0077B5]" />
                        <span>2. TEAM MEMBERS&apos; LINKEDIN DEMO POST LINKS</span>
                      </div>
                      <p className="text-[11px] text-gray-500 font-sans leading-relaxed">
                        Every team member must share the demo video on LinkedIn. Links for <strong>Members 1 to 4 are mandatory for all teams</strong>; <strong>Member 5 is only required for a 5-member team</strong> (leave blank if your team has 4 members).
                      </p>
                    </div>

                    <div className="space-y-3">
                      {/* Member 1 / Leader */}
                      <div className="space-y-1.5 p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider font-space text-gray-800">
                          <span className="flex items-center gap-1.5">
                            <FaLinkedinIn className="h-3.5 w-3.5 text-[#0077B5]" />
                            <span>MEMBER 1 (TEAM LEADER) LINKEDIN POST</span>
                          </span>
                          <span className="text-[9px] bg-[#003599]/10 text-[#003599] px-2 py-0.5 rounded font-bold">REQUIRED</span>
                        </div>
                        <input
                          type="url"
                          required
                          value={linkedin1}
                          onChange={(e) => {
                            setLinkedin1(e.target.value);
                            if (errorMessage) setErrorMessage("");
                          }}
                          placeholder="https://www.linkedin.com/posts/..."
                          className="w-full bg-white border border-gray-300 focus:border-[#003599] rounded-xl px-4 py-2.5 text-xs text-black placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-[#003599]/10 font-sans"
                        />
                      </div>

                      {/* Member 2 */}
                      <div className="space-y-1.5 p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider font-space text-gray-800">
                          <span className="flex items-center gap-1.5">
                            <FaLinkedinIn className="h-3.5 w-3.5 text-[#0077B5]" />
                            <span>MEMBER 2 LINKEDIN POST</span>
                          </span>
                          <span className="text-[9px] bg-[#003599]/10 text-[#003599] px-2 py-0.5 rounded font-bold">REQUIRED</span>
                        </div>
                        <input
                          type="url"
                          required
                          value={linkedin2}
                          onChange={(e) => {
                            setLinkedin2(e.target.value);
                            if (errorMessage) setErrorMessage("");
                          }}
                          placeholder="https://www.linkedin.com/posts/..."
                          className="w-full bg-white border border-gray-300 focus:border-[#003599] rounded-xl px-4 py-2.5 text-xs text-black placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-[#003599]/10 font-sans"
                        />
                      </div>

                      {/* Member 3 */}
                      <div className="space-y-1.5 p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider font-space text-gray-800">
                          <span className="flex items-center gap-1.5">
                            <FaLinkedinIn className="h-3.5 w-3.5 text-[#0077B5]" />
                            <span>MEMBER 3 LINKEDIN POST</span>
                          </span>
                          <span className="text-[9px] bg-[#003599]/10 text-[#003599] px-2 py-0.5 rounded font-bold">REQUIRED</span>
                        </div>
                        <input
                          type="url"
                          required
                          value={linkedin3}
                          onChange={(e) => {
                            setLinkedin3(e.target.value);
                            if (errorMessage) setErrorMessage("");
                          }}
                          placeholder="https://www.linkedin.com/posts/..."
                          className="w-full bg-white border border-gray-300 focus:border-[#003599] rounded-xl px-4 py-2.5 text-xs text-black placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-[#003599]/10 font-sans"
                        />
                      </div>

                      {/* Member 4 */}
                      <div className="space-y-1.5 p-3.5 rounded-2xl bg-gray-50 border border-gray-200">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider font-space text-gray-800">
                          <span className="flex items-center gap-1.5">
                            <FaLinkedinIn className="h-3.5 w-3.5 text-[#0077B5]" />
                            <span>MEMBER 4 LINKEDIN POST</span>
                          </span>
                          <span className="text-[9px] bg-[#003599]/10 text-[#003599] px-2 py-0.5 rounded font-bold">REQUIRED</span>
                        </div>
                        <input
                          type="url"
                          required
                          value={linkedin4}
                          onChange={(e) => {
                            setLinkedin4(e.target.value);
                            if (errorMessage) setErrorMessage("");
                          }}
                          placeholder="https://www.linkedin.com/posts/..."
                          className="w-full bg-white border border-gray-300 focus:border-[#003599] rounded-xl px-4 py-2.5 text-xs text-black placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-[#003599]/10 font-sans"
                        />
                      </div>

                      {/* Member 5 */}
                      <div className="space-y-1.5 p-3.5 rounded-2xl bg-gray-50 border border-dashed border-gray-300">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider font-space text-gray-800">
                          <span className="flex items-center gap-1.5">
                            <FaLinkedinIn className="h-3.5 w-3.5 text-[#0077B5]" />
                            <span>MEMBER 5 LINKEDIN POST</span>
                          </span>
                          <span className="text-[9px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">5-MEMBER TEAMS ONLY</span>
                        </div>
                        <input
                          type="url"
                          value={linkedin5}
                          onChange={(e) => {
                            setLinkedin5(e.target.value);
                            if (errorMessage) setErrorMessage("");
                          }}
                          placeholder="https://www.linkedin.com/posts/... (Only required if your team has 5 members)"
                          className="w-full bg-white border border-gray-300 focus:border-[#003599] rounded-xl px-4 py-2.5 text-xs text-black placeholder-gray-400 outline-none transition-all focus:ring-2 focus:ring-[#003599]/10 font-sans"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Buttons Row */}
                  <div className="flex items-center justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="border border-gray-300 hover:border-[#003599] bg-gray-100 text-black px-5 py-3 rounded-xl uppercase tracking-wider font-bold text-xs transition-all cursor-pointer"
                    >
                      GO BACK
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#003599] hover:bg-[#002877] text-white font-black text-xs uppercase tracking-widest py-3.5 px-8 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                      ) : (
                        <>
                          <span>SUBMIT PROPOSAL LINKS</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 4: SUCCESS / CONFIRMATION RECEIPT */}
              {currentStep === 4 && (
                <div className="text-center space-y-6 py-6 font-space animate-fade-in">
                  <div className="relative inline-flex items-center justify-center">
                    <div className="w-20 h-20 bg-[#003599] rounded-full flex items-center justify-center text-white shadow-lg">
                      <PartyPopper className="h-10 w-10 text-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-3xl sm:text-4xl font-black text-black uppercase tracking-wider">
                      SUBMISSION RECEIVED!
                    </h2>
                    <p className="text-xs text-[#003599] uppercase tracking-widest font-bold">
                      Your YouTube demo and team LinkedIn post links have been officially registered
                    </p>
                  </div>

                  {/* Submission Receipt Box */}
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-left space-y-3 font-sans text-xs">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                      <span className="text-gray-500">SUBMISSION REFERENCE:</span>
                      <span className="font-mono font-bold text-black text-sm">{submissionId}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                      <span className="text-gray-500">TEAM NAME:</span>
                      <span className="font-bold text-black">{teamName}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                      <span className="text-gray-500">TEAM LEADER:</span>
                      <span className="font-bold text-black">{leaderName}</span>
                    </div>
                    {submittedYoutubeUrl && (
                      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                        <span className="text-gray-500">YOUTUBE DEMO LINK:</span>
                        <a
                          href={submittedYoutubeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-[#003599] underline truncate max-w-[200px] sm:max-w-[280px]"
                        >
                          {submittedYoutubeUrl}
                        </a>
                      </div>
                    )}
                    {submittedLinkedinLinks.length > 0 && (
                      <div className="border-b border-gray-200 pb-3 space-y-2">
                        <span className="text-gray-500 block">SUBMITTED LINKEDIN POSTS ({submittedLinkedinLinks.length}):</span>
                        <div className="space-y-1.5 pl-2">
                          {submittedLinkedinLinks.map((link, idx) => (
                            <div key={idx} className="flex items-center justify-between gap-2 text-[11px]">
                              <span className="font-semibold text-gray-700">Member {idx + 1}{idx === 0 ? " (Leader)" : ""}:</span>
                              <a
                                href={link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#0077B5] hover:underline truncate max-w-[220px] sm:max-w-[300px] flex items-center gap-1 font-mono"
                              >
                                <span>{link}</span>
                                <ExternalLink className="h-3 w-3 shrink-0" />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">SUBMISSION TIME:</span>
                      <span className="text-black font-mono">{submissionTimestamp}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <a
                      href={submittedYoutubeUrl || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto border border-[#ff0000] bg-[#ff0000] text-white text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 hover:bg-[#cc0000]"
                    >
                      <Play className="h-4 w-4 fill-white" />
                      <span>WATCH ON YOUTUBE</span>
                      <ExternalLink className="h-4 w-4 text-white" />
                    </a>

                    <Link href="/submit" className="w-full sm:w-auto">
                      <button className="w-full sm:w-auto border border-gray-300 hover:border-[#003599] bg-gray-100 text-black text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all cursor-pointer">
                        RETURN TO HUB
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Guidelines & Criteria (5 Cols on desktop) */}
          <div className="lg:col-span-5 bg-[#001433]/80 border border-[#003599]/50 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] space-y-6">
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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffb81c]/10 border border-[#ffb81c]/30 text-[#ffb81c] text-[10px] font-bold tracking-wider font-space">
                <Clock className="h-3 w-3 text-[#ffb81c]" />
                <span>DEADLINE: 3RD SEPTEMBER · 11:59 PM</span>
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-wider font-space">
                Submission Guidelines
              </h2>
              <p className="text-xs text-[#a0aec0] leading-relaxed font-sans">
                Welcome to the {tierName} Submission portal. Please review the YouTube demo video guidelines and LinkedIn post requirements below before submitting.
              </p>
            </div>

            {/* Leader Authorization Notice */}
            <div className="p-3.5 rounded-2xl bg-[#003599]/20 border border-[#003599]/60 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-[#00e5ff] shrink-0 mt-0.5" />
              <div className="text-xs font-sans">
                <p className="font-bold text-white uppercase tracking-wider font-space">
                  Team Leader Authorization Only
                </p>
                <p className="text-[#cbd5e0] text-[11px] mt-0.5 leading-relaxed">
                  Only the registered <strong className="text-white">Team Leader</strong> is authorized to authenticate and upload the proposal links on behalf of the entire team.
                </p>
              </div>
            </div>

            {/* LinkedIn Post Requirements Box */}
            <div className="p-4 rounded-2xl bg-[#0077B5]/15 border border-[#0077B5]/40 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#00e5ff] uppercase tracking-wider font-space">
                <Users className="h-4 w-4 text-[#00e5ff]" />
                <span>LinkedIn Demo Post Requirements</span>
              </div>
              <ul className="space-y-2 text-xs text-[#cbd5e0] font-sans">
                <li className="flex items-start gap-2">
                  <span className="text-[#00e5ff] font-bold">•</span>
                  <span><strong>Team Size:</strong> Minimum 4 members, maximum 5 members per team.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00e5ff] font-bold">•</span>
                  <span><strong>Mandatory Posts:</strong> Every team member must share the demo video on their LinkedIn feed.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00e5ff] font-bold">•</span>
                  <span><strong>Link Submission:</strong> Members 1 to 4 links are <strong>mandatory for all teams</strong>. Member 5 link is <strong>only required for a 5-member team</strong> (leave blank if your team has 4 members).</span>
                </li>
              </ul>
            </div>

            {/* Video Requirements Checklist */}
            <div className="space-y-4 pt-4 border-t border-[#002866]/60">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-white font-space flex items-center gap-2">
                <Video className="h-4 w-4 text-[#ffb81c]" />
                <span>VIDEO DEMO STRUCTURE:</span>
              </h3>

              <div className="space-y-3">
                {/* 1. Screen Recording */}
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#001f4d]/50 border border-[#003599]/40">
                  <div className="p-2 rounded-xl bg-[#003599]/40 text-[#00e5ff] shrink-0">
                    <Tv className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-space">
                      1. Screen Recording
                    </h4>
                    <p className="text-[11px] text-[#cbd5e0] leading-relaxed mt-0.5 font-sans">
                      Clear screen capture showcasing the actual interface and real interactions of your application.
                    </p>
                  </div>
                </div>

                {/* 2. Working Demo (Max 5 Min) */}
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#001f4d]/50 border border-[#003599]/40">
                  <div className="p-2 rounded-xl bg-[#003599]/40 text-[#ffb81c] shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-space">
                      2. Working Demo (Max 5 Min)
                    </h4>
                    <p className="text-[11px] text-[#cbd5e0] leading-relaxed mt-0.5 font-sans">
                      Total video length must not exceed <strong className="text-[#ffb81c]">5 minutes</strong>. Keep it concise, engaging, and focused on working functionality.
                    </p>
                  </div>
                </div>

                {/* 3. Introduction on the App */}
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#001f4d]/50 border border-[#003599]/40">
                  <div className="p-2 rounded-xl bg-[#003599]/40 text-[#00e5ff] shrink-0">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-space">
                      3. App &amp; Team Introduction
                    </h4>
                    <p className="text-[11px] text-[#cbd5e0] leading-relaxed mt-0.5 font-sans">
                      Briefly introduce your team, project name, and the core purpose of your application.
                    </p>
                  </div>
                </div>

                {/* 4. Problem Statement */}
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#001f4d]/50 border border-[#003599]/40">
                  <div className="p-2 rounded-xl bg-[#003599]/40 text-[#ffb81c] shrink-0">
                    <HelpCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-space">
                      4. Problem Statement
                    </h4>
                    <p className="text-[11px] text-[#cbd5e0] leading-relaxed mt-0.5 font-sans">
                      Clearly explain the target problem you are solving and why your solution is impactful.
                    </p>
                  </div>
                </div>

                {/* 5. Product Demo Walkthrough */}
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#001f4d]/50 border border-[#003599]/40">
                  <div className="p-2 rounded-xl bg-[#003599]/40 text-[#00e5ff] shrink-0">
                    <Play className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-space">
                      5. Product Demo Walkthrough
                    </h4>
                    <p className="text-[11px] text-[#cbd5e0] leading-relaxed mt-0.5 font-sans">
                      Demonstrate primary features, end-to-end user workflows, and key functionality in action.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* YouTube Specific Settings */}
            <div className="p-4 rounded-2xl bg-[#ff0000]/10 border border-[#ff0000]/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#ff4d4d] uppercase tracking-wider font-space">
                <Video className="h-4 w-4" />
                <span>YouTube Upload Requirements</span>
              </div>
              <ul className="space-y-1.5 text-xs text-[#cbd5e0] font-sans">
                <li className="flex items-start gap-2">
                  <span className="text-[#ff4d4d] font-bold">•</span>
                  <span>Upload the demo video to <strong className="text-white">YouTube</strong> and submit the URL.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ff4d4d] font-bold">•</span>
                  <span>Set privacy to <strong className="text-white">Public</strong> or <strong className="text-white">Unlisted</strong> (Do not set to Private).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#ff4d4d] font-bold">•</span>
                  <span>Submissions can be updated by the Team Leader by resubmitting before the deadline.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
