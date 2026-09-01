import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getAdminFromRequest } from "@/lib/auth";

/** POST /api/admin/email, send a reply email from the dashboard */
export async function POST(req: NextRequest) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY is not configured" }, { status: 500 });
  }

  try {
    const { to, subject, message } = await req.json();

    if (!to || !subject || !message) {
      return NextResponse.json({ error: "to, subject and message are required" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const fromAddress = process.env.RESEND_FROM ?? "nanayawdev <hello@nanayaw.dev>";

    const { error } = await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      text: message,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <p style="font-size:14px;color:#111;white-space:pre-wrap;line-height:1.7">${message.replace(/\n/g, "<br/>")}</p>
        <hr style="margin:32px 0;border:none;border-top:1px solid #eee"/>
        <p style="font-size:11px;color:#999">nanayawdev · <a href="https://nanayaw.dev" style="color:#999">nanayaw.dev</a></p>
      </div>`,
    });

    if (error) {
      console.error("[admin email POST] Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin email POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
