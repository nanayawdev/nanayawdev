import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { rows } = await pool.query(
    `SELECT id::text, slug, client, category, year, tagline, cover_image, client_url,
            services, stats, problem, approach, result, result_headline, result_body,
            featured, published, created_at, updated_at
     FROM case_studies WHERE id=$1`, [id]
  );
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ case_study: rows[0] });
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const {
    client, category, year, tagline, cover_image, client_url,
    services, stats, problem, approach, result, result_headline, result_body,
    featured, published,
  } = await req.json();
  const { rows } = await pool.query(
    `UPDATE case_studies SET
       client=$1, category=$2, year=$3, tagline=$4, cover_image=$5, client_url=$6,
       services=$7, stats=$8, problem=$9, approach=$10, result=$11,
       result_headline=$12, result_body=$13, featured=$14, published=$15, updated_at=NOW()
     WHERE id=$16
     RETURNING id::text, slug, client, published, updated_at`,
    [client, category, year ?? null, tagline ?? "", cover_image ?? null, client_url ?? null,
     services ?? [], JSON.stringify(stats ?? []), problem ?? "", approach ?? "", result ?? "",
     result_headline ?? "", result_body ?? "", featured ?? false, published ?? false, id]
  );
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, case_study: rows[0] });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const fields = Object.entries(body).map(([k], i) => `${k}=$${i + 1}`).join(", ");
  const values = [...Object.values(body), id];
  const { rows } = await pool.query(
    `UPDATE case_studies SET ${fields}, updated_at=NOW() WHERE id=$${values.length} RETURNING id::text, published`,
    values
  );
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, case_study: rows[0] });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await pool.query(`DELETE FROM case_studies WHERE id=$1`, [id]);
  return NextResponse.json({ success: true });
}
