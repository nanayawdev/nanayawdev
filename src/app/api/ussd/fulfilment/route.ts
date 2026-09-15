import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { sendSms } from "@/lib/hubtel";
import { ticketSmsText } from "@/lib/ussd/registration";
import type { ProgrammableServiceFulfilmentRequest } from "@/lib/ussd/hubtel-types";

/**
 * Service Fulfilment URL — register this with Hubtel against your USSD
 * short code as: https://<your-domain>/api/ussd/fulfilment?key=<HUBTEL_USSD_WEBHOOK_SECRET>
 *
 * Hubtel calls this after a customer completes (or fails) the mobile money
 * checkout that a paid event registration triggers — see the "Release" +
 * cart Item response in src/lib/ussd/flow.ts. The `registration_id` we put
 * in that cart Item's ServiceData comes back here in ExtraData, which is
 * how we find the pending row to update.
 *
 * The exact JSON Hubtel expects back from this endpoint isn't publicly
 * documented beyond "acknowledge the callback" — we return 200 with a
 * small ack object, which is the safe default for a webhook like this.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.HUBTEL_USSD_WEBHOOK_SECRET;
  if (secret && req.nextUrl.searchParams.get("key") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: ProgrammableServiceFulfilmentRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const { OrderId, SessionId, OrderInfo, ExtraData } = body;
    const registrationId = ExtraData?.registration_id;
    const eventId = ExtraData?.event_id;
    const successful = !!OrderInfo?.Payment?.IsSuccessful;
    const status = successful ? "confirmed" : "failed";
    const paymentStatus = successful ? "paid" : "failed";

    const returning = `id::text, event_id::text, name, phone, ticket_code, pin, ticket_type, quantity, payment_method`;
    let updated;
    if (registrationId) {
      ({ rows: [updated] } = await pool.query(
        `UPDATE event_registrations
         SET name = COALESCE($1, name), status = $2, payment_status = $3,
             amount_paid = $4, hubtel_order_id = $5, updated_at = NOW()
         WHERE id = $6
         RETURNING ${returning}`,
        [OrderInfo?.CustomerName ?? null, status, paymentStatus, OrderInfo?.Payment?.AmountPaid ?? 0, OrderId, registrationId]
      ));
    } else if (eventId && (OrderInfo?.CustomerMobileNumber || SessionId)) {
      // Fallback if ServiceData didn't round-trip: match by session id.
      ({ rows: [updated] } = await pool.query(
        `UPDATE event_registrations
         SET name = COALESCE($1, name), status = $2, payment_status = $3,
             amount_paid = $4, hubtel_order_id = $5, updated_at = NOW()
         WHERE event_id = $6 AND hubtel_session_id = $7
         RETURNING ${returning}`,
        [OrderInfo?.CustomerName ?? null, status, paymentStatus, OrderInfo?.Payment?.AmountPaid ?? 0, OrderId, eventId, SessionId]
      ));
    }

    if (!updated) {
      console.error("[ussd fulfilment] no matching registration", { OrderId, SessionId, ExtraData });
      return NextResponse.json({ success: false, error: "Registration not found" }, { status: 404 });
    }

    if (successful) {
      const { rows: [event] } = await pool.query(`SELECT title, price_currency FROM events WHERE id = $1`, [updated.event_id]);
      try {
        await sendSms(updated.phone, ticketSmsText(event ?? { title: "the event", price_currency: "GHS" }, updated));
      } catch (err) {
        console.error("[ussd fulfilment] SMS send failed", err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[ussd fulfilment]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
