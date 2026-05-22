import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { rows } = await pool.query(
    `SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC`
  );
  return NextResponse.json({ subscribers: rows });
}

export async function PATCH(req: NextRequest) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, active } = await req.json();
  const { rows } = await pool.query(
    `UPDATE newsletter_subscribers SET active = $1 WHERE id = $2 RETURNING *`,
    [active, id]
  );
  return NextResponse.json({ subscriber: rows[0] });
}
