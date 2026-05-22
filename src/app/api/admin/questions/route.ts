import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { rows } = await pool.query(
    `SELECT * FROM faq_questions ORDER BY created_at DESC`
  );
  return NextResponse.json({ questions: rows });
}

export async function PATCH(req: NextRequest) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id, answered } = await req.json();
  const { rows } = await pool.query(
    `UPDATE faq_questions SET answered = $1 WHERE id = $2 RETURNING *`,
    [answered, id]
  );
  return NextResponse.json({ question: rows[0] });
}
