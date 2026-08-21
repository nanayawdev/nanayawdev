import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { sendOtp } from "@/lib/hubtel";

/** POST /api/admin/sms, send an arbitrary SMS to a phone number */
export async function POST(req: NextRequest) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { phone, message } = await req.json();

    if (!phone || !message) {
      return NextResponse.json({ error: "phone and message are required" }, { status: 400 });
    }

    await sendSms(phone, message);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin sms POST]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "SMS failed" }, { status: 500 });
  }
}

async function sendSms(phone: string, message: string) {
  function requireEnv(name: string) {
    const v = process.env[name];
    if (!v) throw new Error(`Missing env var: ${name}`);
    return v;
  }
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
  if (!res.ok) throw new Error(`Hubtel SMS failed: ${text}`);
}
