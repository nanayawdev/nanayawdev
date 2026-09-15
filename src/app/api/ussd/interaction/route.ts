import { NextRequest, NextResponse } from "next/server";
import { handleInteraction } from "@/lib/ussd/flow";
import { release } from "@/lib/ussd/response";
import type { ProgrammableServiceRequest } from "@/lib/ussd/hubtel-types";

/**
 * Service Interaction URL — register this with Hubtel against your USSD
 * short code as: https://<your-domain>/api/ussd/interaction?key=<HUBTEL_USSD_WEBHOOK_SECRET>
 *
 * Hubtel does not sign or authenticate these callbacks itself, so the `key`
 * query param (checked below against HUBTEL_USSD_WEBHOOK_SECRET) is our own
 * lightweight guard against anyone else finding and hitting this URL. It's
 * optional — if the env var isn't set, the check is skipped.
 *
 * Hubtel expects a response within ~5s, always as 200 JSON matching
 * ProgrammableServiceResponse — never a 4xx/5xx for a normal interaction,
 * or the caller sees a raw gateway error instead of a friendly message.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.HUBTEL_USSD_WEBHOOK_SECRET;
  if (secret && req.nextUrl.searchParams.get("key") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: ProgrammableServiceRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(release("Sorry, something went wrong. Please try again."));
  }

  try {
    const response = await handleInteraction(body);
    return NextResponse.json(response);
  } catch (err) {
    console.error("[ussd interaction]", err);
    return NextResponse.json(release("Sorry, something went wrong. Please try again."));
  }
}
