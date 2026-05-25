/**
 * Hubtel SMS — send OTP.
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

/** Send OTP via Hubtel SMS API */
export async function sendOtp(phone: string, otp: string): Promise<void> {
  const baseUrl      = requireEnv("HUBTEL_SMS_BASE_URL");
  const clientId     = requireEnv("HUBTEL_SMS_CLIENT_ID");
  const clientSecret = requireEnv("HUBTEL_SMS_CLIENT_SECRET");
  const senderId     = requireEnv("HUBTEL_SMS_SENDER_ID");

  const message = `Your Codebase Technologies chat code is ${otp}. Valid for 10 minutes.`;

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
