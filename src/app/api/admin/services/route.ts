import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

function slugify(text: string) {
  return text.toLowerCase().trim()
    .replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

export async function GET(req: NextRequest) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { rows } = await pool.query(
      `SELECT id::text, slug, title, tagline, description, body, cover_image,
              tags, featured, published, sort_order, created_at, updated_at
       FROM services ORDER BY sort_order ASC, created_at ASC`
    );
    return NextResponse.json({ services: rows });
  } catch (err) {
    console.error("[admin services GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { title, tagline, description, body, cover_image, tags, featured, published, sort_order } = await req.json();
    if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });
    const slug = slugify(title);
    const { rows } = await pool.query(
      `INSERT INTO services (slug, title, tagline, description, body, cover_image, tags, featured, published, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id::text, slug, title, published, created_at`,
      [slug, title, tagline ?? "", description ?? "", body ?? "",
       cover_image ?? null, tags ?? [], featured ?? false, published ?? false, sort_order ?? 0]
    );
    return NextResponse.json({ success: true, service: rows[0] }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    if (msg.includes("unique")) return NextResponse.json({ error: "A service with this title already exists" }, { status: 409 });
    console.error("[admin services POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
