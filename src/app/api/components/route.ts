import { NextResponse } from "next/server";
import pool from "@/lib/db";

/** GET /api/components — public: list published component resources */
export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id::text, slug, title, description, category, cover_image, files, featured, author, published_at, created_at
       FROM component_resources
       WHERE published = TRUE
       ORDER BY COALESCE(published_at, created_at) DESC`
    );
    return NextResponse.json({ components: rows });
  } catch (err) {
    console.error("[components GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
