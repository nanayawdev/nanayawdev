import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, company, budget, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "name, email and message are required" }, { status: 400 });
    }

    const { rows } = await pool.query(
      `INSERT INTO project_enquiries (name, email, phone, company, budget, message)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, created_at`,
      [name, email, phone ?? null, company ?? null, budget ?? null, message]
    );

    return NextResponse.json({ success: true, id: rows[0].id }, { status: 201 });
  } catch (err) {
    console.error("[enquiries POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
