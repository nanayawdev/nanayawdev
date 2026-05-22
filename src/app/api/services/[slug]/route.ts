import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const { rows } = await pool.query(
      `SELECT id::text, slug, title, tagline, description, body, cover_image, tags, featured, sort_order
       FROM services
       WHERE slug=$1 AND published=TRUE`, [slug]
    );
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ service: rows[0] });
  } catch (err) {
    console.error("[services/slug GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
