import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

/** GET /api/admin/components/[id], fetch single component resource (full prompt) */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { rows } = await pool.query(
    `SELECT id::text, slug, title, description, prompt, category, cover_image, files, featured, published, author, published_at, created_at
     FROM component_resources WHERE id = $1`,
    [id]
  );
  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ component: rows[0] });
}

/** PATCH /api/admin/components/[id], update component resource */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const { title, description, prompt, category, cover_image, files, featured, published, author } = await req.json();

    const { rows: current } = await pool.query(
      `SELECT published FROM component_resources WHERE id = $1`, [id]
    );
    if (current.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const wasPublished = current[0].published;
    const published_at = published && !wasPublished ? new Date() : undefined;

    const { rows } = await pool.query(
      `UPDATE component_resources SET
         title        = COALESCE($1, title),
         description  = COALESCE($2, description),
         prompt       = COALESCE($3, prompt),
         category     = COALESCE($4, category),
         cover_image  = COALESCE($5, cover_image),
         files        = COALESCE($6, files),
         featured     = COALESCE($7, featured),
         published    = COALESCE($8, published),
         author       = COALESCE($9, author),
         published_at = COALESCE($10, published_at),
         updated_at   = NOW()
       WHERE id = $11
       RETURNING id::text, slug, title, description, prompt, category, cover_image, files, featured, published, author, published_at, updated_at`,
      [title, description, prompt, category, cover_image,
       files !== undefined ? JSON.stringify(files) : null,
       featured, published, author, published_at ?? null, id]
    );
    return NextResponse.json({ success: true, component: rows[0] });
  } catch (err) {
    console.error("[admin components PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** DELETE /api/admin/components/[id], delete component resource */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await pool.query(`DELETE FROM component_resources WHERE id = $1`, [id]);
  return NextResponse.json({ success: true });
}
