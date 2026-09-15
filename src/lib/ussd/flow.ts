import pool from "@/lib/db";
import { sendSms } from "@/lib/hubtel";
import { sendEmail } from "@/lib/email";
import { continueSession, endSession } from "./response";
import { genPin, genReportNumber, priceLabel, shortDateTime } from "./ticket";
import { insertRegistration, ticketSmsText, AlreadyRegisteredError } from "./registration";
import type { InteractionRequest, InteractionResponse } from "./sendrplus-types";

interface EventRow {
  id: string;
  title: string;
  description: string;
  starts_at: string;
  venue: string | null;
  city: string;
  is_virtual: boolean;
  virtual_link: string | null;
  map_link: string | null;
  organizer_phone: string | null;
  organizer_whatsapp: string | null;
  organizer_email: string | null;
  toilet_info: string | null;
  first_aid_info: string | null;
  emergency_exit_info: string | null;
  price_currency: string;
}

interface TicketTypeRow {
  id: string;
  name: string;
  price: string;
  min_quantity: number;
}

interface SessionRow {
  session_id: string;
  mobile: string;
  step: string;
  data: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Session persistence
// ---------------------------------------------------------------------------

async function upsertSession(sessionId: string, mobile: string, step: string, data: Record<string, unknown>) {
  await pool.query(
    `INSERT INTO ussd_sessions (session_id, mobile, step, data, updated_at)
     VALUES ($1, $2, $3, $4, NOW())
     ON CONFLICT (session_id) DO UPDATE SET step = $3, data = $4, updated_at = NOW()`,
    [sessionId, mobile, step, JSON.stringify(data)]
  );
}

async function loadSession(sessionId: string): Promise<SessionRow | null> {
  const { rows } = await pool.query(`SELECT session_id, mobile, step, data FROM ussd_sessions WHERE session_id = $1`, [sessionId]);
  return rows[0] ?? null;
}

async function clearSession(sessionId: string) {
  await pool.query(`DELETE FROM ussd_sessions WHERE session_id = $1`, [sessionId]);
}

// ---------------------------------------------------------------------------
// Shared lookups
// ---------------------------------------------------------------------------

async function getActiveEvent(): Promise<EventRow | null> {
  const { rows } = await pool.query(
    `SELECT id::text, title, description, starts_at, venue, city, is_virtual, virtual_link, map_link,
            organizer_phone, organizer_whatsapp, organizer_email, toilet_info, first_aid_info, emergency_exit_info,
            price_currency
     FROM events WHERE published = TRUE AND is_ussd_active = TRUE LIMIT 1`
  );
  return rows[0] ?? null;
}

async function getEvent(eventId: string): Promise<EventRow | null> {
  const { rows } = await pool.query(
    `SELECT id::text, title, description, starts_at, venue, city, is_virtual, virtual_link, map_link,
            organizer_phone, organizer_whatsapp, organizer_email, toilet_info, first_aid_info, emergency_exit_info,
            price_currency
     FROM events WHERE id = $1`, [eventId]
  );
  return rows[0] ?? null;
}

async function getTicketTypes(eventId: string): Promise<TicketTypeRow[]> {
  const { rows } = await pool.query(
    `SELECT id::text, name, price, min_quantity FROM event_ticket_types WHERE event_id = $1 ORDER BY sort_order ASC`,
    [eventId]
  );
  return rows;
}

async function findRegistrationByPhoneOrCode(eventId: string, query: string) {
  const { rows } = await pool.query(
    `SELECT id::text, event_id::text, name, phone, email, ticket_code, pin, ticket_type, quantity, amount_paid,
            status, payment_status, payment_method, checked_in, checked_in_at
     FROM event_registrations
     WHERE event_id = $1 AND (phone = $2 OR ticket_code = $3)
     ORDER BY created_at DESC LIMIT 1`,
    [eventId, query, query.toUpperCase()]
  );
  return rows[0];
}

async function findActiveRegistrationByPhone(eventId: string, phone: string) {
  const { rows } = await pool.query(
    `SELECT id::text, event_id::text, name, phone, email, ticket_code, pin, ticket_type, quantity, amount_paid,
            status, payment_status, payment_method, checked_in, checked_in_at
     FROM event_registrations WHERE event_id = $1 AND phone = $2 AND status <> 'cancelled'
     ORDER BY created_at DESC LIMIT 1`,
    [eventId, phone]
  );
  return rows[0];
}

function location(event: EventRow): string {
  return event.is_virtual ? "Online" : [event.venue, event.city].filter(Boolean).join(", ") || "Venue TBA";
}

// ---------------------------------------------------------------------------
// Main menu
// ---------------------------------------------------------------------------

async function renderMain(sessionId: string, mobile: string): Promise<InteractionResponse> {
  const event = await getActiveEvent();
  if (!event) {
    await clearSession(sessionId);
    return endSession("No event is currently active on this line. Please check back later.");
  }
  await upsertSession(sessionId, mobile, "main", { eventId: event.id });
  return continueSession(`Welcome to ${event.title}\n1. Check Ticket\n2. Register for Ticket\n3. Event Information\n4. Grounds Management`);
}

async function handleMain(req: InteractionRequest, session: SessionRow): Promise<InteractionResponse> {
  const { eventId } = session.data as { eventId: string };
  const choice = req.input.trim();
  switch (choice) {
    case "1":
      await upsertSession(req.session_id, req.phone_number, "check_ticket_menu", { eventId });
      return renderCheckTicketMenu();
    case "2":
      return renderTicketTypeList(req.session_id, req.phone_number, eventId);
    case "3":
      await upsertSession(req.session_id, req.phone_number, "info_menu", { eventId });
      return renderInfoMenu();
    case "4":
      await upsertSession(req.session_id, req.phone_number, "grounds_menu", { eventId });
      return renderGroundsMenu();
    default:
      await clearSession(req.session_id);
      return endSession("Invalid option. Please dial in again.");
  }
}

// ---------------------------------------------------------------------------
// 1. Check Ticket
// ---------------------------------------------------------------------------

function renderCheckTicketMenu(): InteractionResponse {
  return continueSession("Check Ticket\n1. Check Ticket Status\n2. Verify Ticket\n3. Resend Ticket\n4. Transfer Ticket\n0. Main Menu");
}

async function handleCheckTicketMenu(req: InteractionRequest, session: SessionRow): Promise<InteractionResponse> {
  const { eventId } = session.data as { eventId: string };
  const choice = req.input.trim();
  switch (choice) {
    case "0":
      return renderMain(req.session_id, req.phone_number);
    case "1":
      await upsertSession(req.session_id, req.phone_number, "check_status_input", { eventId });
      return continueSession("Enter your phone number or ticket code:");
    case "2":
      await upsertSession(req.session_id, req.phone_number, "verify_ticket_input", { eventId });
      return continueSession("Enter ticket code:");
    case "3":
      await upsertSession(req.session_id, req.phone_number, "resend_choice", { eventId });
      return continueSession("Resend Ticket\n1. Send via SMS\n2. Send via Email\n0. Back");
    case "4":
      await upsertSession(req.session_id, req.phone_number, "transfer_phone_input", { eventId });
      return continueSession("Enter recipient's phone number:");
    default:
      return continueSession(`Invalid choice.\n${renderCheckTicketMenu().message}`);
  }
}

async function handleCheckStatusInput(req: InteractionRequest, session: SessionRow): Promise<InteractionResponse> {
  const { eventId } = session.data as { eventId: string };
  const query = req.input.trim();
  await clearSession(req.session_id);
  if (!query) return endSession("Please enter a phone number or ticket code.");

  const reg = await findRegistrationByPhoneOrCode(eventId, query);
  if (!reg) return endSession("Not Found. No ticket matches that phone number or code.");

  const label = reg.checked_in ? "Used" : reg.status === "confirmed" ? "Valid" : reg.status === "pending" ? "Pending Payment" : "Cancelled";
  return endSession(`Ticket Status: ${label}\nType: ${reg.ticket_type}\nCode: ${reg.ticket_code ?? "N/A"}`);
}

async function handleVerifyTicketInput(req: InteractionRequest, session: SessionRow): Promise<InteractionResponse> {
  const { eventId } = session.data as { eventId: string };
  const code = req.input.trim().toUpperCase();
  await clearSession(req.session_id);

  const { rows } = await pool.query(
    `SELECT id::text, name, ticket_type, status, checked_in, checked_in_at FROM event_registrations WHERE event_id = $1 AND ticket_code = $2`,
    [eventId, code]
  );
  const reg = rows[0];
  if (!reg) return endSession("Invalid. Ticket code not found.");
  if (reg.status !== "confirmed") return endSession(`Invalid. This ticket is ${reg.status}.`);
  if (reg.checked_in) return endSession(`Already Used. Checked in at ${shortDateTime(reg.checked_in_at)}.\nType: ${reg.ticket_type}`);

  await pool.query(`UPDATE event_registrations SET checked_in = TRUE, checked_in_at = NOW() WHERE id = $1`, [reg.id]);
  return endSession(`Valid ✓ Admitted.\nType: ${reg.ticket_type}\nName: ${reg.name ?? "-"}`);
}

async function handleResendChoice(req: InteractionRequest, session: SessionRow): Promise<InteractionResponse> {
  const { eventId } = session.data as { eventId: string };
  const choice = req.input.trim();
  if (choice === "0") {
    await upsertSession(req.session_id, req.phone_number, "check_ticket_menu", { eventId });
    return renderCheckTicketMenu();
  }
  if (choice !== "1" && choice !== "2") {
    return continueSession("Invalid choice.\nResend Ticket\n1. Send via SMS\n2. Send via Email\n0. Back");
  }

  const event = await getEvent(eventId);
  const reg = await findActiveRegistrationByPhone(eventId, req.phone_number);
  await clearSession(req.session_id);
  if (!reg || !event) return endSession("No ticket found for this number.");
  if (!reg.ticket_code || !reg.pin) return endSession("Your ticket isn't ready yet — it may still be awaiting payment.");

  const text = ticketSmsText(event, reg);
  if (choice === "1") {
    try { await sendSms(req.phone_number, text); } catch (err) { console.error("[ussd resend sms]", err); return endSession("Sorry, we couldn't send the SMS. Please try again later."); }
    return endSession("Your ticket has been sent via SMS.");
  }
  if (!reg.email) return endSession("No email on file for this ticket. Try SMS instead.");
  try { await sendEmail(reg.email, `Your ticket for ${event.title}`, text); } catch (err) { console.error("[ussd resend email]", err); return endSession("Sorry, we couldn't send the email. Please try again later."); }
  return endSession("Your ticket has been sent via email.");
}

async function handleTransferPhoneInput(req: InteractionRequest, session: SessionRow): Promise<InteractionResponse> {
  const { eventId } = session.data as { eventId: string };
  const recipientPhone = req.input.trim();
  if (recipientPhone.length < 9) return continueSession("Please enter a valid phone number:");

  await upsertSession(req.session_id, req.phone_number, "transfer_pin_input", { eventId, recipientPhone });
  return continueSession("Enter your 4-digit PIN to confirm transfer:");
}

async function handleTransferPinInput(req: InteractionRequest, session: SessionRow): Promise<InteractionResponse> {
  const { eventId, recipientPhone } = session.data as { eventId: string; recipientPhone: string };
  const pin = req.input.trim();
  await clearSession(req.session_id);

  const reg = await findActiveRegistrationByPhone(eventId, req.phone_number);
  if (!reg) return endSession("No ticket found for this number.");
  if (!reg.pin || reg.pin !== pin) return endSession("Incorrect PIN. Transfer cancelled.");

  const recipientExisting = await findActiveRegistrationByPhone(eventId, recipientPhone);
  if (recipientExisting) return endSession("Transfer failed. Recipient already has a ticket for this event.");

  const event = await getEvent(eventId);
  const newPin = genPin();
  await pool.query(`UPDATE event_registrations SET phone = $1, pin = $2, updated_at = NOW() WHERE id = $3`, [recipientPhone, newPin, reg.id]);

  try {
    await sendSms(recipientPhone, `You've received a ticket for ${event?.title ?? "the event"} from ${req.phone_number}.\nCode: ${reg.ticket_code}\nYour new PIN: ${newPin}`);
  } catch (err) { console.error("[ussd transfer sms to recipient]", err); }
  try {
    await sendSms(req.phone_number, `Your ticket for ${event?.title ?? "the event"} has been transferred to ${recipientPhone}.`);
  } catch (err) { console.error("[ussd transfer sms to sender]", err); }

  return endSession("Ticket transferred successfully.");
}

// ---------------------------------------------------------------------------
// 2. Register for Ticket
//
// SendrPlus does no payment collection on the USSD leg at all (no cart,
// no OrderInfo, no fulfilment-based payment confirmation like Hubtel) —
// a vendor is expected to handle payment entirely on its own. Cash at
// Gate is fully real (no payment gateway needed). Mobile Money and Card
// are listed to match the requested flow but decline honestly instead
// of faking a charge — wire up a real payment provider before enabling
// either for real.
// ---------------------------------------------------------------------------

async function renderTicketTypeList(sessionId: string, mobile: string, eventId: string): Promise<InteractionResponse> {
  const types = await getTicketTypes(eventId);
  if (types.length === 0) {
    await clearSession(sessionId);
    return endSession("Ticket registration isn't set up for this event yet. Please check back later.");
  }
  const event = await getEvent(eventId);
  const lines = types.map((t, i) => `${i + 1}. ${t.name} - ${priceLabel(t.price, event?.price_currency ?? "GHS")}`);
  lines.push("0. Main Menu");
  await upsertSession(sessionId, mobile, "register_ticket_type", { eventId, ticketTypeIds: types.map((t) => t.id) });
  return continueSession(`Select Ticket Type\n${lines.join("\n")}`);
}

async function handleRegisterTicketType(req: InteractionRequest, session: SessionRow): Promise<InteractionResponse> {
  const { eventId, ticketTypeIds } = session.data as { eventId: string; ticketTypeIds: string[] };
  const choice = req.input.trim();
  if (choice === "0") return renderMain(req.session_id, req.phone_number);

  const idx = Number(choice) - 1;
  const ticketTypeId = Number.isInteger(idx) ? ticketTypeIds[idx] : undefined;
  if (!ticketTypeId) return renderTicketTypeList(req.session_id, req.phone_number, eventId);

  const { rows } = await pool.query(`SELECT min_quantity FROM event_ticket_types WHERE id = $1`, [ticketTypeId]);
  const minQuantity: number = rows[0]?.min_quantity ?? 1;

  if (minQuantity > 1) {
    await upsertSession(req.session_id, req.phone_number, "register_quantity", { eventId, ticketTypeId, minQuantity });
    return continueSession(`Enter number of tickets (min ${minQuantity}):`);
  }
  await upsertSession(req.session_id, req.phone_number, "register_name", { eventId, ticketTypeId, quantity: 1 });
  return continueSession("Enter your full name:");
}

async function handleRegisterQuantity(req: InteractionRequest, session: SessionRow): Promise<InteractionResponse> {
  const { eventId, ticketTypeId, minQuantity } = session.data as { eventId: string; ticketTypeId: string; minQuantity: number };
  const qty = Number(req.input.trim());
  if (!Number.isInteger(qty) || qty < minQuantity) {
    return continueSession(`Please enter a valid number (min ${minQuantity}):`);
  }
  await upsertSession(req.session_id, req.phone_number, "register_name", { eventId, ticketTypeId, quantity: qty });
  return continueSession("Enter your full name:");
}

async function handleRegisterName(req: InteractionRequest, session: SessionRow): Promise<InteractionResponse> {
  const name = req.input.trim();
  if (!name) return continueSession("Please enter your full name:");
  await upsertSession(req.session_id, req.phone_number, "register_phone", { ...session.data, name });
  return continueSession("Enter contact phone number (0 to use this number):");
}

async function handleRegisterPhone(req: InteractionRequest, session: SessionRow): Promise<InteractionResponse> {
  const val = req.input.trim();
  const phone = val === "0" ? req.phone_number : val;
  await upsertSession(req.session_id, req.phone_number, "register_email", { ...session.data, phone });
  return continueSession("Enter email (0 to skip):");
}

async function handleRegisterEmail(req: InteractionRequest, session: SessionRow): Promise<InteractionResponse> {
  const val = req.input.trim();
  const email = val === "0" || !val ? null : val;
  await upsertSession(req.session_id, req.phone_number, "register_payment_method", { ...session.data, email });
  return continueSession("Payment Method\n1. Mobile Money\n2. Card\n3. Cash at Gate");
}

async function handleRegisterPaymentMethod(req: InteractionRequest, session: SessionRow): Promise<InteractionResponse> {
  const choice = req.input.trim();
  const methods: Record<string, string> = { "1": "mobile_money", "2": "card", "3": "cash" };
  const paymentMethod = methods[choice];
  if (!paymentMethod) return continueSession("Invalid choice.\nPayment Method\n1. Mobile Money\n2. Card\n3. Cash at Gate");

  const data = { ...session.data, paymentMethod } as { eventId: string; ticketTypeId: string; quantity: number; paymentMethod: string };
  await upsertSession(req.session_id, req.phone_number, "register_confirm", data);

  const [event, ticketTypeRows] = await Promise.all([
    getEvent(data.eventId),
    pool.query(`SELECT name, price FROM event_ticket_types WHERE id = $1`, [data.ticketTypeId]),
  ]);
  const ticketType = ticketTypeRows.rows[0];
  const total = Number(ticketType.price) * data.quantity;
  const paymentLabel = paymentMethod === "mobile_money" ? "Mobile Money" : paymentMethod === "card" ? "Card" : "Cash at Gate";

  return continueSession(
    `Confirm Registration\n${ticketType.name} x${data.quantity}\nTotal: ${priceLabel(total, event?.price_currency ?? "GHS")}\nPayment: ${paymentLabel}\n1. Confirm\n2. Cancel`
  );
}

async function handleRegisterConfirm(req: InteractionRequest, session: SessionRow): Promise<InteractionResponse> {
  const choice = req.input.trim();
  const data = session.data as { eventId: string; ticketTypeId: string; quantity: number; name: string; phone: string; email: string | null; paymentMethod: string };

  if (choice === "2") { await clearSession(req.session_id); return endSession("Registration cancelled."); }
  if (choice !== "1") {
    return continueSession("Invalid choice.\n1. Confirm\n2. Cancel");
  }

  if (data.paymentMethod === "mobile_money" || data.paymentMethod === "card") {
    await clearSession(req.session_id);
    const label = data.paymentMethod === "mobile_money" ? "Mobile Money" : "Card";
    return endSession(`${label} payments aren't available yet on this line. Please dial in again and choose Cash at Gate.`);
  }

  const [event, ticketTypeRows] = await Promise.all([
    getEvent(data.eventId),
    pool.query(`SELECT name, price FROM event_ticket_types WHERE id = $1`, [data.ticketTypeId]),
  ]);
  const ticketType = ticketTypeRows.rows[0];
  if (!event || !ticketType) { await clearSession(req.session_id); return endSession("Sorry, that event is no longer available."); }
  const total = Number(ticketType.price) * data.quantity;

  try {
    const reg = await insertRegistration({
      eventId: data.eventId, name: data.name, phone: data.phone, email: data.email, quantity: data.quantity,
      ticketType: ticketType.name, status: "confirmed",
      paymentStatus: "unpaid", // cash at gate — not yet collected
      amountPaid: 0,
      source: "ussd", paymentMethod: "cash",
      // Tags this ticket with the USSD session that created it, so the
      // Fulfillment webhook (which carries session_id but no order/ticket
      // reference of its own) can correlate a real completed session back
      // to a real row — see src/app/api/ussd/fulfilment/route.ts.
      hubtelSessionId: req.session_id,
    });
    await clearSession(req.session_id);
    try {
      await sendSms(data.phone, ticketSmsText(event, reg));
    } catch (err) { console.error("[ussd register confirm] SMS send failed", err); }
    const dueNote = total > 0 ? ` Pay ${priceLabel(total, event.price_currency)} at the gate.` : "";
    return endSession(`Registered! Ticket code: ${reg.ticket_code}.${dueNote} We've texted the details to ${data.phone}.`);
  } catch (err) {
    await clearSession(req.session_id);
    if (err instanceof AlreadyRegisteredError) return endSession("You already have a ticket for this event.");
    console.error("[ussd register confirm]", err);
    return endSession("Sorry, something went wrong registering you. Please try again.");
  }
}

// ---------------------------------------------------------------------------
// 3. Event Information
// ---------------------------------------------------------------------------

function renderInfoMenu(): InteractionResponse {
  return continueSession("Event Information\n1. Date & Venue\n2. Schedule/Lineup\n3. Directions/Map Link\n4. Contact Organizers\n0. Main Menu");
}

async function handleInfoMenu(req: InteractionRequest, session: SessionRow): Promise<InteractionResponse> {
  const { eventId } = session.data as { eventId: string };
  const choice = req.input.trim();

  if (choice === "0") return renderMain(req.session_id, req.phone_number);

  if (choice === "2") {
    const { rows } = await pool.query(
      `SELECT DISTINCT day_label, MIN(sort_order) AS min_sort FROM event_schedule_items WHERE event_id = $1 GROUP BY day_label ORDER BY min_sort ASC`,
      [eventId]
    );
    if (rows.length === 0) { await clearSession(req.session_id); return endSession("Schedule not available yet."); }
    const days: string[] = rows.map((r: { day_label: string }) => r.day_label);
    const lines = days.map((d, i) => `${i + 1}. ${d}`);
    lines.push("0. Back");
    await upsertSession(req.session_id, req.phone_number, "schedule_day_select", { eventId, days });
    return continueSession(`Schedule\n${lines.join("\n")}`);
  }

  const event = await getEvent(eventId);
  if (!event) { await clearSession(req.session_id); return endSession("Sorry, that event is no longer available."); }

  if (choice === "1") {
    await clearSession(req.session_id);
    return endSession(`${event.title}\n${shortDateTime(event.starts_at)}\n${location(event)}`);
  }
  if (choice === "3") {
    await clearSession(req.session_id);
    if (!event.map_link) return endSession("Map link not available yet.");
    try { await sendSms(req.phone_number, `Directions to ${event.title}: ${event.map_link}`); } catch (err) { console.error("[ussd map sms]", err); return endSession("Sorry, we couldn't send the SMS. Please try again later."); }
    return endSession("We've sent the map link via SMS.");
  }
  if (choice === "4") {
    await clearSession(req.session_id);
    return endSession(`Contact Organizers\nPhone: ${event.organizer_phone ?? "N/A"}\nWhatsApp: ${event.organizer_whatsapp ?? "N/A"}\nEmail: ${event.organizer_email ?? "N/A"}`);
  }
  return continueSession(`Invalid choice.\n${renderInfoMenu().message}`);
}

async function handleScheduleDaySelect(req: InteractionRequest, session: SessionRow): Promise<InteractionResponse> {
  const { eventId, days } = session.data as { eventId: string; days: string[] };
  const choice = req.input.trim();
  if (choice === "0") {
    await upsertSession(req.session_id, req.phone_number, "info_menu", { eventId });
    return renderInfoMenu();
  }
  const idx = Number(choice) - 1;
  const day = days[idx];
  if (!day) return continueSession("Invalid choice. Please try again.");

  await clearSession(req.session_id);
  const { rows } = await pool.query(
    `SELECT time_label, title FROM event_schedule_items WHERE event_id = $1 AND day_label = $2 ORDER BY sort_order ASC`,
    [eventId, day]
  );
  const lines = rows.map((r: { time_label: string; title: string }) => `${r.time_label} - ${r.title}`);
  return endSession(`${day}\n${lines.join("\n") || "No items scheduled."}`);
}

// ---------------------------------------------------------------------------
// 4. Grounds Management
// ---------------------------------------------------------------------------

function renderGroundsMenu(): InteractionResponse {
  return continueSession("Grounds Management\n1. Report an Issue\n2. Request Assistance\n3. Facility Info\n4. Lost & Found\n0. Main Menu");
}

async function handleGroundsMenu(req: InteractionRequest, session: SessionRow): Promise<InteractionResponse> {
  const { eventId } = session.data as { eventId: string };
  const choice = req.input.trim();
  switch (choice) {
    case "0":
      return renderMain(req.session_id, req.phone_number);
    case "1":
      await upsertSession(req.session_id, req.phone_number, "report_issue_category", { eventId });
      return continueSession("Report an Issue\n1. Security\n2. Sanitation\n3. Sound/Technical\n4. Other\n0. Back");
    case "2":
      await upsertSession(req.session_id, req.phone_number, "assistance_category", { eventId });
      return continueSession("Request Assistance\n1. Medical\n2. Security\n3. Crowd Control\n0. Back");
    case "3":
      await upsertSession(req.session_id, req.phone_number, "facility_info_select", { eventId });
      return continueSession("Facility Info\n1. Nearest Toilet\n2. Nearest First Aid\n3. Emergency Exits\n0. Back");
    case "4":
      await upsertSession(req.session_id, req.phone_number, "lost_found_choice", { eventId });
      return continueSession("Lost & Found\n1. Report Lost Item\n2. Report Found Item\n0. Back");
    default:
      return continueSession(`Invalid choice.\n${renderGroundsMenu().message}`);
  }
}

async function backToGrounds(sessionId: string, mobile: string, eventId: string): Promise<InteractionResponse> {
  await upsertSession(sessionId, mobile, "grounds_menu", { eventId });
  return renderGroundsMenu();
}

async function handleReportIssueCategory(req: InteractionRequest, session: SessionRow): Promise<InteractionResponse> {
  const { eventId } = session.data as { eventId: string };
  const choice = req.input.trim();
  if (choice === "0") return backToGrounds(req.session_id, req.phone_number, eventId);
  const categories: Record<string, string> = { "1": "Security", "2": "Sanitation", "3": "Sound/Technical", "4": "Other" };
  const category = categories[choice];
  if (!category) return continueSession("Invalid choice.\nReport an Issue\n1. Security\n2. Sanitation\n3. Sound/Technical\n4. Other\n0. Back");

  await upsertSession(req.session_id, req.phone_number, "report_issue_description", { eventId, category });
  return continueSession("Briefly describe the issue:");
}

async function handleReportIssueDescription(req: InteractionRequest, session: SessionRow): Promise<InteractionResponse> {
  const { eventId, category } = session.data as { eventId: string; category: string };
  const description = req.input.trim() || "(no description)";
  const ticketNumber = genReportNumber("R");
  await pool.query(
    `INSERT INTO event_ground_reports (event_id, kind, category, description, phone, ticket_number) VALUES ($1,'issue',$2,$3,$4,$5)`,
    [eventId, category, description, req.phone_number, ticketNumber]
  );
  await clearSession(req.session_id);
  return endSession(`Thank you. Your report has been logged.\nReference: ${ticketNumber}\nOur grounds team will follow up.`);
}

async function handleAssistanceCategory(req: InteractionRequest, session: SessionRow): Promise<InteractionResponse> {
  const { eventId } = session.data as { eventId: string };
  const choice = req.input.trim();
  if (choice === "0") return backToGrounds(req.session_id, req.phone_number, eventId);
  const categories: Record<string, string> = { "1": "Medical", "2": "Security", "3": "Crowd Control" };
  const category = categories[choice];
  if (!category) return continueSession("Invalid choice.\nRequest Assistance\n1. Medical\n2. Security\n3. Crowd Control\n0. Back");

  const ticketNumber = genReportNumber("R");
  await pool.query(
    `INSERT INTO event_ground_reports (event_id, kind, category, description, phone, ticket_number) VALUES ($1,'assistance',$2,'',$3,$4)`,
    [eventId, category, req.phone_number, ticketNumber]
  );
  await clearSession(req.session_id);
  return endSession(`Help is on the way.\nCategory: ${category}\nEstimated response: 10-15 minutes.\nReference: ${ticketNumber}`);
}

async function handleFacilityInfoSelect(req: InteractionRequest, session: SessionRow): Promise<InteractionResponse> {
  const { eventId } = session.data as { eventId: string };
  const choice = req.input.trim();
  if (choice === "0") return backToGrounds(req.session_id, req.phone_number, eventId);

  const event = await getEvent(eventId);
  await clearSession(req.session_id);
  if (!event) return endSession("Sorry, that event is no longer available.");

  const fallback = "Information not available yet — please ask a member of staff.";
  if (choice === "1") return endSession(`Nearest Toilet\n${event.toilet_info ?? fallback}`);
  if (choice === "2") return endSession(`Nearest First Aid\n${event.first_aid_info ?? fallback}`);
  if (choice === "3") return endSession(`Emergency Exits\n${event.emergency_exit_info ?? fallback}`);
  return continueSession("Invalid choice.\nFacility Info\n1. Nearest Toilet\n2. Nearest First Aid\n3. Emergency Exits\n0. Back");
}

async function handleLostFoundChoice(req: InteractionRequest, session: SessionRow): Promise<InteractionResponse> {
  const { eventId } = session.data as { eventId: string };
  const choice = req.input.trim();
  if (choice === "0") return backToGrounds(req.session_id, req.phone_number, eventId);
  if (choice === "1") {
    await upsertSession(req.session_id, req.phone_number, "lost_found_description", { eventId, kind: "lost" });
    return continueSession("Describe the lost item:");
  }
  if (choice === "2") {
    await upsertSession(req.session_id, req.phone_number, "lost_found_description", { eventId, kind: "found" });
    return continueSession("Describe the found item:");
  }
  return continueSession("Invalid choice.\nLost & Found\n1. Report Lost Item\n2. Report Found Item\n0. Back");
}

async function handleLostFoundDescription(req: InteractionRequest, session: SessionRow): Promise<InteractionResponse> {
  const { eventId, kind } = session.data as { eventId: string; kind: "lost" | "found" };
  const description = req.input.trim() || "(no description)";
  await pool.query(
    `INSERT INTO event_lost_found (event_id, kind, description, phone) VALUES ($1,$2,$3,$4)`,
    [eventId, kind, description, req.phone_number]
  );
  await clearSession(req.session_id);
  return endSession(`Thank you. Your ${kind} item report has been logged. Our team will contact you if there's a match.`);
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

/**
 * Entry point for the Interaction URL — one SendrPlus turn in, one JSON
 * response out. SendrPlus is the sole source of truth for "is this a new
 * session" (new_session) — unlike Hubtel, it never separately notifies us
 * of a release/timeout, so there's no signal to clean up an abandoned
 * session early; ussd_sessions.updated_at exists for a periodic sweep if
 * that turns out to matter in practice.
 */
export async function handleInteraction(req: InteractionRequest): Promise<InteractionResponse> {
  if (req.new_session) return renderMain(req.session_id, req.phone_number);

  const session = await loadSession(req.session_id);
  if (!session) return renderMain(req.session_id, req.phone_number); // lost/expired session — restart cleanly

  switch (session.step) {
    case "check_ticket_menu": return handleCheckTicketMenu(req, session);
    case "check_status_input": return handleCheckStatusInput(req, session);
    case "verify_ticket_input": return handleVerifyTicketInput(req, session);
    case "resend_choice": return handleResendChoice(req, session);
    case "transfer_phone_input": return handleTransferPhoneInput(req, session);
    case "transfer_pin_input": return handleTransferPinInput(req, session);

    case "register_ticket_type": return handleRegisterTicketType(req, session);
    case "register_quantity": return handleRegisterQuantity(req, session);
    case "register_name": return handleRegisterName(req, session);
    case "register_phone": return handleRegisterPhone(req, session);
    case "register_email": return handleRegisterEmail(req, session);
    case "register_payment_method": return handleRegisterPaymentMethod(req, session);
    case "register_confirm": return handleRegisterConfirm(req, session);

    case "info_menu": return handleInfoMenu(req, session);
    case "schedule_day_select": return handleScheduleDaySelect(req, session);

    case "grounds_menu": return handleGroundsMenu(req, session);
    case "report_issue_category": return handleReportIssueCategory(req, session);
    case "report_issue_description": return handleReportIssueDescription(req, session);
    case "assistance_category": return handleAssistanceCategory(req, session);
    case "facility_info_select": return handleFacilityInfoSelect(req, session);
    case "lost_found_choice": return handleLostFoundChoice(req, session);
    case "lost_found_description": return handleLostFoundDescription(req, session);

    default: return handleMain(req, session);
  }
}
