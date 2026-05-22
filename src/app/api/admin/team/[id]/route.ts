import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  try {
    const { rows } = await pool.query(
      `SELECT id::text, name, role, bio, photo, initials, github, linkedin, twitter, website,
              published, sort_order FROM team_members WHERE id=$1`, [id]
    );
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ member: rows[0] });
  } catch (err) {
    console.error("[admin team GET/:id]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { name, role, bio, photo, initials, github, linkedin, twitter, website, published, sort_order } = await req.json();
  try {
    const { rows } = await pool.query(
      `UPDATE team_members SET
         name=$1, role=$2, bio=$3, photo=$4, initials=$5,
         github=$6, linkedin=$7, twitter=$8, website=$9,
         published=$10, sort_order=$11, updated_at=NOW()
       WHERE id=$12
       RETURNING id::text, name, role, published, updated_at`,
      [name, role, bio ?? "", photo ?? null,
       initials || name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2),
       github ?? null, linkedin ?? null, twitter ?? null, website ?? null,
       published ?? false, sort_order ?? 0, id]
    );
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, member: rows[0] });
  } catch (err) {
    console.error("[admin team PUT]", err);
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
      `UPDATE team_members SET ${fields}, updated_at=NOW() WHERE id=$${values.length} RETURNING id::text, published`,
      values
    );
    if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, member: rows[0] });
  } catch (err) {
    console.error("[admin team PATCH]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await pool.query(`DELETE FROM team_members WHERE id=$1`, [id]);
  return NextResponse.json({ success: true });
}
