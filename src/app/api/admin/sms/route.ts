import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { sendSms } from "@/lib/arkesel";

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
