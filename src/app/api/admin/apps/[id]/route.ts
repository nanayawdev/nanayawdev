import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const { rows } = await pool.query(
      `SELECT id::text, slug, name, tagline, description, icon_image, cover_image,
              category, play_store_url, app_store_url, website_url,
              featured, published, sort_order, created_at, updated_at
       FROM apps WHERE id=$1`, [id]
    );
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ app: rows[0] });
  } catch (err) {
    console.error("[admin apps GET/:id]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const {
    name, tagline, description, icon_image, cover_image, category,
    play_store_url, app_store_url, website_url, featured, published, sort_order,
  } = await req.json();
  try {
    const { rows } = await pool.query(
      `UPDATE apps SET
         name=$1, tagline=$2, description=$3, icon_image=$4, cover_image=$5, category=$6,
         play_store_url=$7, app_store_url=$8, website_url=$9, featured=$10, published=$11,
         sort_order=$12, updated_at=NOW()
       WHERE id=$13
       RETURNING id::text, slug, name, published, updated_at`,
      [name, tagline ?? "", description ?? "", icon_image ?? null, cover_image ?? null,
       category ?? "Utility", play_store_url ?? null, app_store_url ?? null, website_url ?? null,
       featured ?? false, published ?? false, sort_order ?? 0, id]
    );
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, app: rows[0] });
  } catch (err) {
    console.error("[admin apps PUT]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const fields = Object.entries(body).map(([k], i) => `${k}=$${i + 1}`).join(", ");
  const values = [...Object.values(body), id];
  try {
    const { rows } = await pool.query(
      `UPDATE apps SET ${fields}, updated_at=NOW() WHERE id=$${values.length} RETURNING id::text, published`,
      values
    );
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, app: rows[0] });
  } catch (err) {
    console.error("[admin apps PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await pool.query(`DELETE FROM apps WHERE id=$1`, [id]);
  return NextResponse.json({ success: true });
}
