import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

type Params = { params: Promise<{ sessionId: string }> };

/** Full turn-by-turn detail for one USSD session, oldest first. */
export async function GET(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { sessionId } = await params;
  const { rows } = await pool.query(
    `SELECT id::text, mobile, application_name, extension, step_before, input, message, continue_session, created_at
     FROM ussd_activity_log WHERE session_id = $1 ORDER BY created_at ASC`,
    [sessionId]
  );
  return NextResponse.json({ turns: rows });
}
