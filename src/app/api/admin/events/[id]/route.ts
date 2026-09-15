import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

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

export async function GET(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const [eventRes, ticketTypesRes, scheduleRes] = await Promise.all([
    pool.query(
      `SELECT id::text, slug, title, description, cover_image, starts_at, ends_at, venue, city,
              is_virtual, virtual_link, price_amount, price_currency, capacity, featured, published,
              is_ussd_active, map_link, organizer_phone, organizer_whatsapp, organizer_email,
              toilet_info, first_aid_info, emergency_exit_info, created_at, updated_at
       FROM events WHERE id = $1`, [id]
    ),
    pool.query(`SELECT id::text, name, price, min_quantity FROM event_ticket_types WHERE event_id = $1 ORDER BY sort_order ASC`, [id]),
    pool.query(`SELECT id::text, day_label, time_label, title FROM event_schedule_items WHERE event_id = $1 ORDER BY sort_order ASC`, [id]),
  ]);
  if (!eventRes.rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ event: { ...eventRes.rows[0], ticket_types: ticketTypesRes.rows, schedule: scheduleRes.rows } });
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const {
    title, description, cover_image, starts_at, ends_at, venue, city,
    is_virtual, virtual_link, price_amount, price_currency, capacity, featured, published,
    is_ussd_active, map_link, organizer_phone, organizer_whatsapp, organizer_email,
    toilet_info, first_aid_info, emergency_exit_info, ticket_types, schedule,
  } = await req.json();

  if (is_ussd_active) await pool.query(`UPDATE events SET is_ussd_active = FALSE WHERE is_ussd_active AND id <> $1`, [id]);

  const { rows } = await pool.query(
    `UPDATE events SET
       title=$1, description=$2, cover_image=$3, starts_at=$4, ends_at=$5, venue=$6, city=$7,
       is_virtual=$8, virtual_link=$9, price_amount=$10, price_currency=$11, capacity=$12,
       featured=$13, published=$14, is_ussd_active=$15, map_link=$16, organizer_phone=$17,
       organizer_whatsapp=$18, organizer_email=$19, toilet_info=$20, first_aid_info=$21,
       emergency_exit_info=$22, updated_at=NOW()
     WHERE id=$23
     RETURNING id::text, slug, title, published, updated_at`,
    [title, description ?? "", cover_image ?? null, starts_at, ends_at ?? null, venue ?? null, city ?? "Accra",
     is_virtual ?? false, virtual_link ?? null, price_amount ?? 0, price_currency ?? "GHS", capacity ?? null,
     featured ?? false, published ?? false, is_ussd_active ?? false, map_link ?? null, organizer_phone ?? null,
     organizer_whatsapp ?? null, organizer_email ?? null, toilet_info ?? null, first_aid_info ?? null,
     emergency_exit_info ?? null, id]
  );
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await replaceTicketTypes(id, ticket_types);
  await replaceSchedule(id, schedule);

  return NextResponse.json({ success: true, event: rows[0] });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();

  if (body.is_ussd_active) await pool.query(`UPDATE events SET is_ussd_active = FALSE WHERE is_ussd_active AND id <> $1`, [id]);

  const fields = Object.entries(body).map(([k], i) => `${k}=$${i + 1}`).join(", ");
  const values = [...Object.values(body), id];
  const { rows } = await pool.query(
    `UPDATE events SET ${fields}, updated_at=NOW() WHERE id=$${values.length} RETURNING id::text, published, is_ussd_active`,
    values
  );
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, event: rows[0] });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await pool.query(`DELETE FROM events WHERE id=$1`, [id]);
  return NextResponse.json({ success: true });
}
