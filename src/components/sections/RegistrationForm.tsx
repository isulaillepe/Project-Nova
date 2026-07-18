"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWatch } from "react-hook-form";
import {
  registrationSchema,
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
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, limit, serverTimestamp } from "firebase/firestore";

const DEFAULT_MEMBER = {
  fullname: "",
  email: "",
  whatsapp_no: "",
  nic_no: "",
  is_leader: false,
};

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
      const teamsRef = collection(db, "teams");

      // Case-insensitive check for team name uniqueness
      const formattedTeamName = data.teamName.trim();
      const teamNameLower = formattedTeamName.toLowerCase();
      const q = query(
        teamsRef,
        where("teamNameLower", "==", teamNameLower),
        limit(1)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error("A team with this name is already registered.");
      }

      // Add document to Firestore
      const newTeam = {
        ...data,
        teamNameLower,
        createdAt: serverTimestamp(),
      };
      await addDoc(teamsRef, newTeam);

      // Send confirmation email via API route
      const leader = data.members.find((m) => m.is_leader);
      if (leader && leader.email) {
        const memberNames = data.members.map((m) => m.fullname);
        try {
          await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: leader.email,
              teamName: data.teamName,
              memberNames,
            }),
          });
        } catch (emailErr) {
          console.warn("Email sending failed:", emailErr);
          // Don't fail registration if email fails
        }
      }

      setSubmitStatus("success");
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
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 shadow-[0_0_40px_rgba(16,185,129,0.4)]">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
        </div>
        <h2 className="mb-4 text-3xl font-orbitron font-extrabold tracking-wider text-white uppercase">
          Registration Complete!
        </h2>
        <p className="mb-2 max-w-md text-slate-300 font-sans leading-relaxed">
          Team <span className="font-bold text-violet-400">{watchedTeamName}</span> has been
          successfully registered.
        </p>
        <p className="mb-8 text-sm text-slate-500">
          A confirmation email has been sent to your team leader.
        </p>
        <Button
          variant="gradient"
          size="xl"
          className="shadow-[0_0_30px_rgba(0,53,153,0.4)]"
          onClick={() => {
            setValue("teamName", "");
            setValue("track", undefined as unknown as "school" | "university");
            setValue("members", [{ ...DEFAULT_MEMBER, is_leader: true }]);
            setSubmitStatus("idle");
            setCurrentStep(1);
          }}
        >
          Register Another Team
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Top Branding Header */}
      <div className="flex flex-col items-center justify-center mb-8 select-none">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full w-16 h-16 animate-pulse-glow" />
          <svg className="w-14 h-14 text-blue-400 relative filter drop-shadow-[0_0_15px_rgba(0,102,255,0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l-2-2 2-2m6 4l2-2-2-2" />
          </svg>
        </div>
        <div className="mt-3 text-xs font-orbitron font-bold tracking-[0.3em] text-blue-400 uppercase">
          NOVA REGISTRATION
        </div>
        <div className="mt-1 text-[9px] font-space font-semibold text-slate-500 tracking-[0.4em] uppercase">
          INNOVATION | TECHNOLOGY | OUTPOST
        </div>
      </div>

      {/* Main Banner Card - Show on Step 1 */}
      {currentStep === 1 && (
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-slate-950 via-slate-900/90 to-blue-950/40 p-6 sm:p-8 backdrop-blur-xl mb-8 shadow-[0_0_50px_rgba(0,53,153,0.15)] flex flex-col sm:flex-row justify-between items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-3.5 text-center sm:text-left z-10">
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start items-center">
              <span className="rounded-full bg-violet-600/25 border border-violet-500/40 px-3.5 py-1 text-[10px] font-space font-bold uppercase tracking-wider text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                IDEATHON PHASE
              </span>
              <span className="text-[10px] font-space font-bold text-slate-500 select-none">•</span>
              <span className="text-[10px] font-space font-bold tracking-widest text-slate-400 uppercase">SEC-REG-2.0</span>
            </div>
            <h1 className="text-2xl sm:text-3.5xl font-orbitron font-extrabold tracking-[0.06em] text-white uppercase leading-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              CLOUD CHALLENGE TEAM REGISTRATION
            </h1>
          </div>
          
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 flex items-center justify-center select-none opacity-80">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-indigo-500/20 blur-xl rounded-full" />
            <svg className="w-16 h-16 text-indigo-400/80 animate-float" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-.778.099-1.533.284-2.253" />
            </svg>
            <div className="absolute inset-x-0 h-[1px] bg-indigo-500/30 animate-[scan_3s_ease-in-out_infinite]" />
          </div>
        </div>
      )}

      {/* Info Rules Block - Show on Step 1 */}
      {currentStep === 1 && (
        <div className="relative overflow-hidden rounded-3xl bg-[#040819]/50 p-6 sm:p-8 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-orbitron font-extrabold tracking-wider text-white uppercase">
                JOIN THE <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 font-black drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">IDEATHON</span>
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-xl font-light">
                Form your dream team of 2 to 4 members to brainstorm, design and pitch breakthrough cloud computing architectures.
              </p>
            </div>
            <span className="rounded-lg bg-violet-500/10 border border-violet-500/20 px-4 py-1.5 text-[10px] font-space font-bold uppercase tracking-widest text-violet-300">
              PHASE 1
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 rounded-xl bg-white/[0.01] p-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[11px] font-space font-bold uppercase tracking-wider text-white">TEAM LIMITS</div>
                <div className="text-xs text-slate-400 mt-0.5">Teams must consist of exactly 2 to 4 members.</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 rounded-xl bg-white/[0.01] p-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[11px] font-space font-bold uppercase tracking-wider text-white">UNIVERSITY RULE</div>
                <div className="text-xs text-slate-400 mt-0.5">All members must represent the same university.</div>
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
              <div className="w-1 h-6 bg-gradient-to-b from-violet-500 to-indigo-500 rounded-full animate-pulse" />
              <span className="text-xs font-orbitron font-extrabold tracking-[0.25em] text-slate-300 uppercase">
                01 TEAM META MATRIX
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl border border-white/5 bg-[#030712]/40 backdrop-blur-sm">
              {/* Team Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="teamName"
                  className="text-xs font-space font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5"
                >
                  Team Name <span className="text-violet-400">*</span>
                </Label>
                <Input
                  id="teamName"
                  placeholder="Enter a creative cloud name"
                  className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-600 focus:border-violet-500/50 focus:ring-violet-500/20 h-12 text-sm rounded-xl"
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
                <Label className="text-xs font-space font-bold uppercase tracking-wider text-slate-300">
                  Competition Track <span className="text-violet-400">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-3 h-12">
                  <label
                    htmlFor="track-school"
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 cursor-pointer text-xs font-space font-bold transition-all duration-300 ${
                      watchedTrack === "school"
                        ? "bg-violet-500/10 border-violet-500 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                        : "bg-slate-950/40 border-white/10 hover:border-white/20 text-slate-400 hover:text-slate-200"
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
                        ? "bg-violet-500/10 border-violet-500 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                        : "bg-slate-950/40 border-white/10 hover:border-white/20 text-slate-400 hover:text-slate-200"
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
            <div className="flex justify-end pt-4">
              <Button
                type="button"
                variant="gradient"
                size="xl"
                className="group gap-2 shadow-[0_0_30px_rgba(139,92,246,0.3)] w-full sm:w-auto"
                onClick={handleNext}
              >
                Next: Add Members
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        )}

        {/* ==================== STEP 2: Members ==================== */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 select-none">
                <div className="w-1 h-6 bg-gradient-to-b from-violet-500 to-indigo-500 rounded-full animate-pulse" />
                <span className="text-xs font-orbitron font-extrabold tracking-[0.25em] text-slate-300 uppercase">
                  02 MEMBERS DATA MATRIX
                </span>
              </div>
              <span className="text-xs font-space font-medium text-slate-500">
                TEAM SIZE: <span className="text-violet-400 font-bold">{fields.length} / 5</span>
              </span>
            </div>

            <div className="space-y-4">
              {fields.map((field, index: number) => (
                <div
                  key={field.id}
                  className="relative rounded-2xl border border-white/5 bg-[#030712]/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/10"
                >
                  {/* Member header */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-all duration-300 ${
                          watchedMembers[index]?.is_leader
                            ? "bg-[var(--nova-secondary)]/10 text-[var(--nova-secondary)] border border-[var(--nova-secondary)]/30 shadow-[0_0_10px_rgba(255,184,28,0.2)]"
                            : "bg-white/5 text-slate-400 border border-white/5"
                        }`}
                      >
                        {watchedMembers[index]?.is_leader ? (
                          <Crown className="h-3.5 w-3.5" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span className="text-xs font-space font-bold tracking-wider text-white uppercase">
                        {watchedMembers[index]?.is_leader
                          ? "Team Leader"
                          : `Member ${index + 1}`}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!watchedMembers[index]?.is_leader && (
                        <button
                          type="button"
                          onClick={() => handleSetLeader(index)}
                          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.25 text-[10px] font-space font-bold uppercase tracking-wider text-slate-300 transition-all hover:border-[var(--nova-secondary)]/30 hover:bg-[var(--nova-secondary)]/10 hover:text-[var(--nova-secondary)] cursor-pointer"
                        >
                          Set Leader
                        </button>
                      )}
                      {fields.length > 2 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="rounded-lg border border-white/10 bg-white/5 p-1.25 text-slate-400 transition-all hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
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
                        className="text-[10px] font-space font-bold uppercase tracking-wider text-slate-400"
                      >
                        Full Name
                      </Label>
                      <Input
                        id={`members.${index}.fullname`}
                        placeholder="John Doe"
                        className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-700 focus:border-violet-500/50 h-10 rounded-lg text-xs"
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
                        className="text-[10px] font-space font-bold uppercase tracking-wider text-slate-400"
                      >
                        Email Address
                      </Label>
                      <Input
                        id={`members.${index}.email`}
                        type="email"
                        placeholder="john@example.com"
                        className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-700 focus:border-violet-500/50 h-10 rounded-lg text-xs"
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
                        className="text-[10px] font-space font-bold uppercase tracking-wider text-slate-400"
                      >
                        WhatsApp Number
                      </Label>
                      <Input
                        id={`members.${index}.whatsapp_no`}
                        placeholder="+94 77 123 4567"
                        className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-700 focus:border-violet-500/50 h-10 rounded-lg text-xs"
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
                        className="text-[10px] font-space font-bold uppercase tracking-wider text-slate-400"
                      >
                        NIC / ID Number
                      </Label>
                      <Input
                        id={`members.${index}.nic_no`}
                        placeholder="200012345678"
                        className="bg-slate-950/60 border-white/10 text-white placeholder:text-slate-700 focus:border-violet-500/50 h-10 rounded-lg text-xs"
                        {...register(`members.${index}.nic_no`)}
                      />
                      {errors.members?.[index]?.nic_no && (
                        <p className="mt-1 text-[10px] text-red-400">
                          {errors.members[index].nic_no.message}
                        </p>
                      )}
                    </div>
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
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/[0.01] p-3 text-xs font-space font-bold tracking-wider text-slate-400 transition-all hover:border-violet-500/20 hover:bg-violet-500/5 hover:text-violet-300 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Member ({fields.length}/5)
              </button>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <Button
                type="button"
                variant="ghost"
                size="lg"
                className="gap-2 text-slate-400 hover:text-white"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                type="button"
                variant="gradient"
                size="xl"
                className="group gap-2 shadow-[0_0_30px_rgba(139,92,246,0.3)] w-full sm:w-auto"
                onClick={handleNext}
              >
                Review Team
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        )}

        {/* ==================== STEP 3: Review ==================== */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-3 mb-6 select-none">
              <div className="w-1 h-6 bg-gradient-to-b from-violet-500 to-indigo-500 rounded-full animate-pulse" />
              <span className="text-xs font-orbitron font-extrabold tracking-[0.25em] text-slate-300 uppercase">
                03 COMPILATION & SUBMISSION
              </span>
            </div>

            {/* Team Summary */}
            <div className="rounded-2xl border border-white/5 bg-[#030712]/40 p-5 backdrop-blur-sm">
              <h3 className="mb-4 text-[10px] font-space font-bold uppercase tracking-widest text-slate-500">
                TEAM META SUMMARY
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-950/40 border border-white/5 p-4">
                  <div className="text-[10px] font-space font-bold uppercase tracking-wider text-slate-500">Team Name</div>
                  <div className="mt-1 text-base font-orbitron font-extrabold text-white tracking-wide uppercase">
                    {watchedTeamName}
                  </div>
                </div>
                
                <div className="rounded-xl bg-slate-950/40 border border-white/5 p-4">
                  <div className="text-[10px] font-space font-bold uppercase tracking-wider text-slate-500">Track</div>
                  <div className="mt-1 flex items-center gap-2">
                    {watchedTrack === "school" ? (
                      <School className="h-4 w-4 text-violet-400" />
                    ) : (
                      <GraduationCap className="h-4 w-4 text-violet-400" />
                    )}
                    <span className="text-sm font-space font-bold uppercase tracking-wider text-white">
                      {watchedTrack} TRACK
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Members Summary */}
            <div className="rounded-2xl border border-white/5 bg-[#030712]/40 p-5 backdrop-blur-sm">
              <h3 className="mb-4 text-[10px] font-space font-bold uppercase tracking-widest text-slate-500">
                TEAM MEMBERS MATRIX ({watchedMembers.length})
              </h3>
              <div className="space-y-3.5">
                {watchedMembers.map((member, index: number) => (
                  <div
                    key={index}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl p-4 transition-all duration-300 ${
                      member.is_leader
                        ? "bg-[var(--nova-secondary)]/5 border border-[var(--nova-secondary)]/20 shadow-[0_0_15px_rgba(255,184,28,0.05)]"
                        : "bg-slate-950/40 border border-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg font-bold ${
                          member.is_leader
                            ? "bg-[var(--nova-secondary)]/15 text-[var(--nova-secondary)] border border-[var(--nova-secondary)]/30"
                            : "bg-white/5 text-slate-400 border border-white/5"
                        }`}
                      >
                        {member.is_leader ? (
                          <Crown className="h-4 w-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white truncate text-sm">
                            {member.fullname || "—"}
                          </span>
                          {member.is_leader && (
                            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[9px] font-space font-bold uppercase tracking-wider text-amber-300 border border-amber-500/20">
                              Leader
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 truncate mt-0.5">
                          {member.email || "—"}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between sm:justify-end gap-6 text-right text-xs font-sans text-slate-400 sm:border-l sm:border-white/5 sm:pl-6">
                      <div className="space-y-0.5">
                        <div className="text-[9px] font-space font-bold text-slate-500 text-left sm:text-right uppercase tracking-wider">WHATSAPP</div>
                        <div className="text-slate-300 font-medium">{member.whatsapp_no || "—"}</div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-[9px] font-space font-bold text-slate-500 text-left sm:text-right uppercase tracking-wider">NIC / ID</div>
                        <div className="text-slate-300 font-medium">{member.nic_no || "—"}</div>
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
                  <div className="font-space font-bold uppercase tracking-wider text-red-300">Registration Failed</div>
                  <div className="mt-1 text-red-400/80 leading-relaxed">{serverError}</div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <Button
                type="button"
                variant="ghost"
                size="lg"
                className="gap-2 text-slate-400 hover:text-white"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4" />
                Edit Members
              </Button>
              <Button
                type="submit"
                variant="gradient"
                size="xl"
                disabled={submitStatus === "loading"}
                className="group gap-2 shadow-[0_0_30px_rgba(139,92,246,0.3)] disabled:opacity-60 w-full sm:w-auto"
              >
                {submitStatus === "loading" ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting Matrix...
                  </>
                ) : (
                  <>
                    Submit Registration
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
