"use client";

import * as React from "react";
import { Mail, ArrowRight, Loader2, RefreshCw, KeyRound } from "lucide-react";
import { OTPInput } from "../ui/OTPInput";
import { sendOTP, verifyOTP, getTeamsByEmail } from "../../actions";
import type { TeamOption } from "../ui/TeamCard";

interface Step1EmailOTPProps {
  email: string;
  setEmail: (email: string) => void;
  setTeams: (teams: TeamOption[]) => void;
  onNext: () => void;
}

export function Step1EmailOTP({ email, setEmail, setTeams, onNext }: Step1EmailOTPProps) {
  const [codeSent, setCodeSent] = React.useState(false);
  const [otpCode, setOtpCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [cooldown, setCooldown] = React.useState(0);

  // Cooldown countdown timer
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);

      const res = await sendOTP(formData);
      if (!res.success) {
        setError(res.error || "Failed to send verification code");
      } else {
        setCodeSent(true);
        setCooldown(60);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("code", otpCode);

      const verifyRes = await verifyOTP(formData);
      if (!verifyRes.success) {
        setError(verifyRes.error || "Verification failed");
        setLoading(false);
        return;
      }

      // Code verified, fetch user's registered teams
      const teamsRes = await getTeamsByEmail(email);
      if (!teamsRes.success || !teamsRes.teams) {
        setError(teamsRes.error || "Failed to fetch registered teams for this email.");
        setLoading(false);
        return;
      }

      setTeams(teamsRes.teams);
      onNext();
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <h3 className="font-cinzel font-bold text-xl sm:text-2xl text-[#f7fafc] uppercase tracking-wide">
          Verify Your Email
        </h3>
        <p className="text-xs sm:text-sm text-[#cbd5e0] font-space mt-1 leading-relaxed">
          Enter your registered crew leader or member email address to receive a 6-digit verification code.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl border border-red-500/50 bg-red-500/10 text-red-300 text-xs sm:text-sm font-space flex items-start gap-2 animate-fadeIn">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {!codeSent ? (
        <form onSubmit={handleSendCode} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider font-space text-[#cbd5e0] block">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8da2bd]" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="crew.leader@university.edu.lk"
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#003599]/40 bg-[#00173d]/60 text-white placeholder-[#8da2bd]/60 font-space text-sm focus:border-[#FFB81B] focus:ring-2 focus:ring-[#FFB81B]/30 focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-xl bg-[#FFB81B] hover:brightness-105 text-[#001233] font-bold uppercase tracking-widest text-xs sm:text-sm shadow-[0_0_20px_rgba(255,184,27,0.3)] hover:shadow-[0_0_30px_rgba(255,184,27,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sending Code...</span>
              </>
            ) : (
              <>
                <span>Send Verification Code</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-6">
          <div className="p-4 rounded-xl border border-[#003599]/40 bg-[#00173d]/60 flex items-center justify-between text-xs font-space">
            <span className="text-[#cbd5e0]">
              Code sent to <strong className="text-[#FFB81B]">{email}</strong>
            </span>
            <button
              type="button"
              onClick={() => {
                setCodeSent(false);
                setOtpCode("");
                setError(null);
              }}
              className="text-[#38bdf8] hover:underline font-semibold cursor-pointer"
            >
              Change
            </button>
          </div>

          <div className="space-y-3 text-center">
            <label className="text-xs font-bold uppercase tracking-wider font-space text-[#cbd5e0] flex items-center justify-center gap-1.5">
              <KeyRound className="h-4 w-4 text-[#FFB81B]" />
              Enter 6-Digit Code
            </label>
            <OTPInput
              value={otpCode}
              onChange={(val) => {
                setOtpCode(val);
                setError(null);
              }}
              disabled={loading}
              error={!!error}
            />
          </div>

          <button
            type="submit"
            disabled={loading || otpCode.length !== 6}
            className="w-full py-4 px-6 rounded-xl bg-[#FFB81B] hover:brightness-105 text-[#001233] font-bold uppercase tracking-widest text-xs sm:text-sm shadow-[0_0_20px_rgba(255,184,27,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify & Continue</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              disabled={cooldown > 0 || loading}
              onClick={handleSendCode}
              className="text-xs font-space text-[#8da2bd] hover:text-[#FFB81B] transition-colors inline-flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend Code"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
