import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { rows } = await pool.query(
      `SELECT id::text, quote, author_name, author_role, avatar,
              published, sort_order, created_at, updated_at
       FROM testimonials ORDER BY sort_order ASC, created_at ASC`
    );
    return NextResponse.json({ testimonials: rows });
  } catch (err) {
    console.error("[admin testimonials GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { quote, author_name, author_role, avatar, published, sort_order } = await req.json();
    if (!quote || !author_name) return NextResponse.json({ error: "quote and author_name are required" }, { status: 400 });
    const { rows } = await pool.query(
      `INSERT INTO testimonials (quote, author_name, author_role, avatar, published, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING id::text, author_name, published, created_at`,
      [quote, author_name, author_role ?? "", avatar ?? null, published ?? false, sort_order ?? 0]
    );
    return NextResponse.json({ success: true, testimonial: rows[0] }, { status: 201 });
  } catch (err) {
    console.error("[admin testimonials POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
