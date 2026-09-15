import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

function slugify(text: string) {
  return text.toLowerCase().trim()
    .replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

interface TicketTypeInput { name: string; price: number; min_quantity?: number }
interface ScheduleItemInput { day_label: string; time_label: string; title: string }

async function replaceTicketTypes(eventId: string, ticketTypes: TicketTypeInput[] | undefined) {
  await pool.query(`DELETE FROM event_ticket_types WHERE event_id = $1`, [eventId]);
  if (!ticketTypes?.length) return;
  for (let i = 0; i < ticketTypes.length; i++) {
    const t = ticketTypes[i];
    if (!t.name) continue;
    await pool.query(
      `INSERT INTO event_ticket_types (event_id, name, price, min_quantity, sort_order) VALUES ($1,$2,$3,$4,$5)`,
      [eventId, t.name, t.price ?? 0, t.min_quantity ?? 1, i]
    );
  }
}

async function replaceSchedule(eventId: string, schedule: ScheduleItemInput[] | undefined) {
  await pool.query(`DELETE FROM event_schedule_items WHERE event_id = $1`, [eventId]);
  if (!schedule?.length) return;
  for (let i = 0; i < schedule.length; i++) {
    const s = schedule[i];
    if (!s.title) continue;
    await pool.query(
      `INSERT INTO event_schedule_items (event_id, day_label, time_label, title, sort_order) VALUES ($1,$2,$3,$4,$5)`,
      [eventId, s.day_label || "Day 1", s.time_label || "", s.title, i]
    );
  }
}

export async function GET(req: NextRequest) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { rows } = await pool.query(
      `SELECT e.id::text, e.slug, e.title, e.cover_image, e.starts_at, e.ends_at, e.venue, e.city,
              e.is_virtual, e.price_amount, e.price_currency, e.capacity, e.featured, e.published,
              e.is_ussd_active, e.created_at,
              (SELECT COUNT(*)::int FROM event_registrations r WHERE r.event_id = e.id AND r.status = 'confirmed') AS registrations
       FROM events e ORDER BY e.starts_at DESC`
    );
    return NextResponse.json({ events: rows });
  } catch (err) {
    console.error("[admin events GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const {
      title, description, cover_image, starts_at, ends_at, venue, city,
      is_virtual, virtual_link, price_amount, price_currency, capacity, featured, published,
      is_ussd_active, map_link, organizer_phone, organizer_whatsapp, organizer_email,
      toilet_info, first_aid_info, emergency_exit_info, ticket_types, schedule,
    } = await req.json();
    if (!title || !starts_at) return NextResponse.json({ error: "title and starts_at are required" }, { status: 400 });

    if (is_ussd_active) await pool.query(`UPDATE events SET is_ussd_active = FALSE WHERE is_ussd_active`);

    const slug = slugify(title);
    const { rows } = await pool.query(
      `INSERT INTO events (slug, title, description, cover_image, starts_at, ends_at, venue, city,
                            is_virtual, virtual_link, price_amount, price_currency, capacity, featured, published,
                            is_ussd_active, map_link, organizer_phone, organizer_whatsapp, organizer_email,
                            toilet_info, first_aid_info, emergency_exit_info)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
       RETURNING id::text, slug, title, published, created_at`,
      [slug, title, description ?? "", cover_image ?? null, starts_at, ends_at ?? null, venue ?? null,
       city ?? "Accra", is_virtual ?? false, virtual_link ?? null, price_amount ?? 0, price_currency ?? "GHS",
       capacity ?? null, featured ?? false, published ?? false, is_ussd_active ?? false, map_link ?? null,
       organizer_phone ?? null, organizer_whatsapp ?? null, organizer_email ?? null,
       toilet_info ?? null, first_aid_info ?? null, emergency_exit_info ?? null]
    );

    const event = rows[0];
    await replaceTicketTypes(event.id, ticket_types);
    await replaceSchedule(event.id, schedule);

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    if (msg.includes("unique")) return NextResponse.json({ error: "An event with this title already exists" }, { status: 409 });
    console.error("[admin events POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
