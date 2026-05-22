import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { rows } = await pool.query(
    `SELECT id::text, slug, title, description, category, cover_image, client_name, client_url,
            tags, platforms, featured, published, year, created_at, updated_at
     FROM projects WHERE id = $1`, [id]
  );
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ project: rows[0] });
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { title, description, category, cover_image, client_name, client_url, tags, platforms, featured, published, year } = await req.json();
  const { rows } = await pool.query(
    `UPDATE projects SET
       title=$1, description=$2, category=$3, cover_image=$4, client_name=$5,
       client_url=$6, tags=$7, platforms=$8, featured=$9, published=$10, year=$11, updated_at=NOW()
     WHERE id=$12
     RETURNING id::text, slug, title, published, updated_at`,
    [title, description, category, cover_image ?? null, client_name ?? null,
     client_url ?? null, tags ?? [], platforms ?? [], featured ?? false, published ?? false, year ?? null, id]
  );
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, project: rows[0] });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const fields = Object.entries(body).map(([k], i) => `${k}=$${i + 1}`).join(", ");
  const values = [...Object.values(body), id];
  const { rows } = await pool.query(
    `UPDATE projects SET ${fields}, updated_at=NOW() WHERE id=$${values.length} RETURNING id::text, published`,
    values
  );
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, project: rows[0] });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await pool.query(`DELETE FROM projects WHERE id=$1`, [id]);
  return NextResponse.json({ success: true });
}
