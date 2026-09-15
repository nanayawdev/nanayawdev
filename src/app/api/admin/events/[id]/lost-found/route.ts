import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { rows } = await pool.query(
    `SELECT id::text, kind, description, phone, status, created_at
     FROM event_lost_found WHERE event_id = $1 ORDER BY created_at DESC`, [id]
  );
  return NextResponse.json({ items: rows });
}
