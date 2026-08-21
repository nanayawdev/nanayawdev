import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

/** GET /api/admin/chat/sessions, list all chat sessions */
export async function GET(req: NextRequest) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status"); // optional filter: active | closed | pending_otp

  const query = status
    ? `SELECT id, phone, visitor_name, status, created_at FROM chat_sessions WHERE status = $1 ORDER BY created_at DESC`
    : `SELECT id, phone, visitor_name, status, created_at FROM chat_sessions ORDER BY created_at DESC`;

  const { rows } = await pool.query(query, status ? [status] : []);
  return NextResponse.json({ sessions: rows });
}
