import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const includePast = req.nextUrl.searchParams.get("all") === "1";
    const { rows } = await pool.query(
      `SELECT id::text, slug, title, description, cover_image, starts_at, ends_at, venue, city,
              is_virtual, virtual_link, price_amount, price_currency, capacity, featured
       FROM events
       WHERE published = TRUE ${includePast ? "" : "AND (ends_at IS NOT NULL AND ends_at >= NOW() OR ends_at IS NULL AND starts_at >= NOW())"}
       ORDER BY starts_at ASC`
    );
    return NextResponse.json({ events: rows });
  } catch (err) {
    console.error("[events GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
