import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { rows } = await pool.query(
    `SELECT id::text, name, phone, email, quantity, amount_paid, source, status, payment_status,
            ticket_code, ticket_type, payment_method, checked_in, checked_in_at, created_at
     FROM event_registrations WHERE event_id = $1 ORDER BY created_at DESC`, [id]
  );
  return NextResponse.json({ registrations: rows });
}
