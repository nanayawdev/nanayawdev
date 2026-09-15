import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { sendSms } from "@/lib/arkesel";
import { insertRegistration, ticketSmsText, AlreadyRegisteredError } from "@/lib/ussd/registration";

type Params = { params: Promise<{ slug: string }> };

/**
 * Web registration form submission (the browser equivalent of the free/cash
 * USSD "Register" flow in src/lib/ussd/flow.ts) — issues the same kind of
 * ticket (code + PIN), so a web-registered attendee can still use the
 * USSD "Check/Verify/Resend/Transfer Ticket" menu at the venue.
 *
 * There's no web mobile money checkout yet — Hubtel's checkout API for
 * paid tickets is wired up for the USSD channel only (see flow.ts). A paid
 * ticket bought here is accepted as "confirmed, pay at the gate" (cash),
 * same as choosing "Cash at Gate" on USSD.
 */
export async function POST(req: NextRequest, { params }: Params) {
  const { slug } = await params;
  try {
    const { name, phone, email, ticket_type_id, quantity } = await req.json();
    if (!name || !phone) {
      return NextResponse.json({ error: "name and phone are required" }, { status: 400 });
    }

    const { rows: eventRows } = await pool.query(
      `SELECT id::text, title, price_amount, price_currency, capacity FROM events WHERE slug = $1 AND published = TRUE`,
      [slug]
    );
    const event = eventRows[0];
    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    let ticketTypeName = "Regular";
    let unitPrice = Number(event.price_amount);
    let minQuantity = 1;
    if (ticket_type_id) {
      const { rows: typeRows } = await pool.query(
        `SELECT name, price, min_quantity FROM event_ticket_types WHERE id = $1 AND event_id = $2`, [ticket_type_id, event.id]
      );
      if (!typeRows[0]) return NextResponse.json({ error: "Invalid ticket type" }, { status: 400 });
      ticketTypeName = typeRows[0].name;
      unitPrice = Number(typeRows[0].price);
      minQuantity = typeRows[0].min_quantity;
    }
    const qty = Math.max(Number(quantity) || 1, minQuantity);

    if (event.capacity != null) {
      const { rows: countRows } = await pool.query(
        `SELECT COUNT(*)::int AS n FROM event_registrations WHERE event_id = $1 AND status = 'confirmed'`,
        [event.id]
      );
      if (countRows[0].n >= event.capacity) {
        return NextResponse.json({ error: "This event is fully booked" }, { status: 409 });
      }
    }

    const total = unitPrice * qty;
    const reg = await insertRegistration({
      eventId: event.id, name, phone, email: email ?? null, quantity: qty, ticketType: ticketTypeName,
      status: "confirmed", paymentStatus: total > 0 ? "unpaid" : "paid", amountPaid: 0,
      source: "web", paymentMethod: total > 0 ? "cash" : null,
    });

    try {
      await sendSms(phone, ticketSmsText(event, reg));
    } catch (err) {
      console.error("[events register] SMS send failed", err);
    }

    return NextResponse.json({ success: true, registration: { id: reg.id, status: reg.status, ticket_code: reg.ticket_code } }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof AlreadyRegisteredError) {
      return NextResponse.json({ error: "You're already registered for this event" }, { status: 409 });
    }
    console.error("[events register POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
