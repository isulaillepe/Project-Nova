import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendRegistrationEmail } from "@/lib/mailer";
import { sanitizeEmail, sanitizeText, escapeHtml } from "@/lib/sanitize";

// Simple schema for email request
const emailSchema = z.object({
  email: z.string().email().transform(sanitizeEmail),
  teamName: z.string().min(1).transform((val) => escapeHtml(sanitizeText(val, { maxLength: 100 }))),
  memberNames: z.array(z.string()).transform((arr) =>
    arr.map((name) => escapeHtml(sanitizeText(name, { maxLength: 100 })))
  ),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = emailSchema.parse(body);

    // Send confirmation email
    await sendRegistrationEmail(validatedData.email, validatedData.teamName, validatedData.memberNames);

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failure", details: err.issues },
        { status: 422 }
      );
    }
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Email Error:", message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}