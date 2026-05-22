import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id::text, slug, title, tagline, description, cover_image, tags, featured, sort_order
       FROM services
       WHERE published = TRUE
       ORDER BY sort_order ASC, created_at ASC`
    );
    return NextResponse.json({ services: rows });
  } catch (err) {
    console.error("[services GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
