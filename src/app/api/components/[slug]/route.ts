import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/** GET /api/components/[slug], public: single published component resource */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { rows } = await pool.query(
      `SELECT id::text, slug, title, description, prompt, category, cover_image, files, featured, author, published_at, created_at
       FROM component_resources
       WHERE slug = $1 AND published = TRUE`,
      [slug]
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ component: rows[0] });
  } catch (err) {
    console.error("[components slug GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
