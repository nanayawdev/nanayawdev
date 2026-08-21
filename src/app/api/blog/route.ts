import { NextResponse } from "next/server";
import pool from "@/lib/db";

/** GET /api/blog, public: list published posts */
export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id::text, slug, title, excerpt, category, tags, cover_image, featured, author, published_at, created_at
       FROM blog_posts
       WHERE published = TRUE
       ORDER BY COALESCE(published_at, created_at) DESC`
    );
    return NextResponse.json({ posts: rows });
  } catch (err) {
    console.error("[blog GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
