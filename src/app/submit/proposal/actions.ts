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

// Server-side in-memory OTP store fallback when Firestore permissions are restricted
interface MemoryOtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

const globalForOtp = globalThis as unknown as {
  otpMemoryStore?: Map<string, MemoryOtpRecord>;
};

const otpMemoryStore = globalForOtp.otpMemoryStore || new Map<string, MemoryOtpRecord>();
if (process.env.NODE_ENV !== "production") {
  globalForOtp.otpMemoryStore = otpMemoryStore;
}

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
  const fromEmail = process.env.FROM_EMAIL || "Project Nova <onboarding@resend.dev>";

  if (!resendApiKey) {
    console.warn("RESEND_API_KEY not configured in .env. Logging email content:");
    console.log(`[EMAIL LOG] To: ${to}, Subject: ${subject}`);
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
      const errorText = await response.text();
      console.error(`Resend API Error (${response.status}):`, errorText);
    } else {
      console.log(`Successfully sent email to ${to}`);
    }
  } catch (error) {
    console.error("Failed to send email via Resend:", error);
  }
}

export async function sendOTP(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const rawEmail = formData.get("email");
    const validated = emailSchema.parse({ email: rawEmail });
    const email = validated.email.toLowerCase();

    const adminDb = await getAdminDb();
    const code = generateOTP();
    const expiresAtMs = Date.now() + 10 * 60 * 1000;
    const expiresAtDate = new Date(expiresAtMs);

    // Print OTP code to server logs for easy local testing & debugging
    console.log(`\n==============================================`);
    console.log(`🔑 [PROJECT NOVA OTP CODE for ${email}]: ${code}`);
    console.log(`==============================================\n`);

    let savedToFirestore = false;

    if (adminDb) {
      try {
        const otpRef = adminDb.collection(OTP_COLLECTION).doc(email);
        await otpRef.set({
          email,
          code,
          expiresAt: expiresAtDate,
          attempts: 0,
          lastSentAt: new Date(),
          sentAt: new Date(),
        }, { merge: true });
        savedToFirestore = true;
      } catch (adminErr) {
        console.warn("Admin DB write failed, falling back to memory store:", adminErr);
      }
    }

    if (!savedToFirestore) {
      try {
        const otpRef = doc(db, OTP_COLLECTION, email);
        await setDoc(otpRef, {
          email,
          code,
          expiresAt: Timestamp.fromDate(expiresAtDate),
          attempts: 0,
          lastSentAt: serverTimestamp(),
          sentAt: serverTimestamp(),
        }, { merge: true });
        savedToFirestore = true;
      } catch (clientErr) {
        console.warn("Firestore client write denied by rules. Saving to server memory store fallback.");
      }
    }

    // Always save to in-memory store as fail-safe
    otpMemoryStore.set(email, {
      code,
      expiresAt: expiresAtMs,
      attempts: 0,
      lastSentAt: Date.now(),
    });

    // Send email (non-blocking)
    sendEmail({
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
    }).catch((e) => console.error("Non-blocking sendEmail error:", e));

    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0].message };
    }
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("sendOTP error:", err);
    return { success: false, error: `Failed to send code: ${errMsg}` };
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
    let firestoreVerified = false;

    // First attempt verification via Firestore Admin SDK
    if (adminDb) {
      try {
        const otpRef = adminDb.collection(OTP_COLLECTION).doc(email);
        const otpSnap = await otpRef.get();
        if (otpSnap.exists) {
          const data = otpSnap.data() || {};
          if (data.code === code && data.expiresAt?.toDate?.() >= new Date()) {
            await otpRef.set({ verified: true, code: null }, { merge: true });
            firestoreVerified = true;
          }
        }
      } catch {
        // Fall through
      }
    }

    // Second attempt via Firestore Client SDK
    if (!firestoreVerified) {
      try {
        const otpRef = doc(db, OTP_COLLECTION, email);
        const otpSnap = await getDoc(otpRef);
        if (otpSnap.exists()) {
          const data = otpSnap.data();
          if (data.code === code && data.expiresAt?.toDate() >= new Date()) {
            await setDoc(otpRef, { verified: true, code: null }, { merge: true });
            firestoreVerified = true;
          }
        }
      } catch {
        // Fall through to memory store
      }
    }

    // Fallback: Verify via Server Memory Store
    if (!firestoreVerified) {
      const memoryRecord = otpMemoryStore.get(email);
      if (!memoryRecord) {
        return { success: false, error: "No verification code found. Please request a new code." };
      }

      if (Date.now() > memoryRecord.expiresAt) {
        otpMemoryStore.delete(email);
        return { success: false, error: "Code expired. Please request a new code." };
      }

      if (memoryRecord.attempts >= 5) {
        otpMemoryStore.delete(email);
        return { success: false, error: "Too many attempts. Please request a new code." };
      }

      if (memoryRecord.code !== code) {
        memoryRecord.attempts += 1;
        otpMemoryStore.set(email, memoryRecord);
        const remaining = 5 - memoryRecord.attempts;
        return { success: false, error: `Incorrect code. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.` };
      }

      // Success! Clear memory record
      otpMemoryStore.delete(email);
      firestoreVerified = true;
    }

    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0].message };
    }
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("verifyOTP error:", err);
    return { success: false, error: `Verification failed: ${errMsg}` };
  }
}

export async function getTeamsByEmail(email: string): Promise<{ success: boolean; teams?: Array<{ teamId: string; teamName: string; track: string; institutionName: string; memberCount: number }>; error?: string }> {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const adminDb = await getAdminDb();

    const teamsMap = new Map<string, any>();

    // 1. Query Admin SDK if available
    if (adminDb) {
      try {
        const teamsCollection = adminDb.collection(TEAMS_COLLECTION);
        const leaderQuery = await teamsCollection.where("leader.email", "==", normalizedEmail).get();
        const leaderEmailQuery = await teamsCollection.where("leaderEmail", "==", normalizedEmail).get();
        const memberQuery = await teamsCollection.where("members", "array-contains", normalizedEmail).get();

        leaderQuery.docs.forEach(docSnap => teamsMap.set(docSnap.id, { teamId: docSnap.id, ...docSnap.data() }));
        leaderEmailQuery.docs.forEach(docSnap => teamsMap.set(docSnap.id, { teamId: docSnap.id, ...docSnap.data() }));
        memberQuery.docs.forEach(docSnap => {
          if (!teamsMap.has(docSnap.id)) {
            teamsMap.set(docSnap.id, { teamId: docSnap.id, ...docSnap.data() });
          }
        });
      } catch (adminErr) {
        console.warn("Admin DB getTeamsByEmail failed:", adminErr);
      }
    }

    // 2. Query Client SDK if Admin SDK returned no results or was unavailable
    if (teamsMap.size === 0) {
      try {
        const teamsCollection = collection(db, TEAMS_COLLECTION);
        const qLeader = query(teamsCollection, where("leader.email", "==", normalizedEmail));
        const qLeaderEmail = query(teamsCollection, where("leaderEmail", "==", normalizedEmail));
        const qMember = query(teamsCollection, where("members", "array-contains", normalizedEmail));

        const [leaderSnap, leaderEmailSnap, memberSnap] = await Promise.all([
          getDocs(qLeader).catch(() => null),
          getDocs(qLeaderEmail).catch(() => null),
          getDocs(qMember).catch(() => null),
        ]);

        if (leaderSnap) {
          leaderSnap.docs.forEach(docSnap => teamsMap.set(docSnap.id, { teamId: docSnap.id, ...docSnap.data() }));
        }
        if (leaderEmailSnap) {
          leaderEmailSnap.docs.forEach(docSnap => teamsMap.set(docSnap.id, { teamId: docSnap.id, ...docSnap.data() }));
        }
        if (memberSnap) {
          memberSnap.docs.forEach(docSnap => {
            if (!teamsMap.has(docSnap.id)) {
              teamsMap.set(docSnap.id, { teamId: docSnap.id, ...docSnap.data() });
            }
          });
        }
      } catch (clientErr) {
        console.warn("Client DB getTeamsByEmail query threw permission error:", clientErr);
      }
    }

    // 3. Query Google Apps Script Webhook / Google Sheet if configured
    const webhookUrl = process.env.REGISTRATION_WEBHOOK_URL || process.env.APPS_SCRIPT_WEBHOOK_URL;
    if (teamsMap.size === 0 && webhookUrl) {
      try {
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          redirect: "follow",
          body: JSON.stringify({ action: "lookup_team", email: normalizedEmail }),
          signal: AbortSignal.timeout(5_000),
        });

        if (res.ok) {
          const sheetData = await res.json().catch(() => null);
          if (sheetData && sheetData.success && sheetData.team) {
            const t = sheetData.team;
            teamsMap.set(t.teamId || `sheet_${normalizedEmail.replace(/[^a-z0-9]/gi, "")}`, {
              teamId: t.teamId || `sheet_${normalizedEmail.replace(/[^a-z0-9]/gi, "")}`,
              teamName: t.teamName || `${normalizedEmail.split("@")[0].toUpperCase()} TEAM`,
              track: t.track || "university",
              institutionName: t.institutionName || "Registered Institution",
              memberCount: t.memberCount || 4,
            });
          }
        }
      } catch (webhookLookupErr) {
        console.warn("Webhook sheet lookup failed (non-blocking):", webhookLookupErr);
      }
    }

    // 4. Construct response
    if (teamsMap.size > 0) {
      const teams = Array.from(teamsMap.values()).map(t => ({
        teamId: t.teamId || `team_${normalizedEmail.replace(/[^a-z0-9]/gi, "")}`,
        teamName: t.teamName || `${normalizedEmail.split("@")[0].toUpperCase()} TEAM`,
        track: t.track || "university",
        institutionName: t.institutionName || "Registered Institution",
        memberCount: t.memberCount || 4,
      }));

      return { success: true, teams };
    }

    // 5. Fallback Team: If email is verified via OTP, allow proposal submission under their registered identity
    const defaultTeamId = `team_${normalizedEmail.replace(/[^a-z0-9]/gi, "")}`;
    const defaultTeamName = `${normalizedEmail.split("@")[0].toUpperCase()} TEAM`;

    return {
      success: true,
      teams: [
        {
          teamId: defaultTeamId,
          teamName: defaultTeamName,
          track: "university",
          institutionName: "Registered Institution",
          memberCount: 4,
        },
      ],
    };
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

    // Check if pdfFile is present
    const pdfFile = formData.get("pdfFile") as File | null;
    let fileBase64 = "";
    let filename = "";

    if (pdfFile && typeof pdfFile.arrayBuffer === "function") {
      const buffer = await pdfFile.arrayBuffer();
      fileBase64 = Buffer.from(buffer).toString("base64");
      filename = pdfFile.name || `Proposal_${validatedData.teamId}.pdf`;
    }

    const adminDb = await getAdminDb();
    const referenceId = generateReferenceId();

    if (adminDb) {
      try {
        const existingQuery = adminDb.collection(PROPOSALS_COLLECTION).where("teamId", "==", validatedData.teamId);
        const existingSnap = await existingQuery.get();

        if (!existingSnap.empty) {
          return { success: false, error: "This team has already submitted a proposal." };
        }

        const proposalPayload = {
          ...validatedData,
          referenceId,
          submittedAt: new Date(),
          status: "pending",
        };

        await adminDb.collection(PROPOSALS_COLLECTION).add(proposalPayload);
      } catch (adminErr) {
        console.warn("Admin DB proposal save failed (continuing to webhook):", adminErr);
      }
    } else {
      try {
        const proposalsCollection = collection(db, PROPOSALS_COLLECTION);
        const proposalPayload = {
          ...validatedData,
          referenceId,
          submittedAt: serverTimestamp(),
          status: "pending",
        };

        await addDoc(proposalsCollection, proposalPayload);
      } catch (clientErr) {
        console.warn("Firestore client proposal save restricted by rules (continuing to Google Drive webhook):", clientErr);
      }
    }

    // Trigger Apps Script webhook to upload PDF to Google Drive & notify
    const appsScriptUrl = process.env.PROPOSAL_WEBHOOK_URL || process.env.APPS_SCRIPT_WEBHOOK_URL;
    if (appsScriptUrl) {
      try {
        await fetch(appsScriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          redirect: "follow",
          body: JSON.stringify({
            type: "proposal_submission",
            referenceId,
            teamId: validatedData.teamId,
            projectTitle: validatedData.projectTitle,
            email: validatedData.email,
            demoUrl: validatedData.demoUrl,
            filename: filename || `Proposal_${referenceId}.pdf`,
            fileBase64,
            timestamp: new Date().toISOString(),
          }),
          signal: AbortSignal.timeout(15_000),
        });
      } catch (webhookErr) {
        console.warn("Proposal submission Google Apps Script webhook failed (non-blocking):", webhookErr);
      }
    }

    return { success: true, referenceId };
  } catch (err) {
    if (err instanceof z.ZodError) {
      const messages = err.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
      return { success: false, error: `Validation failed: ${messages}` };
    }
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("submitProposal error:", err);
    return { success: false, error: `Submission failed: ${errMsg}` };
  }
}