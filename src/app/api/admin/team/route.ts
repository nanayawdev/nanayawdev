import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { rows } = await pool.query(
      `SELECT id::text, name, role, bio, photo, initials, github, linkedin, twitter, website,
              published, sort_order, created_at, updated_at
       FROM team_members ORDER BY sort_order ASC, created_at ASC`
    );
    return NextResponse.json({ members: rows });
  } catch (err) {
    console.error("[admin team GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { name, role, bio, photo, initials, github, linkedin, twitter, website, published, sort_order } = await req.json();
    if (!name || !role) return NextResponse.json({ error: "name and role are required" }, { status: 400 });
    const { rows } = await pool.query(
      `INSERT INTO team_members (name, role, bio, photo, initials, github, linkedin, twitter, website, published, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING id::text, name, role, published, created_at`,
      [name, role, bio ?? "", photo ?? null,
       initials || name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2),
       github ?? null, linkedin ?? null, twitter ?? null, website ?? null,
       published ?? false, sort_order ?? 0]
    );
    return NextResponse.json({ success: true, member: rows[0] }, { status: 201 });
  } catch (err) {
    console.error("[admin team POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
