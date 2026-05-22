import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id::text, slug, title, description, category, cover_image,
              client_name, client_url, tags, platforms, featured, year, created_at
       FROM projects
       WHERE published = TRUE
       ORDER BY created_at DESC`
    );
    return NextResponse.json({ projects: rows });
  } catch (err) {
    console.error("[projects GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
