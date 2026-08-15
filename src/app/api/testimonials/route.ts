import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id::text, quote, author_name, author_role, avatar
       FROM testimonials
       WHERE published = TRUE
       ORDER BY sort_order ASC, created_at ASC`
    );
    return NextResponse.json({ testimonials: rows });
  } catch (err) {
    console.error("[testimonials GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
