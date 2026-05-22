import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

/** GET /api/admin/blog/[id] — fetch single post (full body) */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { rows } = await pool.query(
    `SELECT id::text, slug, title, excerpt, body, category, cover_image, featured, published, author, published_at, created_at
     FROM blog_posts WHERE id = $1`,
    [id]
  );
  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ post: rows[0] });
}

/** PATCH /api/admin/blog/[id] — update post */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const { title, excerpt, body, category, cover_image, featured, published, author } = await req.json();

    const { rows: current } = await pool.query(
      `SELECT published FROM blog_posts WHERE id = $1`, [id]
    );
    if (current.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const wasPublished = current[0].published;
    const published_at = published && !wasPublished ? new Date() : undefined;

    const { rows } = await pool.query(
      `UPDATE blog_posts SET
         title        = COALESCE($1, title),
         excerpt      = COALESCE($2, excerpt),
         body         = COALESCE($3, body),
         category     = COALESCE($4, category),
         cover_image  = COALESCE($5, cover_image),
         featured     = COALESCE($6, featured),
         published    = COALESCE($7, published),
         author       = COALESCE($8, author),
         published_at = COALESCE($9, published_at),
         updated_at   = NOW()
       WHERE id = $10
       RETURNING id::text, slug, title, excerpt, body, category, cover_image, featured, published, author, published_at, updated_at`,
      [title, excerpt, body, category, cover_image, featured, published, author,
       published_at ?? null, id]
    );
    return NextResponse.json({ success: true, post: rows[0] });
  } catch (err) {
    console.error("[admin blog PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** DELETE /api/admin/blog/[id] — delete post */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await pool.query(`DELETE FROM blog_posts WHERE id = $1`, [id]);
  return NextResponse.json({ success: true });
}
