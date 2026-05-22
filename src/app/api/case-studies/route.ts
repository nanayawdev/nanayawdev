import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id::text, slug, client, category, year, tagline, cover_image,
              services, stats, result_headline, featured, created_at
       FROM case_studies
       WHERE published = TRUE
       ORDER BY created_at DESC`
    );
    return NextResponse.json({ case_studies: rows });
  } catch (err) {
    console.error("[case-studies GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
