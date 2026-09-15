import { NextRequest, NextResponse } from "next/server";
import { handleInteraction } from "@/lib/ussd/flow";
import { endSession } from "@/lib/ussd/response";
import { verifySendrPlusSignature } from "@/lib/ussd/webhook-verify";
import type { InteractionRequest } from "@/lib/ussd/sendrplus-types";

/**
 * Interaction URL — this is what gets registered against a SendrPlus USSD
 * application (Configure dialog, or POST /v1/ussd/applications/:id/configure's
 * `interaction_url`). SendrPlus's backend calls this on every keypress of a
 * live session; there's no separate "release"/"timeout" notification from
 * SendrPlus — this endpoint is the sole authority on when a session ends
 * (via `continue_session: false`).
 *
 * SendrPlus enforces a ~4s timeout per call and treats an empty `message`
 * as an error — always resolve fast and never return an empty message.
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

  let body: InteractionRequest;
  try {
    body = JSON.parse(rawBody);
    if (!body.session_id) throw new Error("missing session_id");
  } catch {
    return NextResponse.json(endSession("Sorry, something went wrong. Please try again."));
  }

  try {
    const response = await handleInteraction(body);
    return NextResponse.json(response);
  } catch (err) {
    console.error("[ussd interaction]", err);
    return NextResponse.json(endSession("Sorry, something went wrong. Please try again."));
  }
}
