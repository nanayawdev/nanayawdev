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
      `SELECT id::text, slug, name, tagline, description, icon_image, cover_image,
              category, play_store_url, app_store_url, website_url,
              featured, published, sort_order, created_at, updated_at
       FROM apps ORDER BY sort_order ASC, created_at ASC`
    );
    return NextResponse.json({ apps: rows });
  } catch (err) {
    console.error("[admin apps GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const {
      name, tagline, description, icon_image, cover_image, category,
      play_store_url, app_store_url, website_url, featured, published, sort_order,
    } = await req.json();
    if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });
    const slug = slugify(name);
    const { rows } = await pool.query(
      `INSERT INTO apps (slug, name, tagline, description, icon_image, cover_image, category,
                          play_store_url, app_store_url, website_url, featured, published, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING id::text, slug, name, published, created_at`,
      [slug, name, tagline ?? "", description ?? "", icon_image ?? null, cover_image ?? null,
       category ?? "Utility", play_store_url ?? null, app_store_url ?? null, website_url ?? null,
       featured ?? false, published ?? false, sort_order ?? 0]
    );
    return NextResponse.json({ success: true, app: rows[0] }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    if (msg.includes("unique")) return NextResponse.json({ error: "An app with this name already exists" }, { status: 409 });
    console.error("[admin apps POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
