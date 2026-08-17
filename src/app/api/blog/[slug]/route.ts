import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/** GET /api/blog/[slug] — public: single published post */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { rows } = await pool.query(
      `SELECT id::text, slug, title, excerpt, body, category, tags, cover_image, featured, author, published_at, created_at
       FROM blog_posts
       WHERE slug = $1 AND published = TRUE`,
      [slug]
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ post: rows[0] });
  } catch (err) {
    console.error("[blog slug GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
