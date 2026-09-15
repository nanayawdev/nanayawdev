import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

/** POST /api/admin/email, send a reply email from the dashboard */
export async function POST(req: NextRequest) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { to, subject, message } = await req.json();
    if (!to || !subject || !message) {
      return NextResponse.json({ error: "to, subject and message are required" }, { status: 400 });
    }
    await sendEmail(to, subject, message);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin email POST]", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
