import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifySendrPlusSignature } from "@/lib/ussd/webhook-verify";
import type { FulfillmentPayload } from "@/lib/ussd/sendrplus-types";

/**
 * Fulfillment URL (optional) — registered the same way as the Interaction
 * URL (POST /v1/ussd/applications/:id/configure's `fulfillment_url`).
 * SendrPlus calls this once, asynchronously, after a session has already
 * ended via the Interaction URL's `continue_session: false`. All real
 * ticket/payment side effects already happened synchronously inside the
 * Interaction handler (see flow.ts) — nothing here needs to *act* on
 * anything. What it does need to do is correlate the callback to a real
 * row rather than blindly acknowledging every payload:
 *
 * We look up the event_registrations row created in that same USSD
 * session (event_registrations.hubtel_session_id = body.session_id — set
 * at registration time in flow.ts's handleRegisterConfirm). If none is
 * found — either because the session never registered a ticket (just
 * checked a status, browsed info, etc.) or because this is SendrPlus's
 * synthetic test-endpoints ping (session_id "test-<uuid>", phone
 * "+000000000000", data {"test":"true"}) — we correctly 404 rather than
 * report success for nothing.
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
    if (!body.session_id) throw new Error("missing session_id");
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { rows } = await pool.query(
    `SELECT id::text, ticket_code, ticket_type FROM event_registrations WHERE hubtel_session_id = $1 LIMIT 1`,
    [body.session_id]
  );
  const registration = rows[0];

  if (!registration) {
    console.log("[ussd fulfilment] no registration for this session — nothing to correlate", { session_id: body.session_id, phone_number: body.phone_number });
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  console.log("[ussd fulfilment] matched registration", { session_id: body.session_id, registration_id: registration.id, ticket_code: registration.ticket_code });
  return NextResponse.json({ success: true, registration_id: registration.id });
}
