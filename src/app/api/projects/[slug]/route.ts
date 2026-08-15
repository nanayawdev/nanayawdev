import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const { rows } = await pool.query(
      `SELECT id::text, slug, title, description, category, cover_image,
              client_name, client_url, tags, platforms, featured, year, created_at
       FROM projects
       WHERE slug=$1 AND published=TRUE`, [slug]
    );
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ project: rows[0] });
  } catch (err) {
    console.error("[projects/slug GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
