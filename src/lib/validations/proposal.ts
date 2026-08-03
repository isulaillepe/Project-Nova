// src/lib/validations/proposal.ts
import { z } from "zod";
import { sanitizeHtml, sanitizeEmail, sanitizeUrl } from "@/lib/sanitize";

export const emailSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").transform(sanitizeEmail),
});

export const otpSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6, "Code must be 6 digits").regex(/^\d+$/, "Code must contain only numbers"),
});

export const teamSchema = z.object({
  teamId: z.string().min(1, "Please select a team"),
});

export const projectSchema = z.object({
  projectTitle: z.string().trim().min(5, "Title must be at least 5 characters").max(120, "Title cannot exceed 120 characters").transform(sanitizeHtml),
  problemStatement: z.string().trim().min(50, "Problem statement must be at least 50 characters").max(2000, "Problem statement cannot exceed 2000 characters").transform(sanitizeHtml),
  proposedSolution: z.string().trim().min(50, "Proposed solution must be at least 50 characters").max(3000, "Proposed solution cannot exceed 3000 characters").transform(sanitizeHtml),
  techStack: z.string().max(500, "Tech stack cannot exceed 500 characters").transform(sanitizeHtml).optional(),
  githubUrl: z.string().url("Invalid GitHub URL").transform(sanitizeUrl).optional().or(z.literal("")),
  demoUrl: z.string().url("Invalid demo URL").transform(sanitizeUrl).optional().or(z.literal("")),
});

export const proposalSchema = z.object({
  email: z.string().email(),
  teamId: z.string().min(1),
  projectTitle: z.string().trim().min(5).max(120).transform(sanitizeHtml),
  problemStatement: z.string().trim().min(50).max(2000).transform(sanitizeHtml),
  proposedSolution: z.string().trim().min(50).max(3000).transform(sanitizeHtml),
  techStack: z.string().max(500).transform(sanitizeHtml).optional(),
  githubUrl: z.string().url().transform(sanitizeUrl).optional().or(z.literal("")),
  demoUrl: z.string().url().transform(sanitizeUrl).optional().or(z.literal("")),
  confirmed: z.literal(true, { errorMap: () => ({ message: "You must confirm the proposal is complete and accurate" }) }),
});

export type EmailInput = z.infer<typeof emailSchema>;
export type OTPInput = z.infer<typeof otpSchema>;
export type TeamInput = z.infer<typeof teamSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type ProposalInput = z.infer<typeof proposalSchema>;
