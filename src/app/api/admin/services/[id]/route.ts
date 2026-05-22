import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const { rows } = await pool.query(
      `SELECT id::text, slug, title, tagline, description, body, cover_image,
              tags, featured, published, sort_order, created_at, updated_at
       FROM services WHERE id=$1`, [id]
    );
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ service: rows[0] });
  } catch (err) {
    console.error("[admin services GET/:id]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { title, tagline, description, body, cover_image, tags, featured, published, sort_order } = await req.json();
  try {
    const { rows } = await pool.query(
      `UPDATE services SET
         title=$1, tagline=$2, description=$3, body=$4, cover_image=$5,
         tags=$6, featured=$7, published=$8, sort_order=$9, updated_at=NOW()
       WHERE id=$10
       RETURNING id::text, slug, title, published, updated_at`,
      [title, tagline ?? "", description ?? "", body ?? "", cover_image ?? null,
       tags ?? [], featured ?? false, published ?? false, sort_order ?? 0, id]
    );
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, service: rows[0] });
  } catch (err) {
    console.error("[admin services PUT]", err);
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
      `UPDATE services SET ${fields}, updated_at=NOW() WHERE id=$${values.length} RETURNING id::text, published`,
      values
    );
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, service: rows[0] });
  } catch (err) {
    console.error("[admin services PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await pool.query(`DELETE FROM services WHERE id=$1`, [id]);
  return NextResponse.json({ success: true });
}
