"use server";

import { z } from "zod";
import { registrationSchema, type RegistrationFormData } from "@/lib/validations/registration";
import { sendRegistrationEmail } from "@/lib/mailer";
import { db as clientDb } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";

// Try initializing Admin SDK, or return null to fall back to Client SDK
async function getAdminDb() {
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

interface ActionResult {
  success: boolean;
  error?: string;
  teamName?: string;
}

export async function registerTeam(
  formData: FormData
): Promise<ActionResult> {
  try {
    // Parse and validate form data
    const rawData: Record<string, unknown> = {
      teamName: formData.get("teamName"),
      track: formData.get("track"),
      members: JSON.parse(formData.get("members") as string),
    };

    const validatedData = registrationSchema.parse(rawData) as RegistrationFormData;

    const formattedTeamName = validatedData.teamName.trim();
    const teamNameLower = formattedTeamName.toLowerCase();

    const leader = validatedData.members.find((m) => m.is_leader) || validatedData.members[0];
    const otherMembers = validatedData.members.filter((m) => !m.is_leader);

    const teamPayload = {
      teamName: formattedTeamName,
      track: validatedData.track,
      leader,
      members: validatedData.members,
      otherMembers,
      memberCount: validatedData.members.length,
      teamNameLower,
    };

    const adminDb = await getAdminDb();

    if (adminDb) {
      // 1. Use Firebase Admin SDK
      const teamsRef = adminDb.collection("teams");
      const existingQuery = await teamsRef
        .where("teamNameLower", "==", teamNameLower)
        .limit(1)
        .get();

      if (!existingQuery.empty) {
        return { success: false, error: "A team with this name is already registered." };
      }

      const { FieldValue } = await import("firebase-admin/firestore");
      await teamsRef.add({
        ...teamPayload,
        createdAt: FieldValue.serverTimestamp(),
      });
    } else {
      // 2. Fallback to Firebase Client SDK
      const teamsCollection = collection(clientDb, "teams");
      const q = query(teamsCollection, where("teamNameLower", "==", teamNameLower));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        return { success: false, error: "A team with this name is already registered." };
      }

      await addDoc(teamsCollection, {
        ...teamPayload,
        createdAt: serverTimestamp(),
      });
    }

    // Send confirmation email server-side (after successful registration)
    if (leader && leader.email) {
      const memberNames = validatedData.members.map((m) => m.fullname);
      try {
        await sendRegistrationEmail(leader.email, validatedData.teamName, memberNames);
      } catch (emailErr) {
        console.warn("Email sending failed:", emailErr);
        // Don't fail registration if email fails
      }
    }

    return { success: true, teamName: validatedData.teamName };
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      const messages = err.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
      return { success: false, error: `Validation failed: ${messages}` };
    }
    const message = err instanceof Error ? err.message : "An unexpected error occurred";
    console.error("Registration error:", message);
    return { success: false, error: message };
  }
}