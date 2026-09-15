import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  try {
    const { rows } = await pool.query(
      `SELECT id::text, slug, title, description, cover_image, starts_at, ends_at, venue, city,
              is_virtual, virtual_link, price_amount, price_currency, capacity
       FROM events WHERE slug = $1 AND published = TRUE`, [slug]
    );
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const event = rows[0];
    const [countRes, ticketTypesRes] = await Promise.all([
      event.capacity != null
        ? pool.query(`SELECT COUNT(*)::int AS n FROM event_registrations WHERE event_id = $1 AND status = 'confirmed'`, [event.id])
        : Promise.resolve({ rows: [{ n: 0 }] }),
      pool.query(`SELECT id::text, name, price, min_quantity FROM event_ticket_types WHERE event_id = $1 ORDER BY sort_order ASC`, [event.id]),
    ]);
    const spotsLeft = event.capacity != null ? Math.max(0, event.capacity - countRes.rows[0].n) : null;

    return NextResponse.json({ event: { ...event, spots_left: spotsLeft, ticket_types: ticketTypesRes.rows } });
  } catch (err) {
    console.error("[events/[slug] GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
