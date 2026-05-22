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
      `SELECT id::text, slug, title, description, category, cover_image, client_name, client_url,
              tags, platforms, featured, published, year, created_at, updated_at
       FROM projects ORDER BY created_at DESC`
    );
    return NextResponse.json({ projects: rows });
  } catch (err) {
    console.error("[admin projects GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { title, description, category, cover_image, client_name, client_url, tags, platforms, featured, published, year } = await req.json();
    if (!title || !description) return NextResponse.json({ error: "title and description are required" }, { status: 400 });
    const slug = slugify(title);
    const { rows } = await pool.query(
      `INSERT INTO projects (slug, title, description, category, cover_image, client_name, client_url, tags, platforms, featured, published, year)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING id::text, slug, title, published, created_at`,
      [slug, title, description, category ?? "Web", cover_image ?? null,
       client_name ?? null, client_url ?? null, tags ?? [], platforms ?? [], featured ?? false, published ?? false, year ?? null]
    );
    return NextResponse.json({ success: true, project: rows[0] }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    if (msg.includes("unique")) return NextResponse.json({ error: "A project with this title already exists" }, { status: 409 });
    console.error("[admin projects POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
