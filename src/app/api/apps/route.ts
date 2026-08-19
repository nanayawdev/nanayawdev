import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id::text, slug, name, tagline, description, icon_image, cover_image,
              category, play_store_url, app_store_url, website_url, featured, sort_order
       FROM apps
       WHERE published = TRUE
       ORDER BY sort_order ASC, created_at ASC`
    );
    return NextResponse.json({ apps: rows });
  } catch (err) {
    console.error("[apps GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
