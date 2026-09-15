import { NextRequest, NextResponse } from "next/server";
import { verifySendrPlusSignature } from "@/lib/ussd/webhook-verify";
import type { FulfillmentPayload } from "@/lib/ussd/sendrplus-types";

/**
 * Fulfillment URL (optional) — registered the same way as the Interaction
 * URL (POST /v1/ussd/applications/:id/configure's `fulfillment_url`).
 * SendrPlus calls this once, asynchronously, after a session has already
 * ended via the Interaction URL's `continue_session: false` — it carries
 * only the final message shown and an always-empty `data` object today
 * (confirmed against the current SendrPlus source; there is no per-field
 * answer capture or payment/order info here — SendrPlus never touches
 * payment). There's genuinely nothing actionable in this payload yet, so
 * this just verifies + logs for now; every ticket/payment side effect
 * already happened inside the Interaction handler (see flow.ts).
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  const secret = process.env.SENDRPLUS_USSD_SIGNING_SECRET;
  if (secret) {
    const signature = req.headers.get("x-sendrplus-signature");
    if (!verifySendrPlusSignature(secret, signature, rawBody)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let body: FulfillmentPayload;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  console.log("[ussd fulfilment]", { session_id: body.session_id, phone_number: body.phone_number, message: body.message, application: body.application });
  return NextResponse.json({ success: true });
}
