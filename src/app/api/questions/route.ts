import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, question } = await req.json();

    if (!name || !email || !question) {
      return NextResponse.json({ error: "name, email and question are required" }, { status: 400 });
    }

    const { rows } = await pool.query(
      `INSERT INTO faq_questions (name, email, phone, question)
       VALUES ($1, $2, $3, $4)
       RETURNING id, created_at`,
      [name, email, phone ?? null, question]
    );

    return NextResponse.json({ success: true, id: rows[0].id }, { status: 201 });
  } catch (err) {
    console.error("[questions POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
