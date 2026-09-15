import pool from "@/lib/db";
import { genTicketCode, genPin } from "./ticket";

export class AlreadyRegisteredError extends Error {}

export interface EventForTicket {
  title: string;
  price_currency: string;
}

export interface RegistrationRow {
  id: string;
  event_id: string;
  name: string | null;
  phone: string;
  email: string | null;
  ticket_code: string | null;
  pin: string | null;
  ticket_type: string;
  quantity: number;
  amount_paid: string;
  status: string;
  payment_status: string;
  payment_method: string | null;
  checked_in: boolean;
  checked_in_at: string | null;
}

/** Insert a confirmed/pending registration, retrying on a ticket_code collision (rare) without retrying a genuine duplicate-phone registration. Shared by the USSD flow and the web registration endpoint so both issue tickets the same way. */
export async function insertRegistration(params: {
  eventId: string; name: string | null; phone: string; email: string | null; quantity: number; ticketType: string;
  status: string; paymentStatus: string; amountPaid: number; source: "web" | "ussd"; paymentMethod: string | null; hubtelSessionId?: string;
}): Promise<RegistrationRow> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const ticketCode = genTicketCode();
    const pin = genPin();
    try {
      const { rows } = await pool.query(
        `INSERT INTO event_registrations
           (event_id, name, phone, email, quantity, ticket_type, ticket_code, pin, status, payment_status,
            amount_paid, source, payment_method, hubtel_session_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
         RETURNING id::text, event_id::text, name, phone, email, ticket_code, pin, ticket_type, quantity,
                   amount_paid, status, payment_status, payment_method, checked_in, checked_in_at`,
        [params.eventId, params.name, params.phone, params.email, params.quantity, params.ticketType, ticketCode, pin,
         params.status, params.paymentStatus, params.amountPaid, params.source, params.paymentMethod, params.hubtelSessionId ?? null]
      );
      return rows[0];
    } catch (err: unknown) {
      const constraint = (err as { constraint?: string })?.constraint;
      if (constraint === "uq_event_registrations_ticket_code") continue; // collision, retry with a new code
      if (constraint === "uq_event_registrations_event_phone_active") throw new AlreadyRegisteredError();
      throw err;
    }
  }
  throw new Error("Could not generate a unique ticket code");
}

export function ticketSmsText(
  event: EventForTicket,
  reg: { ticket_type: string; quantity: number; ticket_code: string | null; pin: string | null; payment_method?: string | null }
): string {
  const gatePay = reg.payment_method === "cash" ? `\nPay at the gate on arrival.` : "";
  return `You're registered for ${event.title}!\nTicket: ${reg.ticket_type} x${reg.quantity}\nCode: ${reg.ticket_code ?? "N/A"}\nPIN: ${reg.pin ?? "N/A"} (keep private — needed to transfer this ticket)${gatePay}\n- nanayaw.dev`;
}
