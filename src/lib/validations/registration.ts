import { z } from "zod";
import { sanitizeHtml, sanitizePhone, sanitizeEmail, sanitizeNic } from "@/lib/sanitize";

export const YEAR_OPTIONS = [
  "First Year",
  "Second Year",
  "Third Year",
  "Fourth Year",
] as const;

export const memberSchema = z.object({
  fullname: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(150, "Full name cannot exceed 150 characters")
    .transform(sanitizeHtml),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .transform(sanitizeEmail),
  whatsapp_no: z
    .string()
    .trim()
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "");
        return digits.startsWith("0");
      },
      { message: "WhatsApp number must start with 0 (e.g. 0774710234)" }
    )
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "");
        return digits.length <= 10;
      },
      { message: "WhatsApp number cannot exceed 10 digits" }
    )
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "");
        return digits.length >= 10;
      },
      { message: "WhatsApp number must be 10 digits (e.g. 0774710234)" }
    )
    .transform(sanitizePhone),
  nic_no: z
    .string()
    .trim()
    .min(5, "NIC/ID number must be at least 5 characters")
    .max(20, "NIC/ID number cannot exceed 20 characters")
    .transform(sanitizeNic),
  // University-track fields (only required when track === "university" — enforced below)
  university: z
    .string()
    .trim()
    .max(150, "University name cannot exceed 150 characters")
    .transform(sanitizeHtml)
    .optional(),
  year: z.union([z.enum(YEAR_OPTIONS), z.literal("")]).optional(),
  degree: z
    .string()
    .trim()
    .max(150, "Degree name cannot exceed 150 characters")
    .transform(sanitizeHtml)
    .optional(),
  is_leader: z.boolean(),
});

export const registrationSchema = z.object({
  teamName: z
    .string()
    .trim()
    .min(3, "Team name must be at least 3 characters")
    .max(100, "Team name cannot exceed 100 characters")
    .transform(sanitizeHtml),
  track: z.enum(["school", "university"], {
    message: "Please select a competition track",
  }),
  institutionName: z
    .string()
    .trim()
    .max(150, "Name cannot exceed 150 characters")
    .transform(sanitizeHtml),
  members: z
    .array(memberSchema)
    .min(4, "A team must have at least 4 members including the leader")
    .max(5, "A team cannot have more than 5 members")
    .refine(
      (members) => members.filter((m) => m.is_leader).length === 1,
      { message: "Exactly one team member must be designated as the leader" }
    ),
}).superRefine((data, ctx) => {
  if (!data.institutionName || data.institutionName.length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["institutionName"],
      message: data.track === "school" ? "School name is required" : "University name is required",
    });
  }

  // University-track fields are required only when the University track is selected
  if (data.track === "university") {
    data.members.forEach((member, index) => {
      if (!member.year) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["members", index, "year"],
          message: "Please select your year of study",
        });
      }
      if (!member.degree || member.degree.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["members", index, "degree"],
          message: "Degree name is required",
        });
      }
    });
  }
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type MemberData = z.infer<typeof memberSchema>;