import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

type Params = { params: Promise<{ id: string; itemId: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, itemId } = await params;
  const { status } = await req.json();
  if (!["open", "resolved"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const { rows } = await pool.query(
    `UPDATE event_lost_found SET status = $1 WHERE id = $2 AND event_id = $3 RETURNING id::text, status`,
    [status, itemId, id]
  );
  if (!rows[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, item: rows[0] });
}
