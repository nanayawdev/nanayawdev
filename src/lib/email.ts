import { Resend } from "resend";

/** Generic transactional email send via Resend, shared by admin replies and the USSD "resend ticket by email" flow. */
export async function sendEmail(to: string, subject: string, message: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM ?? "nanayawdev <hello@nanayaw.dev>";

  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    text: message,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
      <p style="font-size:14px;color:#111;white-space:pre-wrap;line-height:1.7">${message.replace(/\n/g, "<br/>")}</p>
      <hr style="margin:32px 0;border:none;border-top:1px solid #eee"/>
      <p style="font-size:11px;color:#999">nanayawdev · <a href="https://nanayaw.dev" style="color:#999">nanayaw.dev</a></p>
    </div>`,
  });

  if (error) throw new Error(error.message);
}
