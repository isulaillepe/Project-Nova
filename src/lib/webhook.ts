"use server";

interface RegistrationWebhookPayload {
  teamName: string;
  track: "school" | "university";
  institutionName: string;
  leaderEmail: string;
  leaderName: string;
  memberNames: string[];
  memberCount: number;
}

/**
 * Triggers the Google Apps Script webhook for registration notifications.
 * This function is fire-and-forget - it logs errors but doesn't throw,
 * so it won't block or fail the registration flow.
 */
export async function triggerRegistrationWebhook(
  payload: RegistrationWebhookPayload
): Promise<void> {
  const webhookUrl = process.env.REGISTRATION_WEBHOOK_URL || process.env.APPS_SCRIPT_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("REGISTRATION_WEBHOOK_URL not configured. Skipping webhook trigger.");
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
      }),
      // 10 second timeout to prevent hanging
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      console.error(
        `Webhook returned ${response.status}: ${errorText}`,
        { teamName: payload.teamName }
      );
    } else {
      console.log(`Registration webhook triggered successfully for team: ${payload.teamName}`);
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      console.error("Webhook request timed out after 10s", { teamName: payload.teamName });
    } else {
      console.error("Failed to trigger registration webhook:", error, {
        teamName: payload.teamName,
      });
    }
  }
}