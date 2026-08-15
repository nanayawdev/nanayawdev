import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getAdminFromRequest } from "@/lib/auth";

const resend = new Resend(process.env.RESEND_API_KEY!);

/** POST /api/admin/email — send a reply email from the dashboard */
export async function POST(req: NextRequest) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { to, subject, message } = await req.json();

    if (!to || !subject || !message) {
      return NextResponse.json({ error: "to, subject and message are required" }, { status: 400 });
    }

    const fromAddress = process.env.RESEND_FROM ?? "nanayawdev <hello@nanayawdev.com>";

    const { error } = await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      text: message,
      html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <p style="font-size:14px;color:#111;white-space:pre-wrap;line-height:1.7">${message.replace(/\n/g, "<br/>")}</p>
        <hr style="margin:32px 0;border:none;border-top:1px solid #eee"/>
        <p style="font-size:11px;color:#999">nanayawdev · <a href="https://nanayawdev.com" style="color:#999">nanayawdev.com</a></p>
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
