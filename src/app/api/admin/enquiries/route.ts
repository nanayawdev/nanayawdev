import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { rows } = await pool.query(
    `SELECT * FROM project_enquiries ORDER BY created_at DESC`
  );
  return NextResponse.json({ enquiries: rows });
}

export async function PATCH(req: NextRequest) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, status } = await req.json();
  const { rows } = await pool.query(
    `UPDATE project_enquiries SET status = $1 WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return NextResponse.json({ enquiry: rows[0] });
}
