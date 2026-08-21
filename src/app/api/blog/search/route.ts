import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/** GET /api/blog/search?q=, public: search published posts by title, excerpt, body, or tag */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!q) return NextResponse.json({ posts: [] });

  try {
    const { rows } = await pool.query(
      `SELECT id::text, slug, title, excerpt, category, tags, cover_image, featured, author, published_at, created_at
       FROM blog_posts
       WHERE published = TRUE
         AND (title ILIKE $1 OR excerpt ILIKE $1 OR body ILIKE $1 OR $2 = ANY(tags))
       ORDER BY COALESCE(published_at, created_at) DESC
       LIMIT 20`,
      [`%${q}%`, q.toLowerCase()]
    );
    return NextResponse.json({ posts: rows });
  } catch (err) {
    console.error("[blog search GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
