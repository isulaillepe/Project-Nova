// src/app/submit/proposal/actions.ts
"use server";

import { z } from "zod";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { emailSchema, otpSchema, proposalSchema, type ProposalInput } from "@/lib/validations/proposal";

// Try initializing Admin SDK, or return null to fall back to Client SDK
async function getAdminDb(): Promise<FirebaseFirestore.Firestore | null> {
  try {
    const { getApps, initializeApp, cert } = await import("firebase-admin/app");
    const { getFirestore } = await import("firebase-admin/firestore");

    if (!getApps().length) {
      const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

      if (!projectId || !clientEmail || !privateKey) {
        return null;
      }

      initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
      });
    }
    return getFirestore();
  } catch {
    return null;
  }
}

const OTP_COLLECTION = "otp_codes";
const TEAMS_COLLECTION = "teams";
const PROPOSALS_COLLECTION = "proposals";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateReferenceId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PRP-${year}-${random}`;
}

async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || "noreply@projectnova.lk";

  if (!resendApiKey) {
    console.warn("RESEND_API_KEY not configured. Logging email instead:");
    console.log(`To: ${to}, Subject: ${subject}`);
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend API error: ${error}`);
    }
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

export async function sendOTP(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const rawEmail = formData.get("email");
    const validated = emailSchema.parse({ email: rawEmail });
    const email = validated.email.toLowerCase();

    const adminDb = await getAdminDb();
    const code = generateOTP();
    const expiresAtDate = new Date(Date.now() + 10 * 60 * 1000);

    if (adminDb) {
      const otpRef = adminDb.collection(OTP_COLLECTION).doc(email);
      const otpSnap = await otpRef.get();

      if (otpSnap.exists) {
        const data = otpSnap.data() || {};
        const lastSent = data.lastSentAt?.toDate?.() || new Date(0);
        const minutesSinceLastSent = (Date.now() - lastSent.getTime()) / 60000;
        if (minutesSinceLastSent < 1) {
          return { success: false, error: "Please wait before requesting another code." };
        }
        const hourAgo = new Date(Date.now() - 3600000);
        if (data.sentAt && data.sentAt.toDate() > hourAgo && (data.attempts || 0) >= 3) {
          return { success: false, error: "Too many requests. Try again later." };
        }
      }

      await otpRef.set({
        email,
        code,
        expiresAt: expiresAtDate,
        attempts: 0,
        lastSentAt: new Date(),
        sentAt: new Date(),
      }, { merge: true });
    } else {
      const otpRef = doc(db, OTP_COLLECTION, email);
      const otpSnap = await getDoc(otpRef);

      if (otpSnap.exists()) {
        const data = otpSnap.data();
        const lastSent = data.lastSentAt?.toDate?.() || new Date(0);
        const minutesSinceLastSent = (Date.now() - lastSent.getTime()) / 60000;
        if (minutesSinceLastSent < 1) {
          return { success: false, error: "Please wait before requesting another code." };
        }
        const hourAgo = new Date(Date.now() - 3600000);
        if (data.sentAt && data.sentAt.toDate() > hourAgo && (data.attempts || 0) >= 3) {
          return { success: false, error: "Too many requests. Try again later." };
        }
      }

      await setDoc(otpRef, {
        email,
        code,
        expiresAt: Timestamp.fromDate(expiresAtDate),
        attempts: 0,
        lastSentAt: serverTimestamp(),
        sentAt: serverTimestamp(),
      }, { merge: true });
    }

    // Send email
    await sendEmail({
      to: email,
      subject: "Project Nova - Your Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #001233;">Project Nova</h1>
          <p>Your verification code is:</p>
          <div style="font-size: 32px; font-weight: bold; color: #FFB81B; letter-spacing: 8px; margin: 20px 0;">${code}</div>
          <p>This code expires in 10 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore.</p>
        </div>
      `,
    });

    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0].message };
    }
    console.error("sendOTP error:", err);
    return { success: false, error: "Failed to send code. Please try again." };
  }
}

export async function verifyOTP(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const rawEmail = formData.get("email");
    const rawCode = formData.get("code");
    const validated = otpSchema.parse({ email: rawEmail, code: rawCode });
    const email = validated.email.toLowerCase();
    const code = validated.code;

    const adminDb = await getAdminDb();

    if (adminDb) {
      const otpRef = adminDb.collection(OTP_COLLECTION).doc(email);
      const otpSnap = await otpRef.get();

      if (!otpSnap.exists) {
        return { success: false, error: "No code found. Please request a new one." };
      }

      const data = otpSnap.data() || {};
      if (data.expiresAt?.toDate?.() < new Date()) {
        await otpRef.set({ code: null }, { merge: true });
        return { success: false, error: "Code expired. Please request a new one." };
      }

      if ((data.attempts || 0) >= 3) {
        return { success: false, error: "Too many attempts. Please request a new code." };
      }

      if (data.code !== code) {
        await otpRef.set({ attempts: (data.attempts || 0) + 1 }, { merge: true });
        const remaining = 3 - (data.attempts || 0) - 1;
        return { success: false, error: `Incorrect code. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.` };
      }

      await otpRef.set({ verified: true, code: null }, { merge: true });
      return { success: true };
    } else {
      const otpRef = doc(db, OTP_COLLECTION, email);
      const otpSnap = await getDoc(otpRef);

      if (!otpSnap.exists()) {
        return { success: false, error: "No code found. Please request a new one." };
      }

      const data = otpSnap.data();
      if (data.expiresAt?.toDate() < new Date()) {
        await setDoc(otpRef, { code: null }, { merge: true });
        return { success: false, error: "Code expired. Please request a new one." };
      }

      if (data.attempts >= 3) {
        return { success: false, error: "Too many attempts. Please request a new code." };
      }

      if (data.code !== code) {
        await setDoc(otpRef, { attempts: (data.attempts || 0) + 1 }, { merge: true });
        const remaining = 3 - (data.attempts || 0) - 1;
        return { success: false, error: `Incorrect code. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.` };
      }

      await setDoc(otpRef, { verified: true, code: null }, { merge: true });
      return { success: true };
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0].message };
    }
    console.error("verifyOTP error:", err);
    return { success: false, error: "Verification failed. Please try again." };
  }
}

export async function getTeamsByEmail(email: string): Promise<{ success: boolean; teams?: Array<{ teamId: string; teamName: string; track: string; institutionName: string; memberCount: number }>; error?: string }> {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const adminDb = await getAdminDb();

    if (adminDb) {
      const teamsCollection = adminDb.collection(TEAMS_COLLECTION);
      const leaderQuery = await teamsCollection.where("leader.email", "==", normalizedEmail).get();
      const memberQuery = await teamsCollection.where("members", "array-contains", normalizedEmail).get();

      const teamsMap = new Map<string, any>();

      leaderQuery.docs.forEach(docSnap => {
        teamsMap.set(docSnap.id, { teamId: docSnap.id, ...docSnap.data() });
      });
      memberQuery.docs.forEach(docSnap => {
        if (!teamsMap.has(docSnap.id)) {
          teamsMap.set(docSnap.id, { teamId: docSnap.id, ...docSnap.data() });
        }
      });

      const teams = Array.from(teamsMap.values()).map(t => ({
        teamId: t.teamId,
        teamName: t.teamName,
        track: t.track,
        institutionName: t.institutionName,
        memberCount: t.memberCount,
      }));

      return { success: true, teams };
    } else {
      const teamsCollection = collection(db, TEAMS_COLLECTION);
      const leaderQuery = query(teamsCollection, where("leader.email", "==", normalizedEmail));
      const memberQuery = query(teamsCollection, where("members", "array-contains", normalizedEmail));

      const [leaderSnap, memberSnap] = await Promise.all([getDocs(leaderQuery), getDocs(memberQuery)]);

      const teamsMap = new Map<string, any>();

      leaderSnap.docs.forEach(docSnap => {
        teamsMap.set(docSnap.id, { teamId: docSnap.id, ...docSnap.data() });
      });
      memberSnap.docs.forEach(docSnap => {
        if (!teamsMap.has(docSnap.id)) {
          teamsMap.set(docSnap.id, { teamId: docSnap.id, ...docSnap.data() });
        }
      });

      const teams = Array.from(teamsMap.values()).map(t => ({
        teamId: t.teamId,
        teamName: t.teamName,
        track: t.track,
        institutionName: t.institutionName,
        memberCount: t.memberCount,
      }));

      return { success: true, teams };
    }
  } catch (err) {
    console.error("getTeamsByEmail error:", err);
    return { success: false, error: "Failed to fetch teams. Please try again." };
  }
}

export async function submitProposal(formData: FormData): Promise<{ success: boolean; referenceId?: string; error?: string }> {
  try {
    const rawData: Record<string, unknown> = {
      email: formData.get("email"),
      teamId: formData.get("teamId"),
      projectTitle: formData.get("projectTitle"),
      problemStatement: formData.get("problemStatement"),
      proposedSolution: formData.get("proposedSolution"),
      techStack: formData.get("techStack") || "",
      githubUrl: formData.get("githubUrl") || "",
      demoUrl: formData.get("demoUrl") || "",
      confirmed: formData.get("confirmed") === "true",
    };

    const validatedData = proposalSchema.parse(rawData) as ProposalInput;
    const adminDb = await getAdminDb();

    if (adminDb) {
      const existingQuery = adminDb.collection(PROPOSALS_COLLECTION).where("teamId", "==", validatedData.teamId);
      const existingSnap = await existingQuery.get();

      if (!existingSnap.empty) {
        return { success: false, error: "This team has already submitted a proposal." };
      }

      const referenceId = generateReferenceId();
      const proposalPayload = {
        ...validatedData,
        referenceId,
        submittedAt: new Date(),
        status: "pending",
      };

      await adminDb.collection(PROPOSALS_COLLECTION).add(proposalPayload);

      try {
        await fetch(process.env.APPS_SCRIPT_WEBHOOK_URL || "", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "proposal_submission",
            referenceId,
            teamId: validatedData.teamId,
            projectTitle: validatedData.projectTitle,
            email: validatedData.email,
            timestamp: new Date().toISOString(),
          }),
          signal: AbortSignal.timeout(10_000),
        });
      } catch (webhookErr) {
        console.warn("Proposal submission webhook failed (non-blocking):", webhookErr);
      }

      return { success: true, referenceId };
    } else {
      const proposalsCollection = collection(db, PROPOSALS_COLLECTION);
      const existingQuery = query(proposalsCollection, where("teamId", "==", validatedData.teamId));
      const existingSnap = await getDocs(existingQuery);

      if (!existingSnap.empty) {
        return { success: false, error: "This team has already submitted a proposal." };
      }

      const referenceId = generateReferenceId();
      const proposalPayload = {
        ...validatedData,
        referenceId,
        submittedAt: serverTimestamp(),
        status: "pending",
      };

      await addDoc(proposalsCollection, proposalPayload);

      try {
        await fetch(process.env.APPS_SCRIPT_WEBHOOK_URL || "", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "proposal_submission",
            referenceId,
            teamId: validatedData.teamId,
            projectTitle: validatedData.projectTitle,
            email: validatedData.email,
            timestamp: new Date().toISOString(),
          }),
          signal: AbortSignal.timeout(10_000),
        });
      } catch (webhookErr) {
        console.warn("Proposal submission webhook failed (non-blocking):", webhookErr);
      }

      return { success: true, referenceId };
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      const messages = err.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
      return { success: false, error: `Validation failed: ${messages}` };
    }
    console.error("submitProposal error:", err);
    return { success: false, error: "Submission failed. Please try again." };
  }
}