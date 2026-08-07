import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter (use Upstash Redis in production for multi-instance deployments)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  VERIFY_EMAIL: { max: 3, windowMs: 60_000 },      // 3 per minute
  VERIFY_OTP: { max: 10, windowMs: 60_000 },        // 10 per minute
  SUBMIT_PROPOSAL: { max: 2, windowMs: 60_000 },    // 2 per minute
};

function checkRateLimit(ip: string, action: string): { allowed: boolean; retryAfter?: number } {
  const limit = RATE_LIMITS[action] || { max: 10, windowMs: 60_000 };
  const key = `${ip}:${action}`;
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + limit.windowMs });
    return { allowed: true };
  }

  if (record.count >= limit.max) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true };
}

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const clientIp = getClientIp(req);
    const action = body.action;

    // Rate limiting
    const rateLimit = checkRateLimit(clientIp, action);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } }
      );
    }

    let rawUrl =
      process.env.NEXT_PUBLIC_APPS_SCRIPT_URL ||
      process.env.PROPOSAL_WEBHOOK_URL ||
      process.env.APPS_SCRIPT_WEBHOOK_URL;

    if (!rawUrl) {
      return NextResponse.json(
        { success: false, error: "Backend API endpoint is not configured in environment variables." },
        { status: 500 }
      );
    }

    // Convert workspace URL (with /a/macros/domain/) to public Web App URL format (/macros/) if present
    const publicUrl = rawUrl.replace(/\/a\/macros\/[^\/]+\//, "/macros/");

    // Only try canonical action names - Google Apps Script only handles these three
    const validActions = ["VERIFY_EMAIL", "VERIFY_OTP", "SUBMIT_PROPOSAL"] as const;
    type ValidAction = typeof validActions[number];
    const primaryAction = validActions.includes(action as ValidAction) ? (action as ValidAction) : null;

    if (!primaryAction) {
      return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    }

    const targetUrls = [publicUrl];
    if (rawUrl !== publicUrl) {
      targetUrls.push(rawUrl);
    }

    let isHtmlResponse = false;
    let lastError = "Server request failed";
    let lastData: Record<string, unknown> | null = null;

    // Single request with canonical action name - no alias loops
    const payload: Record<string, unknown> = {
      ...body,
      action: primaryAction,
    };

    // Map OTP parameter aliases if applicable
    if (body.otp || body.code) {
      const otpValue = body.otp || body.code;
      payload.otp = otpValue;
      payload.code = otpValue;
      payload.verificationCode = otpValue;
      payload.otpCode = otpValue;
    }

    for (const url of targetUrls) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          redirect: "follow",
          body: JSON.stringify(payload),
        });

        const text = await response.text();
        const trimmed = text.trim();

        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
          try {
            const data = JSON.parse(trimmed);
            const errorMsg = String(data.error || "");

            // Catch DriveApp authorization permission errors from Google Apps Script
            if (!data.success && (errorMsg.includes("DriveApp") || errorMsg.includes("ප්‍රවේශය") || errorMsg.includes("Access Not Granted"))) {
              console.error("Google Apps Script DriveApp permission error:", errorMsg);
              data.error = "Server configuration error. Please contact support.";
            }

            return NextResponse.json(data);
          } catch (e) {
            console.error("JSON parse error for URL:", url, e);
          }
        }

        if (trimmed.startsWith("<")) {
          isHtmlResponse = true;
          console.warn(`Apps Script URL (${url}) returned HTML instead of JSON. Check Web App permissions.`);
        }
      } catch (err: unknown) {
        lastError = err instanceof Error ? err.message : String(err);
      }
    }

    if (lastData) {
      return NextResponse.json(lastData);
    }

    if (isHtmlResponse) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Google Apps Script returned an authentication page instead of JSON. Please verify that your Apps Script Web App deployment is configured with 'Who has access: Anyone'.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: false, error: lastError }, { status: 500 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Proposal API Proxy Error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
