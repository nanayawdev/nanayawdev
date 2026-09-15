/**
 * ARCHIVED — Hubtel SMS integration, not currently wired up anywhere.
 * Replaced by src/lib/arkesel.ts (2026-09-15). Kept here, unimported, in
 * case we switch back — nothing in the app currently imports this file.
 * If reviving it: restore HUBTEL_SMS_* in .env.example/.env.local and
 * point the callers that now import "@/lib/arkesel" back at
 * "@/lib/_archive/hubtel" (or move this file back to src/lib/hubtel.ts).
 */

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

/** Generate a 6-digit OTP string */
export function generateOtp(): string {
  return Math.floor(100_000 + Math.random() * 900_000).toString();
}

/** OTP expires in 10 minutes */
export function otpExpiresAt(): Date {
  return new Date(Date.now() + 10 * 60 * 1_000);
}

/** Send an arbitrary SMS via Hubtel's SMS API. */
export async function sendSms(phone: string, message: string): Promise<void> {
  const baseUrl      = requireEnv("HUBTEL_SMS_BASE_URL");
  const clientId     = requireEnv("HUBTEL_SMS_CLIENT_ID");
  const clientSecret = requireEnv("HUBTEL_SMS_CLIENT_SECRET");
  const senderId     = requireEnv("HUBTEL_SMS_SENDER_ID");

  const res = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: JSON.stringify({ From: senderId, To: phone, Content: message }),
    cache: "no-store",
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Hubtel SMS failed: ${text}`);
  }
}

/** Send OTP via Hubtel SMS API */
export async function sendOtp(phone: string, otp: string): Promise<void> {
  await sendSms(phone, `Your nanayawdev chat code is ${otp}. Valid for 10 minutes.`);
}
