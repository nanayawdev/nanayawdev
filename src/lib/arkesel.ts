/**
 * Arkesel SMS — the active SMS provider. Hubtel SMS is archived for now
 * (see src/lib/_archive/hubtel.ts) but kept in case we switch back.
 *
 * Uses Arkesel's V1 GET-based "send-sms" endpoint:
 *   https://sms.arkesel.com/sms/api?action=send-sms&api_key=...&to=...&from=...&sms=...
 * Response is JSON — {"code":"ok", ...} on success, {"code":"<n>","message":"..."}
 * on failure (auth failure, insufficient balance, invalid sender/number, etc).
 */

const DEFAULT_BASE_URL = "https://sms.arkesel.com/sms/api";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

interface ArkeselResponse {
  code: string;
  message?: string;
  [key: string]: unknown;
}

/** Send an arbitrary SMS via Arkesel's SMS API. */
export async function sendSms(phone: string, message: string): Promise<void> {
  const baseUrl = process.env.ARKESEL_SMS_BASE_URL || DEFAULT_BASE_URL;
  const apiKey = requireEnv("ARKESEL_SMS_API_KEY");
  const senderId = requireEnv("ARKESEL_SMS_SENDER_ID");

  const url = new URL(baseUrl);
  url.searchParams.set("action", "send-sms");
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("to", phone);
  url.searchParams.set("from", senderId);
  url.searchParams.set("sms", message);

  const res = await fetch(url.toString(), { method: "GET", cache: "no-store" });
  const text = await res.text();

  if (!res.ok) throw new Error(`Arkesel SMS failed (HTTP ${res.status}): ${text}`);

  let parsed: ArkeselResponse | null = null;
  try { parsed = JSON.parse(text); } catch { /* not JSON — fall through to the raw-text log below */ }

  if (parsed) {
    if (String(parsed.code).toLowerCase() !== "ok") {
      throw new Error(`Arkesel SMS failed (code ${parsed.code}): ${parsed.message ?? text}`);
    }
    return;
  }

  // Some Arkesel accounts/plans return a bare string instead of JSON — log
  // it rather than silently assuming success, since we can't parse a code.
  console.log("[arkesel sendSms] non-JSON response, assuming delivered:", text);
}

/** Generate a 6-digit OTP string */
export function generateOtp(): string {
  return Math.floor(100_000 + Math.random() * 900_000).toString();
}

/** OTP expires in 10 minutes */
export function otpExpiresAt(): Date {
  return new Date(Date.now() + 10 * 60 * 1_000);
}

/** Send OTP via Arkesel SMS API */
export async function sendOtp(phone: string, otp: string): Promise<void> {
  await sendSms(phone, `Your nanayawdev chat code is ${otp}. Valid for 10 minutes.`);
}
