import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** GET /api/admin/blog — all posts (including drafts) */
export async function GET(req: NextRequest) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { rows } = await pool.query(
    `SELECT id::text, slug, title, excerpt, category, cover_image, featured, published, author, published_at, created_at, updated_at
     FROM blog_posts
     ORDER BY created_at DESC`
  );
  return NextResponse.json({ posts: rows });
}

/** POST /api/admin/blog — create post */
export async function POST(req: NextRequest) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { title, excerpt, body, category, cover_image, featured, published, author } = await req.json();

    if (!title || !excerpt || !body) {
      return NextResponse.json({ error: "title, excerpt and body are required" }, { status: 400 });
    }

    const slug = slugify(title);
    const published_at = published ? new Date() : null;

    const { rows } = await pool.query(
      `INSERT INTO blog_posts (slug, title, excerpt, body, category, cover_image, featured, published, author, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id::text, slug, title, published, created_at`,
      [slug, title, excerpt, body, category ?? "General", cover_image ?? null,
       featured ?? false, published ?? false, author ?? "Devs & Creatives", published_at]
    );
    return NextResponse.json({ success: true, post: rows[0] }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    if (msg.includes("unique")) {
      return NextResponse.json({ error: "A post with this title already exists" }, { status: 409 });
    }
    console.error("[admin blog POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
