"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWatch } from "react-hook-form";
import {
  registrationSchema,
  YEAR_OPTIONS,
  type RegistrationFormData,
} from "@/lib/validations/registration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  ArrowLeft,
  Users,
  CheckCircle,
  Plus,
  Trash2,
  Crown,
  Loader2,
  AlertCircle,
  GraduationCap,
  School,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { registerTeam } from "@/app/actions/register";

const WHATSAPP_GROUP_LINK =
  "https://www.google.com/search?q=mixkit&oq=mixkit&sourceid=chrome&source=chrome.ob&ie=UTF-8";

const DEFAULT_MEMBER = {
  fullname: "",
  email: "",
  whatsapp_no: "",
  nic_no: "",
  university: "",
  year: "" as "" | "First Year" | "Second Year" | "Third Year" | "Fourth Year",
  degree: "",
  is_leader: false,
};

// Helper functions to mask PII in review step
function maskNic(nic: string): string {
  if (!nic) return "—";
  if (nic.length <= 4) return "*".repeat(nic.length);
  return `${"*".repeat(nic.length - 4)}${nic.slice(-4)}`;
}

function maskPhone(phone: string): string {
  if (!phone) return "—";
  const digits = phone.replace(/\D/g, "");
  if (digits.length <= 4) return "*".repeat(digits.length);
  return `${digits.slice(0, 3)} *** ${digits.slice(-4)}`;
}

export function RegistrationForm() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [submitStatus, setSubmitStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [serverError, setServerError] = React.useState("");

  const {
    register,
    handleSubmit,
    control,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      teamName: "",
      track: undefined,
      members: [
        { ...DEFAULT_MEMBER, is_leader: true },
      ],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const watchedTrack = useWatch({ control, name: "track" });
  const watchedMembers = useWatch({ control, name: "members" });
  const watchedTeamName = useWatch({ control, name: "teamName" });

  const handleSetLeader = (index: number) => {
    watchedMembers.forEach((_, i: number) => {
      setValue(`members.${i}.is_leader`, i === index);
    });
  };

  const handleRemoveMember = (index: number) => {
    const wasLeader = watchedMembers[index]?.is_leader;
    remove(index);
    // If the leader was removed, crown the first remaining member so a valid leader always exists
    if (wasLeader) {
      setValue("members.0.is_leader", true);
    }
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof RegistrationFormData)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ["teamName", "track"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["members"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: RegistrationFormData) => {
    setSubmitStatus("loading");
    setServerError("");

    try {
      const formData = new FormData();
      formData.append("teamName", data.teamName);
      formData.append("track", data.track);
      formData.append("members", JSON.stringify(data.members));

      const result = await registerTeam(formData);

      if (result.success) {
        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
        setServerError(result.error || "An unexpected error occurred");
      }
    } catch (err: unknown) {
      setSubmitStatus("error");
      setServerError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    }
  };

  // ------- Success State -------
  if (submitStatus === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-2xl mx-auto">
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-ping rounded-full bg-[#FFB81B]/20" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#FFB81B] to-[#e0a015] shadow-[0_0_40px_rgba(255,184,27,0.4)]">
            <CheckCircle className="h-12 w-12 text-[#001233]" />
          </div>
        </div>
        <h2 className="mb-4 text-3xl font-cinzel font-bold tracking-[0.08em] text-[#f7fafc] uppercase">
          Ascended to Olympus
        </h2>
        <p className="mb-2 max-w-md text-[#cbd5e0] font-sans leading-relaxed">
          Team <span className="font-bold text-[#FFB81B]">{watchedTeamName}</span> has been
          inscribed among the chosen.
        </p>
        <p className="mb-8 text-sm text-[#8da2bd]">
          A confirmation scroll has been dispatched to your team leader.
        </p>
        <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
          <a
            href={WHATSAPP_GROUP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-br from-[#25D366] to-[#128C7E] px-8 py-4 text-base font-space font-bold uppercase tracking-wider text-white shadow-[0_0_30px_rgba(37,211,102,0.4)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(37,211,102,0.6)] hover:-translate-y-0.5 w-full sm:w-auto"
          >
            <FaWhatsapp className="h-5 w-5" />
            Join Our WhatsApp Group
          </a>
          <Button
            variant="gradient"
            size="xl"
            className="shadow-[0_0_30px_rgba(255,184,27,0.4)] w-full sm:w-auto"
            onClick={() => {
              setValue("teamName", "");
              setValue("track", undefined as unknown as "school" | "university");
              setValue("members", [{ ...DEFAULT_MEMBER, is_leader: true }]);
              setSubmitStatus("idle");
              setCurrentStep(1);
            }}
          >
            Inscribe Another Crew
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Premium glass window shell */}
      <div className="glass relative rounded-[24px] sm:rounded-[28px] p-4 sm:p-8 md:p-10 shadow-[0_20px_60px_rgba(0,8,30,0.6)] overflow-hidden">
        {/* Top Branding Header */}
        <div className="flex flex-col items-center justify-center mb-8 select-none">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[#FFB81B]/20 blur-xl rounded-full w-16 h-16 animate-pulse-glow" />
            <svg className="w-14 h-14 text-[#FFB81B] relative filter drop-shadow-[0_0_15px_rgba(255,184,27,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l-2-2 2-2m6 4l2-2-2-2" />
            </svg>
          </div>
          <div className="mt-3 text-xs font-cinzel font-bold tracking-[0.3em] text-[#FFB81B] uppercase">
            NOVA ENLISTMENT
          </div>
          <div className="mt-1 text-[9px] font-space font-semibold text-[#cbd5e0]/60 tracking-[0.4em] uppercase">
            AMBITION | WISDOM | LEGACY
          </div>
        </div>

        {/* Main Banner Card - Show on Step 1 */}
        {currentStep === 1 && (
          <div className="relative overflow-hidden rounded-3xl border border-[#FFB81B]/20 bg-gradient-to-r from-[#001233] via-[#002066]/70 to-[#003599]/40 p-6 sm:p-8 backdrop-blur-xl mb-8 shadow-[0_0_40px_rgba(255,184,27,0.08)] flex flex-col sm:flex-row justify-between items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-3.5 text-center sm:text-left z-10">
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start items-center">
                <span className="rounded-full bg-[#FFB81B]/15 border border-[#FFB81B]/40 px-3.5 py-1 text-[10px] font-space font-bold uppercase tracking-wider text-[#FFB81B] shadow-[0_0_15px_rgba(255,184,27,0.15)]">
                  THE ODYSSEY
                </span>
                <span className="text-[10px] font-space font-bold text-[#cbd5e0]/50 select-none">•</span>
                <span className="text-[10px] font-space font-bold tracking-widest text-[#cbd5e0]/70 uppercase">ENLIST-2.0</span>
              </div>
              <h1 className="text-2xl sm:text-3.5xl font-cinzel font-bold tracking-[0.06em] text-[#f7fafc] uppercase leading-tight drop-shadow-[0_0_15px_rgba(255,184,27,0.05)]">
                Crew Enlistment
              </h1>
            </div>

            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 flex items-center justify-center select-none opacity-80">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FFB81B]/10 to-[#003599]/20 blur-xl rounded-full" />
              <svg className="w-16 h-16 text-[#FFB81B]/80 animate-float" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.778.099-1.533.284-2.253" />
              </svg>
              <div className="absolute inset-x-0 h-[1px] bg-[#FFB81B]/30 animate-[scan_3s_ease-in-out_infinite]" />
            </div>
          </div>
        )}

        {/* Info Rules Block - Show on Step 1 */}
        {currentStep === 1 && (
          <div className="relative overflow-hidden rounded-3xl bg-[#001233]/50 p-6 sm:p-8 backdrop-blur-md mb-8 border border-[#003599]/30 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-cinzel font-bold tracking-wider text-[#f7fafc] uppercase">
                  Join the <span className="text-gold-gradient drop-shadow-[0_0_15px_rgba(255,184,27,0.3)]">Odyssey</span>
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-[#cbd5e0]/80 max-w-xl font-light">
                  Form your dream crew of 1 to 5 members to brainstorm, design and pitch breakthrough innovations before the pantheon.
                </p>
              </div>
              <span className="rounded-lg bg-[#FFB81B]/10 border border-[#FFB81B]/20 px-4 py-1.5 text-[10px] font-space font-bold uppercase tracking-widest text-[#FFB81B]">
                PHASE I
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 rounded-xl bg-white/[0.02] p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#FFB81B]/10 text-[#FFB81B]">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[11px] font-space font-bold uppercase tracking-wider text-[#f7fafc]">CREW LIMITS</div>
                  <div className="text-xs text-[#cbd5e0]/70 mt-0.5">Crews may consist of 1 to 5 members.</div>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-xl bg-white/[0.02] p-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#FFB81B]/10 text-[#FFB81B]">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[11px] font-space font-bold uppercase tracking-wider text-[#f7fafc]">SAME REALM</div>
                  <div className="text-xs text-[#cbd5e0]/70 mt-0.5">All members must hail from the same institution.</div>
                </div>
              </div>
            </div>
          </div>
        )}


        <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
          {/* ==================== STEP 1: Team Info ==================== */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-3 mb-6 select-none">
                <div className="w-1 h-6 bg-gradient-to-b from-[#FFB81B] to-[#e0a015] rounded-full animate-pulse" />
                <span className="text-xs font-cinzel font-bold tracking-[0.25em] text-[#cbd5e0] uppercase">
                  01 CREW MANIFEST
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6 rounded-2xl border border-[#003599]/30 bg-[#001233]/40 backdrop-blur-sm">
                {/* Team Name */}
                <div className="space-y-2">
                  <Label
                    htmlFor="teamName"
                    className="text-xs font-space font-bold uppercase tracking-wider text-[#cbd5e0] flex items-center gap-1.5"
                  >
                    Crew Name <span className="text-[#FFB81B]">*</span>
                  </Label>
                  <Input
                    id="teamName"
                    placeholder="Name your fellowship"
                    className="bg-[#002066]/40 border-[#003599]/40 text-[#f7fafc] placeholder:text-[#cbd5e0]/40 focus:border-[#FFB81B] focus:ring-1 focus:ring-[#FFB81B] focus:shadow-[0_0_18px_rgba(255,184,27,0.2)] h-12 text-sm rounded-xl"
                    {...register("teamName")}
                  />
                  {errors.teamName && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      {errors.teamName.message}
                    </p>
                  )}
                </div>

                {/* Competition Track */}
                <div className="space-y-2">
                  <Label className="text-xs font-space font-bold uppercase tracking-wider text-[#cbd5e0]">
                    The Trial <span className="text-[#FFB81B]">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-3 h-12">
                    <label
                      htmlFor="track-school"
                      className={`flex items-center justify-center gap-2 rounded-xl border px-3 cursor-pointer text-xs font-space font-bold transition-all duration-300 ${
                        watchedTrack === "school"
                          ? "bg-[#FFB81B]/10 border-[#FFB81B] text-[#FFB81B] shadow-[0_0_15px_rgba(255,184,27,0.15)]"
                          : "bg-[#002066]/40 border-[#003599]/40 hover:border-[#FFB81B]/40 text-[#cbd5e0] hover:text-[#f7fafc]"
                      }`}
                    >
                      <input
                        type="radio"
                        id="track-school"
                        value="school"
                        className="sr-only"
                        {...register("track")}
                      />
                      <School className="h-4 w-4" />
                      <span>SCHOOL</span>
                    </label>

                    <label
                      htmlFor="track-university"
                      className={`flex items-center justify-center gap-2 rounded-xl border px-3 cursor-pointer text-xs font-space font-bold transition-all duration-300 ${
                        watchedTrack === "university"
                          ? "bg-[#FFB81B]/10 border-[#FFB81B] text-[#FFB81B] shadow-[0_0_15px_rgba(255,184,27,0.15)]"
                          : "bg-[#002066]/40 border-[#003599]/40 hover:border-[#FFB81B]/40 text-[#cbd5e0] hover:text-[#f7fafc]"
                      }`}
                    >
                      <input
                        type="radio"
                        id="track-university"
                        value="university"
                        className="sr-only"
                        {...register("track")}
                      />
                      <GraduationCap className="h-4 w-4" />
                      <span>UNIVERSITY</span>
                    </label>
                  </div>
                  {errors.track && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      {errors.track.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Next Button */}
              <div className="flex justify-end pt-4 border-t border-[#003599]/30">
                <Button
                  type="button"
                  variant="gradient"
                  size="xl"
                  className="group gap-2 shadow-[0_0_30px_rgba(255,184,27,0.3)] w-full sm:w-auto justify-center"
                  onClick={handleNext}
                >
                  Next: Summon Members
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          )}

          {/* ==================== STEP 2: Members ==================== */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-3 select-none">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#FFB81B] to-[#e0a015] rounded-full animate-pulse" />
                  <span className="text-xs font-cinzel font-bold tracking-[0.25em] text-[#cbd5e0] uppercase">
                    02 MEMBER MATRIX
                  </span>
                </div>
                <span className="text-xs font-space font-medium text-[#cbd5e0]/60">
                  CREW SIZE: <span className="text-[#FFB81B] font-bold">{fields.length} / 5</span>
                </span>
              </div>

              <div className="space-y-4">
                {fields.map((field, index: number) => (
                  <div
                    key={field.id}
                    className="relative rounded-2xl border border-[#003599]/30 bg-[#001233]/40 p-4 sm:p-5 backdrop-blur-sm transition-all duration-300 hover:border-[#FFB81B]/30"
                  >
                    {/* Member header */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-all duration-300 ${
                            watchedMembers[index]?.is_leader
                              ? "bg-[#FFB81B]/10 text-[#FFB81B] border border-[#FFB81B]/30 shadow-[0_0_10px_rgba(255,184,27,0.2)]"
                              : "bg-white/5 text-[#cbd5e0] border border-white/5"
                          }`}
                        >
                          {watchedMembers[index]?.is_leader ? (
                            <Crown className="h-3.5 w-3.5" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <span className="text-xs font-space font-bold tracking-wider text-[#f7fafc] uppercase">
                          {watchedMembers[index]?.is_leader
                            ? "Crew Leader"
                            : `Member ${index + 1}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {!watchedMembers[index]?.is_leader && (
                          <button
                            type="button"
                            onClick={() => handleSetLeader(index)}
                            className="rounded-lg border border-[#003599]/40 bg-[#002066]/40 px-2.5 py-1.25 text-[10px] font-space font-bold uppercase tracking-wider text-[#cbd5e0] transition-all hover:border-[#FFB81B]/40 hover:bg-[#FFB81B]/10 hover:text-[#FFB81B] cursor-pointer"
                          >
                            Crown Leader
                          </button>
                        )}
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(index)}
                            className="rounded-lg border border-[#003599]/40 bg-[#002066]/40 p-1.25 text-[#cbd5e0] transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Member fields */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor={`members.${index}.fullname`}
                          className="text-[10px] font-space font-bold uppercase tracking-wider text-[#cbd5e0]/80"
                        >
                          Full Name
                        </Label>
                        <Input
                          id={`members.${index}.fullname`}
                          placeholder="Isula Illeperuma"
                          className="bg-[#002066]/40 border-[#003599]/40 text-[#f7fafc] placeholder:text-[#cbd5e0]/30 focus:border-[#FFB81B] focus:ring-1 focus:ring-[#FFB81B] h-10 rounded-lg text-xs"
                          {...register(`members.${index}.fullname`)}
                        />
                        {errors.members?.[index]?.fullname && (
                          <p className="mt-1 text-[10px] text-red-400">
                            {errors.members[index].fullname.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor={`members.${index}.email`}
                          className="text-[10px] font-space font-bold uppercase tracking-wider text-[#cbd5e0]/80"
                        >
                          Email Address
                        </Label>
                        <Input
                          id={`members.${index}.email`}
                          type="email"
                          placeholder="athena@olympus.lk"
                          className="bg-[#002066]/40 border-[#003599]/40 text-[#f7fafc] placeholder:text-[#cbd5e0]/30 focus:border-[#FFB81B] focus:ring-1 focus:ring-[#FFB81B] h-10 rounded-lg text-xs"
                          {...register(`members.${index}.email`)}
                        />
                        {errors.members?.[index]?.email && (
                          <p className="mt-1 text-[10px] text-red-400">
                            {errors.members[index].email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor={`members.${index}.whatsapp_no`}
                          className="text-[10px] font-space font-bold uppercase tracking-wider text-[#cbd5e0]/80"
                        >
                          WhatsApp Number
                        </Label>
                        <Input
                          id={`members.${index}.whatsapp_no`}
                          placeholder="0774710234"
                          className="bg-[#002066]/40 border-[#003599]/40 text-[#f7fafc] placeholder:text-[#cbd5e0]/30 focus:border-[#FFB81B] focus:ring-1 focus:ring-[#FFB81B] h-10 rounded-lg text-xs"
                          {...register(`members.${index}.whatsapp_no`)}
                        />
                        {errors.members?.[index]?.whatsapp_no && (
                          <p className="mt-1 text-[10px] text-red-400">
                            {errors.members[index].whatsapp_no.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label
                          htmlFor={`members.${index}.nic_no`}
                          className="text-[10px] font-space font-bold uppercase tracking-wider text-[#cbd5e0]/80"
                        >
                          NIC / ID Number
                        </Label>
                        <Input
                          id={`members.${index}.nic_no`}
                          placeholder="200012345678"
                          className="bg-[#002066]/40 border-[#003599]/40 text-[#f7fafc] placeholder:text-[#cbd5e0]/30 focus:border-[#FFB81B] focus:ring-1 focus:ring-[#FFB81B] h-10 rounded-lg text-xs"
                          {...register(`members.${index}.nic_no`)}
                        />
                        {errors.members?.[index]?.nic_no && (
                          <p className="mt-1 text-[10px] text-red-400">
                            {errors.members[index].nic_no.message}
                          </p>
                        )}
                      </div>

                      {/* University-track fields (shown only when the University trial is selected) */}
                      {watchedTrack === "university" && (
                        <>
                          <div className="space-y-1.5 sm:col-span-2">
                            <Label
                              htmlFor={`members.${index}.university`}
                              className="text-[10px] font-space font-bold uppercase tracking-wider text-[#cbd5e0]/80"
                            >
                              University Name <span className="text-[#FFB81B]">*</span>
                            </Label>
                            <Input
                              id={`members.${index}.university`}
                              placeholder="University of Sri Jayewardenepura"
                              className="bg-[#002066]/40 border-[#003599]/40 text-[#f7fafc] placeholder:text-[#cbd5e0]/30 focus:border-[#FFB81B] focus:ring-1 focus:ring-[#FFB81B] h-10 rounded-lg text-xs"
                              {...register(`members.${index}.university`)}
                            />
                            {errors.members?.[index]?.university && (
                              <p className="mt-1 text-[10px] text-red-400">
                                {errors.members[index].university.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <Label
                              htmlFor={`members.${index}.year`}
                              className="text-[10px] font-space font-bold uppercase tracking-wider text-[#cbd5e0]/80"
                            >
                              Year of Study <span className="text-[#FFB81B]">*</span>
                            </Label>
                            <select
                              id={`members.${index}.year`}
                              {...register(`members.${index}.year`)}
                              className="w-full bg-[#002066]/40 border border-[#003599]/40 text-[#f7fafc] focus:border-[#FFB81B] focus:ring-1 focus:ring-[#FFB81B] focus:shadow-[0_0_18px_rgba(255,184,27,0.2)] h-10 rounded-lg text-xs px-3 outline-none transition-all"
                            >
                              <option value="" className="bg-[#001233] text-[#cbd5e0]/50">
                                Select year
                              </option>
                              {YEAR_OPTIONS.map((opt) => (
                                <option key={opt} value={opt} className="bg-[#001233] text-[#f7fafc]">
                                  {opt}
                                </option>
                              ))}
                            </select>
                            {errors.members?.[index]?.year && (
                              <p className="mt-1 text-[10px] text-red-400">
                                {errors.members[index].year.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <Label
                              htmlFor={`members.${index}.degree`}
                              className="text-[10px] font-space font-bold uppercase tracking-wider text-[#cbd5e0]/80"
                            >
                              Degree / Programme <span className="text-[#FFB81B]">*</span>
                            </Label>
                            <Input
                              id={`members.${index}.degree`}
                              placeholder="B.Sc. Computer Science"
                              className="bg-[#002066]/40 border-[#003599]/40 text-[#f7fafc] placeholder:text-[#cbd5e0]/30 focus:border-[#FFB81B] focus:ring-1 focus:ring-[#FFB81B] h-10 rounded-lg text-xs"
                              {...register(`members.${index}.degree`)}
                            />
                            {errors.members?.[index]?.degree && (
                              <p className="mt-1 text-[10px] text-red-400">
                                {errors.members[index].degree.message}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Member-level validation errors */}
              {errors.members?.root && (
                <p className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {errors.members.root.message}
                </p>
              )}

              {/* Add Member */}
              {fields.length < 5 && (
                <button
                  type="button"
                  onClick={() => append({ ...DEFAULT_MEMBER })}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#003599]/40 bg-white/[0.02] p-3 text-xs font-space font-bold tracking-wider text-[#cbd5e0] transition-all hover:border-[#FFB81B]/40 hover:bg-[#FFB81B]/5 hover:text-[#FFB81B] cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Summon Member ({fields.length}/5)
                </button>
              )}

              {/* Navigation */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[#003599]/30">
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  className="gap-2 text-[#cbd5e0] hover:text-[#f7fafc] w-full sm:w-auto justify-center sm:justify-start"
                  onClick={handleBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  type="button"
                  variant="gradient"
                  size="xl"
                  className="group gap-2 shadow-[0_0_30px_rgba(255,184,27,0.3)] w-full sm:w-auto justify-center"
                  onClick={handleNext}
                >
                  Review Crew
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          )}

          {/* ==================== STEP 3: Review ==================== */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-3 mb-6 select-none">
                <div className="w-1 h-6 bg-gradient-to-b from-[#FFB81B] to-[#e0a015] rounded-full animate-pulse" />
                <span className="text-xs font-cinzel font-bold tracking-[0.25em] text-[#cbd5e0] uppercase">
                  03 THE VOW & SUBMISSION
                </span>
              </div>

              {/* Team Summary */}
              <div className="rounded-2xl border border-[#003599]/30 bg-[#001233]/40 p-4 sm:p-5 backdrop-blur-sm">
                <h3 className="mb-4 text-[10px] font-space font-bold uppercase tracking-widest text-[#cbd5e0]/60">
                  CREW MANIFEST
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-[#002066]/40 border border-[#003599]/30 p-4">
                    <div className="text-[10px] font-space font-bold uppercase tracking-wider text-[#cbd5e0]/60">Crew Name</div>
                    <div className="mt-1 text-base font-cinzel font-bold text-[#f7fafc] tracking-wide uppercase truncate">
                      {watchedTeamName}
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#002066]/40 border border-[#003599]/30 p-4">
                    <div className="text-[10px] font-space font-bold uppercase tracking-wider text-[#cbd5e0]/60">The Trial</div>
                    <div className="mt-1 flex items-center gap-2">
                      {watchedTrack === "school" ? (
                        <School className="h-4 w-4 text-[#FFB81B]" />
                      ) : (
                        <GraduationCap className="h-4 w-4 text-[#FFB81B]" />
                      )}
                      <span className="text-sm font-space font-bold uppercase tracking-wider text-[#f7fafc]">
                        {watchedTrack} TRIAL
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Members Summary */}
              <div className="rounded-2xl border border-[#003599]/30 bg-[#001233]/40 p-4 sm:p-5 backdrop-blur-sm">
                <h3 className="mb-4 text-[10px] font-space font-bold uppercase tracking-widest text-[#cbd5e0]/60">
                  CREW ROSTER ({watchedMembers.length})
                </h3>
                <div className="space-y-3.5">
                  {watchedMembers.map((member, index: number) => (
                    <div
                      key={index}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl p-4 transition-all duration-300 ${
                        member.is_leader
                          ? "bg-[#FFB81B]/5 border border-[#FFB81B]/20 shadow-[0_0_15px_rgba(255,184,27,0.05)]"
                          : "bg-[#002066]/40 border border-[#003599]/30"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-bold ${
                            member.is_leader
                              ? "bg-[#FFB81B]/15 text-[#FFB81B] border border-[#FFB81B]/30"
                              : "bg-white/5 text-[#cbd5e0] border border-white/5"
                          }`}
                        >
                          {member.is_leader ? (
                            <Crown className="h-4 w-4" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-[#f7fafc] truncate text-sm">
                              {member.fullname || "—"}
                            </span>
                            {member.is_leader && (
                              <span className="rounded-full bg-[#FFB81B]/10 px-2 py-0.5 text-[9px] font-space font-bold uppercase tracking-wider text-[#FFB81B] border border-[#FFB81B]/20 shrink-0">
                                Leader
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#cbd5e0]/60 truncate mt-0.5">
                            {member.email || "—"}
                          </div>
                          {watchedTrack === "university" && (
                            <div className="text-[10px] text-[#cbd5e0]/50 truncate mt-1 font-space">
                              {member.degree || "—"} · {member.year || "—"} · {member.university || "—"}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between sm:justify-end gap-4 sm:gap-6 text-xs font-sans text-[#cbd5e0] sm:border-l sm:border-[#003599]/30 sm:pl-6 pt-3 sm:pt-0 border-t border-[#003599]/20 sm:border-t-0">
                        <div className="space-y-0.5">
                          <div className="text-[9px] font-space font-bold text-[#cbd5e0]/50 text-left sm:text-right uppercase tracking-wider">WHATSAPP</div>
                          <div className="text-[#f7fafc] font-medium">{maskPhone(member.whatsapp_no)}</div>
                        </div>
                        <div className="space-y-0.5 text-right">
                          <div className="text-[9px] font-space font-bold text-[#cbd5e0]/50 text-right uppercase tracking-wider">NIC / ID</div>
                          <div className="text-[#f7fafc] font-medium">{maskNic(member.nic_no)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Server Error */}
              {submitStatus === "error" && serverError && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-xs text-red-400">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div>
                    <div className="font-space font-bold uppercase tracking-wider text-red-300">The Vow Was Rejected</div>
                    <div className="mt-1 text-red-400/80 leading-relaxed">{serverError}</div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[#003599]/30">
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  className="gap-2 text-[#cbd5e0] hover:text-[#f7fafc] w-full sm:w-auto justify-center sm:justify-start"
                  onClick={handleBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Edit Crew
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  size="xl"
                  disabled={submitStatus === "loading"}
                  className="group gap-2 shadow-[0_0_30px_rgba(255,184,27,0.3)] disabled:opacity-60 w-full sm:w-auto justify-center"
                >
                  {submitStatus === "loading" ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Ascending to Olympus...
                    </>
                  ) : (
                    <>
                      Seize Your Destiny
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
