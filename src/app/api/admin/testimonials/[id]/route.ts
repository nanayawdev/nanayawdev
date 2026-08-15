import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const { rows } = await pool.query(
      `SELECT id::text, quote, author_name, author_role, avatar,
              published, sort_order FROM testimonials WHERE id=$1`, [id]
    );
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ testimonial: rows[0] });
  } catch (err) {
    console.error("[admin testimonials GET/:id]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { quote, author_name, author_role, avatar, published, sort_order } = await req.json();
  try {
    const { rows } = await pool.query(
      `UPDATE testimonials SET
         quote=$1, author_name=$2, author_role=$3, avatar=$4,
         published=$5, sort_order=$6, updated_at=NOW()
       WHERE id=$7
       RETURNING id::text, author_name, published, updated_at`,
      [quote, author_name, author_role ?? "", avatar ?? null, published ?? false, sort_order ?? 0, id]
    );
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, testimonial: rows[0] });
  } catch (err) {
    console.error("[admin testimonials PUT]", err);
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
      `UPDATE testimonials SET ${fields}, updated_at=NOW() WHERE id=$${values.length} RETURNING id::text, published`,
      values
    );
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, testimonial: rows[0] });
  } catch (err) {
    console.error("[admin testimonials PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await pool.query(`DELETE FROM testimonials WHERE id=$1`, [id]);
  return NextResponse.json({ success: true });
}
