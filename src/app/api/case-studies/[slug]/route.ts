import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const { rows } = await pool.query(
      `SELECT id::text, slug, client, category, year, tagline, cover_image, client_url,
              services, stats, problem, approach, result, result_headline, result_body,
              featured, created_at
       FROM case_studies
       WHERE slug=$1 AND published=TRUE`, [slug]
    );
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ case_study: rows[0] });
  } catch (err) {
    console.error("[case-studies/slug GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
