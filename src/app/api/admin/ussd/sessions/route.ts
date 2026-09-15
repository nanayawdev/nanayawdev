import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

/** Grouped session summaries — one row per USSD session_id, most recent activity first. */
export async function GET(req: NextRequest) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { rows } = await pool.query(
      `SELECT session_id,
              MIN(mobile) AS mobile,
              MIN(application_name) AS application_name,
              MIN(extension) AS extension,
              MIN(created_at) AS started_at,
              MAX(created_at) AS last_at,
              COUNT(*)::int AS turns,
              BOOL_OR(NOT continue_session) AS completed,
              (ARRAY_AGG(message ORDER BY created_at DESC))[1] AS last_message
       FROM ussd_activity_log
       GROUP BY session_id
       ORDER BY MAX(created_at) DESC
       LIMIT 200`
    );
    return NextResponse.json({ sessions: rows });
  } catch (err) {
    console.error("[admin ussd sessions GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
