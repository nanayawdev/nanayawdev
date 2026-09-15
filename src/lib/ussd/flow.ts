import pool from "@/lib/db";
import { sendSms } from "@/lib/hubtel";
import { sendEmail } from "@/lib/email";
import { menu, input, release, releaseWithCheckout } from "./response";
import { genPin, genReportNumber, priceLabel, shortDateTime } from "./ticket";
import { insertRegistration, ticketSmsText, AlreadyRegisteredError, type RegistrationRow } from "./registration";
import type { ProgrammableServiceRequest, ProgrammableServiceResponse } from "./hubtel-types";
import { normalizeType } from "./hubtel-types";

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

async function findRegistrationByPhoneOrCode(eventId: string, query: string): Promise<RegistrationRow | undefined> {
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

async function findActiveRegistrationByPhone(eventId: string, phone: string): Promise<RegistrationRow | undefined> {
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

async function renderMain(sessionId: string, mobile: string): Promise<ProgrammableServiceResponse> {
  const event = await getActiveEvent();
  if (!event) {
    await clearSession(sessionId);
    return release("No event is currently active on this line. Please check back later.");
  }
  await upsertSession(sessionId, mobile, "main", { eventId: event.id });
  return menu(`Welcome to ${event.title}\n1. Check Ticket\n2. Register for Ticket\n3. Event Information\n4. Grounds Management`, "main");
}

async function handleMain(req: ProgrammableServiceRequest, session: SessionRow): Promise<ProgrammableServiceResponse> {
  const { eventId } = session.data as { eventId: string };
  const choice = req.Message.trim();
  switch (choice) {
    case "1":
      await upsertSession(req.SessionId, req.Mobile, "check_ticket_menu", { eventId });
      return renderCheckTicketMenu();
    case "2":
      return renderTicketTypeList(req.SessionId, req.Mobile, eventId);
    case "3":
      await upsertSession(req.SessionId, req.Mobile, "info_menu", { eventId });
      return renderInfoMenu();
    case "4":
      await upsertSession(req.SessionId, req.Mobile, "grounds_menu", { eventId });
      return renderGroundsMenu();
    default:
      await clearSession(req.SessionId);
      return release("Invalid option. Please dial in again.");
  }
}

// ---------------------------------------------------------------------------
// 1. Check Ticket
// ---------------------------------------------------------------------------

function renderCheckTicketMenu(): ProgrammableServiceResponse {
  return menu("Check Ticket\n1. Check Ticket Status\n2. Verify Ticket\n3. Resend Ticket\n4. Transfer Ticket\n0. Main Menu", "check_ticket_menu");
}

async function handleCheckTicketMenu(req: ProgrammableServiceRequest, session: SessionRow): Promise<ProgrammableServiceResponse> {
  const { eventId } = session.data as { eventId: string };
  const choice = req.Message.trim();
  switch (choice) {
    case "0":
      return renderMain(req.SessionId, req.Mobile);
    case "1":
      await upsertSession(req.SessionId, req.Mobile, "check_status_input", { eventId });
      return input("Enter your phone number or ticket code:", "check_status_input", "query", "text");
    case "2":
      await upsertSession(req.SessionId, req.Mobile, "verify_ticket_input", { eventId });
      return input("Enter ticket code:", "verify_ticket_input", "code", "text");
    case "3":
      await upsertSession(req.SessionId, req.Mobile, "resend_choice", { eventId });
      return menu("Resend Ticket\n1. Send via SMS\n2. Send via Email\n0. Back", "resend_choice");
    case "4":
      await upsertSession(req.SessionId, req.Mobile, "transfer_phone_input", { eventId });
      return input("Enter recipient's phone number:", "transfer_phone_input", "phone", "text");
    default:
      return menu(`Invalid choice.\n${renderCheckTicketMenu().Message}`, "check_ticket_menu");
  }
}

async function handleCheckStatusInput(req: ProgrammableServiceRequest, session: SessionRow): Promise<ProgrammableServiceResponse> {
  const { eventId } = session.data as { eventId: string };
  const query = req.Message.trim();
  await clearSession(req.SessionId);
  if (!query) return release("Please enter a phone number or ticket code.");

  const reg = await findRegistrationByPhoneOrCode(eventId, query);
  if (!reg) return release("Not Found. No ticket matches that phone number or code.");

  const label = reg.checked_in ? "Used" : reg.status === "confirmed" ? "Valid" : reg.status === "pending" ? "Pending Payment" : "Cancelled";
  return release(`Ticket Status: ${label}\nType: ${reg.ticket_type}\nCode: ${reg.ticket_code ?? "N/A"}`);
}

async function handleVerifyTicketInput(req: ProgrammableServiceRequest, session: SessionRow): Promise<ProgrammableServiceResponse> {
  const { eventId } = session.data as { eventId: string };
  const code = req.Message.trim().toUpperCase();
  await clearSession(req.SessionId);

  const { rows } = await pool.query(
    `SELECT id::text, name, ticket_type, status, checked_in, checked_in_at FROM event_registrations WHERE event_id = $1 AND ticket_code = $2`,
    [eventId, code]
  );
  const reg = rows[0];
  if (!reg) return release("Invalid. Ticket code not found.");
  if (reg.status !== "confirmed") return release(`Invalid. This ticket is ${reg.status}.`);
  if (reg.checked_in) return release(`Already Used. Checked in at ${shortDateTime(reg.checked_in_at)}.\nType: ${reg.ticket_type}`);

  await pool.query(`UPDATE event_registrations SET checked_in = TRUE, checked_in_at = NOW() WHERE id = $1`, [reg.id]);
  return release(`Valid ✓ Admitted.\nType: ${reg.ticket_type}\nName: ${reg.name ?? "-"}`);
}

async function handleResendChoice(req: ProgrammableServiceRequest, session: SessionRow): Promise<ProgrammableServiceResponse> {
  const { eventId } = session.data as { eventId: string };
  const choice = req.Message.trim();
  if (choice === "0") {
    await upsertSession(req.SessionId, req.Mobile, "check_ticket_menu", { eventId });
    return renderCheckTicketMenu();
  }
  if (choice !== "1" && choice !== "2") {
    return menu("Invalid choice.\nResend Ticket\n1. Send via SMS\n2. Send via Email\n0. Back", "resend_choice");
  }

  const event = await getEvent(eventId);
  const reg = await findActiveRegistrationByPhone(eventId, req.Mobile);
  await clearSession(req.SessionId);
  if (!reg || !event) return release("No ticket found for this number.");
  if (!reg.ticket_code || !reg.pin) return release("Your ticket isn't ready yet — it may still be awaiting payment.");

  const text = ticketSmsText(event, reg);
  if (choice === "1") {
    try { await sendSms(req.Mobile, text); } catch (err) { console.error("[ussd resend sms]", err); return release("Sorry, we couldn't send the SMS. Please try again later."); }
    return release("Your ticket has been sent via SMS.");
  }
  if (!reg.email) return release("No email on file for this ticket. Try SMS instead.");
  try { await sendEmail(reg.email, `Your ticket for ${event.title}`, text); } catch (err) { console.error("[ussd resend email]", err); return release("Sorry, we couldn't send the email. Please try again later."); }
  return release("Your ticket has been sent via email.");
}

async function handleTransferPhoneInput(req: ProgrammableServiceRequest, session: SessionRow): Promise<ProgrammableServiceResponse> {
  const { eventId } = session.data as { eventId: string };
  const recipientPhone = req.Message.trim();
  if (recipientPhone.length < 9) return input("Please enter a valid phone number:", "transfer_phone_input", "phone", "text");

  await upsertSession(req.SessionId, req.Mobile, "transfer_pin_input", { eventId, recipientPhone });
  return input("Enter your 4-digit PIN to confirm transfer:", "transfer_pin_input", "pin", "number");
}

async function handleTransferPinInput(req: ProgrammableServiceRequest, session: SessionRow): Promise<ProgrammableServiceResponse> {
  const { eventId, recipientPhone } = session.data as { eventId: string; recipientPhone: string };
  const pin = req.Message.trim();
  await clearSession(req.SessionId);

  const reg = await findActiveRegistrationByPhone(eventId, req.Mobile);
  if (!reg) return release("No ticket found for this number.");
  if (!reg.pin || reg.pin !== pin) return release("Incorrect PIN. Transfer cancelled.");

  const recipientExisting = await findActiveRegistrationByPhone(eventId, recipientPhone);
  if (recipientExisting) return release("Transfer failed. Recipient already has a ticket for this event.");

  const event = await getEvent(eventId);
  const newPin = genPin();
  await pool.query(`UPDATE event_registrations SET phone = $1, pin = $2, updated_at = NOW() WHERE id = $3`, [recipientPhone, newPin, reg.id]);

  try {
    await sendSms(recipientPhone, `You've received a ticket for ${event?.title ?? "the event"} from ${req.Mobile}.\nCode: ${reg.ticket_code}\nYour new PIN: ${newPin}`);
  } catch (err) { console.error("[ussd transfer sms to recipient]", err); }
  try {
    await sendSms(req.Mobile, `Your ticket for ${event?.title ?? "the event"} has been transferred to ${recipientPhone}.`);
  } catch (err) { console.error("[ussd transfer sms to sender]", err); }

  return release("Ticket transferred successfully.");
}

// ---------------------------------------------------------------------------
// 2. Register for Ticket
// ---------------------------------------------------------------------------

async function renderTicketTypeList(sessionId: string, mobile: string, eventId: string): Promise<ProgrammableServiceResponse> {
  const types = await getTicketTypes(eventId);
  if (types.length === 0) {
    await clearSession(sessionId);
    return release("Ticket registration isn't set up for this event yet. Please check back later.");
  }
  const event = await getEvent(eventId);
  const lines = types.map((t, i) => `${i + 1}. ${t.name} - ${priceLabel(t.price, event?.price_currency ?? "GHS")}`);
  lines.push("0. Main Menu");
  await upsertSession(sessionId, mobile, "register_ticket_type", { eventId, ticketTypeIds: types.map((t) => t.id) });
  return menu(`Select Ticket Type\n${lines.join("\n")}`, "register_ticket_type");
}

async function handleRegisterTicketType(req: ProgrammableServiceRequest, session: SessionRow): Promise<ProgrammableServiceResponse> {
  const { eventId, ticketTypeIds } = session.data as { eventId: string; ticketTypeIds: string[] };
  const choice = req.Message.trim();
  if (choice === "0") return renderMain(req.SessionId, req.Mobile);

  const idx = Number(choice) - 1;
  const ticketTypeId = Number.isInteger(idx) ? ticketTypeIds[idx] : undefined;
  if (!ticketTypeId) return renderTicketTypeList(req.SessionId, req.Mobile, eventId);

  const { rows } = await pool.query(`SELECT min_quantity FROM event_ticket_types WHERE id = $1`, [ticketTypeId]);
  const minQuantity: number = rows[0]?.min_quantity ?? 1;

  if (minQuantity > 1) {
    await upsertSession(req.SessionId, req.Mobile, "register_quantity", { eventId, ticketTypeId, minQuantity });
    return input(`Enter number of tickets (min ${minQuantity}):`, "register_quantity", "quantity", "number");
  }
  await upsertSession(req.SessionId, req.Mobile, "register_name", { eventId, ticketTypeId, quantity: 1 });
  return input("Enter your full name:", "register_name", "name", "text");
}

async function handleRegisterQuantity(req: ProgrammableServiceRequest, session: SessionRow): Promise<ProgrammableServiceResponse> {
  const { eventId, ticketTypeId, minQuantity } = session.data as { eventId: string; ticketTypeId: string; minQuantity: number };
  const qty = Number(req.Message.trim());
  if (!Number.isInteger(qty) || qty < minQuantity) {
    return input(`Please enter a valid number (min ${minQuantity}):`, "register_quantity", "quantity", "number");
  }
  await upsertSession(req.SessionId, req.Mobile, "register_name", { eventId, ticketTypeId, quantity: qty });
  return input("Enter your full name:", "register_name", "name", "text");
}

async function handleRegisterName(req: ProgrammableServiceRequest, session: SessionRow): Promise<ProgrammableServiceResponse> {
  const name = req.Message.trim();
  if (!name) return input("Please enter your full name:", "register_name", "name", "text");
  await upsertSession(req.SessionId, req.Mobile, "register_phone", { ...session.data, name });
  return input("Enter contact phone number (0 to use this number):", "register_phone", "phone", "text");
}

async function handleRegisterPhone(req: ProgrammableServiceRequest, session: SessionRow): Promise<ProgrammableServiceResponse> {
  const val = req.Message.trim();
  const phone = val === "0" ? req.Mobile : val;
  await upsertSession(req.SessionId, req.Mobile, "register_email", { ...session.data, phone });
  return input("Enter email (0 to skip):", "register_email", "email", "text");
}

async function handleRegisterEmail(req: ProgrammableServiceRequest, session: SessionRow): Promise<ProgrammableServiceResponse> {
  const val = req.Message.trim();
  const email = val === "0" || !val ? null : val;
  await upsertSession(req.SessionId, req.Mobile, "register_payment_method", { ...session.data, email });
  return menu("Payment Method\n1. Mobile Money\n2. Card\n3. Cash at Gate", "register_payment_method");
}

async function handleRegisterPaymentMethod(req: ProgrammableServiceRequest, session: SessionRow): Promise<ProgrammableServiceResponse> {
  const choice = req.Message.trim();
  const methods: Record<string, string> = { "1": "mobile_money", "2": "card", "3": "cash" };
  const paymentMethod = methods[choice];
  if (!paymentMethod) return menu("Invalid choice.\nPayment Method\n1. Mobile Money\n2. Card\n3. Cash at Gate", "register_payment_method");

  const data = { ...session.data, paymentMethod } as { eventId: string; ticketTypeId: string; quantity: number; paymentMethod: string };
  await upsertSession(req.SessionId, req.Mobile, "register_confirm", data);

  const [event, ticketTypeRows] = await Promise.all([
    getEvent(data.eventId),
    pool.query(`SELECT name, price FROM event_ticket_types WHERE id = $1`, [data.ticketTypeId]),
  ]);
  const ticketType = ticketTypeRows.rows[0];
  const total = Number(ticketType.price) * data.quantity;
  const paymentLabel = paymentMethod === "mobile_money" ? "Mobile Money" : paymentMethod === "card" ? "Card" : "Cash at Gate";

  return menu(
    `Confirm Registration\n${ticketType.name} x${data.quantity}\nTotal: ${priceLabel(total, event?.price_currency ?? "GHS")}\nPayment: ${paymentLabel}\n1. Confirm\n2. Cancel`,
    "register_confirm"
  );
}

async function handleRegisterConfirm(req: ProgrammableServiceRequest, session: SessionRow): Promise<ProgrammableServiceResponse> {
  const choice = req.Message.trim();
  const data = session.data as { eventId: string; ticketTypeId: string; quantity: number; name: string; phone: string; email: string | null; paymentMethod: string };

  if (choice === "2") { await clearSession(req.SessionId); return release("Registration cancelled."); }
  if (choice !== "1") {
    return menu("Invalid choice.\n1. Confirm\n2. Cancel", "register_confirm");
  }

  if (data.paymentMethod === "card") {
    await clearSession(req.SessionId);
    return release("Card payments aren't available via USSD yet. Please choose Mobile Money or Cash at Gate.");
  }

  const [event, ticketTypeRows] = await Promise.all([
    getEvent(data.eventId),
    pool.query(`SELECT name, price FROM event_ticket_types WHERE id = $1`, [data.ticketTypeId]),
  ]);
  const ticketType = ticketTypeRows.rows[0];
  if (!event || !ticketType) { await clearSession(req.SessionId); return release("Sorry, that event is no longer available."); }
  const total = Number(ticketType.price) * data.quantity;

  try {
    if (data.paymentMethod === "mobile_money" && total > 0) {
      const reg = await insertRegistration({
        eventId: data.eventId, name: data.name, phone: data.phone, email: data.email, quantity: data.quantity,
        ticketType: ticketType.name, status: "pending", paymentStatus: "unpaid", amountPaid: 0,
        source: "ussd", paymentMethod: "mobile_money", hubtelSessionId: req.SessionId,
      });
      await clearSession(req.SessionId);
      return releaseWithCheckout(`Pay ${priceLabel(total, event.price_currency)} to complete your ${ticketType.name} ticket for ${event.title}.`, {
        ItemName: `${event.title} - ${ticketType.name}`,
        Qty: data.quantity,
        Price: total,
        ItemId: data.eventId,
        ServiceData: { event_id: data.eventId, registration_id: reg.id },
      });
    }

    const reg = await insertRegistration({
      eventId: data.eventId, name: data.name, phone: data.phone, email: data.email, quantity: data.quantity,
      ticketType: ticketType.name, status: "confirmed",
      paymentStatus: data.paymentMethod === "cash" ? "unpaid" : "paid",
      amountPaid: data.paymentMethod === "cash" ? 0 : total,
      source: "ussd", paymentMethod: data.paymentMethod,
    });
    await clearSession(req.SessionId);
    try {
      await sendSms(data.phone, ticketSmsText(event, reg));
    } catch (err) { console.error("[ussd register confirm] SMS send failed", err); }
    return release(`Registered! Ticket code: ${reg.ticket_code}. We've texted the details to ${data.phone}.`);
  } catch (err) {
    await clearSession(req.SessionId);
    if (err instanceof AlreadyRegisteredError) return release("You already have a ticket for this event.");
    console.error("[ussd register confirm]", err);
    return release("Sorry, something went wrong registering you. Please try again.");
  }
}

// ---------------------------------------------------------------------------
// 3. Event Information
// ---------------------------------------------------------------------------

function renderInfoMenu(): ProgrammableServiceResponse {
  return menu("Event Information\n1. Date & Venue\n2. Schedule/Lineup\n3. Directions/Map Link\n4. Contact Organizers\n0. Main Menu", "info_menu");
}

async function handleInfoMenu(req: ProgrammableServiceRequest, session: SessionRow): Promise<ProgrammableServiceResponse> {
  const { eventId } = session.data as { eventId: string };
  const choice = req.Message.trim();

  if (choice === "0") return renderMain(req.SessionId, req.Mobile);

  if (choice === "2") {
    const { rows } = await pool.query(
      `SELECT DISTINCT day_label, MIN(sort_order) AS min_sort FROM event_schedule_items WHERE event_id = $1 GROUP BY day_label ORDER BY min_sort ASC`,
      [eventId]
    );
    if (rows.length === 0) { await clearSession(req.SessionId); return release("Schedule not available yet."); }
    const days: string[] = rows.map((r: { day_label: string }) => r.day_label);
    const lines = days.map((d, i) => `${i + 1}. ${d}`);
    lines.push("0. Back");
    await upsertSession(req.SessionId, req.Mobile, "schedule_day_select", { eventId, days });
    return menu(`Schedule\n${lines.join("\n")}`, "schedule_day_select");
  }

  const event = await getEvent(eventId);
  if (!event) { await clearSession(req.SessionId); return release("Sorry, that event is no longer available."); }

  if (choice === "1") {
    await clearSession(req.SessionId);
    return release(`${event.title}\n${shortDateTime(event.starts_at)}\n${location(event)}`);
  }
  if (choice === "3") {
    await clearSession(req.SessionId);
    if (!event.map_link) return release("Map link not available yet.");
    try { await sendSms(req.Mobile, `Directions to ${event.title}: ${event.map_link}`); } catch (err) { console.error("[ussd map sms]", err); return release("Sorry, we couldn't send the SMS. Please try again later."); }
    return release("We've sent the map link via SMS.");
  }
  if (choice === "4") {
    await clearSession(req.SessionId);
    return release(`Contact Organizers\nPhone: ${event.organizer_phone ?? "N/A"}\nWhatsApp: ${event.organizer_whatsapp ?? "N/A"}\nEmail: ${event.organizer_email ?? "N/A"}`);
  }
  return menu(`Invalid choice.\n${renderInfoMenu().Message}`, "info_menu");
}

async function handleScheduleDaySelect(req: ProgrammableServiceRequest, session: SessionRow): Promise<ProgrammableServiceResponse> {
  const { eventId, days } = session.data as { eventId: string; days: string[] };
  const choice = req.Message.trim();
  if (choice === "0") {
    await upsertSession(req.SessionId, req.Mobile, "info_menu", { eventId });
    return renderInfoMenu();
  }
  const idx = Number(choice) - 1;
  const day = days[idx];
  if (!day) return menu("Invalid choice. Please try again.", "schedule_day_select");

  await clearSession(req.SessionId);
  const { rows } = await pool.query(
    `SELECT time_label, title FROM event_schedule_items WHERE event_id = $1 AND day_label = $2 ORDER BY sort_order ASC`,
    [eventId, day]
  );
  const lines = rows.map((r: { time_label: string; title: string }) => `${r.time_label} - ${r.title}`);
  return release(`${day}\n${lines.join("\n") || "No items scheduled."}`);
}

// ---------------------------------------------------------------------------
// 4. Grounds Management
// ---------------------------------------------------------------------------

function renderGroundsMenu(): ProgrammableServiceResponse {
  return menu("Grounds Management\n1. Report an Issue\n2. Request Assistance\n3. Facility Info\n4. Lost & Found\n0. Main Menu", "grounds_menu");
}

async function handleGroundsMenu(req: ProgrammableServiceRequest, session: SessionRow): Promise<ProgrammableServiceResponse> {
  const { eventId } = session.data as { eventId: string };
  const choice = req.Message.trim();
  switch (choice) {
    case "0":
      return renderMain(req.SessionId, req.Mobile);
    case "1":
      await upsertSession(req.SessionId, req.Mobile, "report_issue_category", { eventId });
      return menu("Report an Issue\n1. Security\n2. Sanitation\n3. Sound/Technical\n4. Other\n0. Back", "report_issue_category");
    case "2":
      await upsertSession(req.SessionId, req.Mobile, "assistance_category", { eventId });
      return menu("Request Assistance\n1. Medical\n2. Security\n3. Crowd Control\n0. Back", "assistance_category");
    case "3":
      await upsertSession(req.SessionId, req.Mobile, "facility_info_select", { eventId });
      return menu("Facility Info\n1. Nearest Toilet\n2. Nearest First Aid\n3. Emergency Exits\n0. Back", "facility_info_select");
    case "4":
      await upsertSession(req.SessionId, req.Mobile, "lost_found_choice", { eventId });
      return menu("Lost & Found\n1. Report Lost Item\n2. Report Found Item\n0. Back", "lost_found_choice");
    default:
      return menu(`Invalid choice.\n${renderGroundsMenu().Message}`, "grounds_menu");
  }
}

async function backToGrounds(sessionId: string, mobile: string, eventId: string): Promise<ProgrammableServiceResponse> {
  await upsertSession(sessionId, mobile, "grounds_menu", { eventId });
  return renderGroundsMenu();
}

async function handleReportIssueCategory(req: ProgrammableServiceRequest, session: SessionRow): Promise<ProgrammableServiceResponse> {
  const { eventId } = session.data as { eventId: string };
  const choice = req.Message.trim();
  if (choice === "0") return backToGrounds(req.SessionId, req.Mobile, eventId);
  const categories: Record<string, string> = { "1": "Security", "2": "Sanitation", "3": "Sound/Technical", "4": "Other" };
  const category = categories[choice];
  if (!category) return menu("Invalid choice.\nReport an Issue\n1. Security\n2. Sanitation\n3. Sound/Technical\n4. Other\n0. Back", "report_issue_category");

  await upsertSession(req.SessionId, req.Mobile, "report_issue_description", { eventId, category });
  return input("Briefly describe the issue:", "report_issue_description", "description", "text");
}

async function handleReportIssueDescription(req: ProgrammableServiceRequest, session: SessionRow): Promise<ProgrammableServiceResponse> {
  const { eventId, category } = session.data as { eventId: string; category: string };
  const description = req.Message.trim() || "(no description)";
  const ticketNumber = genReportNumber("R");
  await pool.query(
    `INSERT INTO event_ground_reports (event_id, kind, category, description, phone, ticket_number) VALUES ($1,'issue',$2,$3,$4,$5)`,
    [eventId, category, description, req.Mobile, ticketNumber]
  );
  await clearSession(req.SessionId);
  return release(`Thank you. Your report has been logged.\nReference: ${ticketNumber}\nOur grounds team will follow up.`);
}

async function handleAssistanceCategory(req: ProgrammableServiceRequest, session: SessionRow): Promise<ProgrammableServiceResponse> {
  const { eventId } = session.data as { eventId: string };
  const choice = req.Message.trim();
  if (choice === "0") return backToGrounds(req.SessionId, req.Mobile, eventId);
  const categories: Record<string, string> = { "1": "Medical", "2": "Security", "3": "Crowd Control" };
  const category = categories[choice];
  if (!category) return menu("Invalid choice.\nRequest Assistance\n1. Medical\n2. Security\n3. Crowd Control\n0. Back", "assistance_category");

  const ticketNumber = genReportNumber("R");
  await pool.query(
    `INSERT INTO event_ground_reports (event_id, kind, category, description, phone, ticket_number) VALUES ($1,'assistance',$2,'',$3,$4)`,
    [eventId, category, req.Mobile, ticketNumber]
  );
  await clearSession(req.SessionId);
  return release(`Help is on the way.\nCategory: ${category}\nEstimated response: 10-15 minutes.\nReference: ${ticketNumber}`);
}

async function handleFacilityInfoSelect(req: ProgrammableServiceRequest, session: SessionRow): Promise<ProgrammableServiceResponse> {
  const { eventId } = session.data as { eventId: string };
  const choice = req.Message.trim();
  if (choice === "0") return backToGrounds(req.SessionId, req.Mobile, eventId);

  const event = await getEvent(eventId);
  await clearSession(req.SessionId);
  if (!event) return release("Sorry, that event is no longer available.");

  const fallback = "Information not available yet — please ask a member of staff.";
  if (choice === "1") return release(`Nearest Toilet\n${event.toilet_info ?? fallback}`);
  if (choice === "2") return release(`Nearest First Aid\n${event.first_aid_info ?? fallback}`);
  if (choice === "3") return release(`Emergency Exits\n${event.emergency_exit_info ?? fallback}`);
  return menu("Invalid choice.\nFacility Info\n1. Nearest Toilet\n2. Nearest First Aid\n3. Emergency Exits\n0. Back", "facility_info_select");
}

async function handleLostFoundChoice(req: ProgrammableServiceRequest, session: SessionRow): Promise<ProgrammableServiceResponse> {
  const { eventId } = session.data as { eventId: string };
  const choice = req.Message.trim();
  if (choice === "0") return backToGrounds(req.SessionId, req.Mobile, eventId);
  if (choice === "1") {
    await upsertSession(req.SessionId, req.Mobile, "lost_found_description", { eventId, kind: "lost" });
    return input("Describe the lost item:", "lost_found_description", "description", "text");
  }
  if (choice === "2") {
    await upsertSession(req.SessionId, req.Mobile, "lost_found_description", { eventId, kind: "found" });
    return input("Describe the found item:", "lost_found_description", "description", "text");
  }
  return menu("Invalid choice.\nLost & Found\n1. Report Lost Item\n2. Report Found Item\n0. Back", "lost_found_choice");
}

async function handleLostFoundDescription(req: ProgrammableServiceRequest, session: SessionRow): Promise<ProgrammableServiceResponse> {
  const { eventId, kind } = session.data as { eventId: string; kind: "lost" | "found" };
  const description = req.Message.trim() || "(no description)";
  await pool.query(
    `INSERT INTO event_lost_found (event_id, kind, description, phone) VALUES ($1,$2,$3,$4)`,
    [eventId, kind, description, req.Mobile]
  );
  await clearSession(req.SessionId);
  return release(`Thank you. Your ${kind} item report has been logged. Our team will contact you if there's a match.`);
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

/** Entry point for the Service Interaction URL — one Hubtel USSD callback in, one JSON response out. */
export async function handleInteraction(req: ProgrammableServiceRequest): Promise<ProgrammableServiceResponse> {
  const type = normalizeType(req.Type);

  if (type === "timeout") return release(""); // per Hubtel docs: response is discarded, ignore safely
  if (type === "release") { await clearSession(req.SessionId); return release(""); }
  if (type === "initiation" || type === "favorite") return renderMain(req.SessionId, req.Mobile);

  const session = await loadSession(req.SessionId);
  if (!session) return renderMain(req.SessionId, req.Mobile); // expired/lost session — restart cleanly

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
