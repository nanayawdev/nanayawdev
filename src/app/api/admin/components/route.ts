import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** GET /api/admin/components, all component resources (including drafts) */
export async function GET(req: NextRequest) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { rows } = await pool.query(
    `SELECT id::text, slug, title, description, category, cover_image, files, featured, published, author, published_at, created_at, updated_at
     FROM component_resources
     ORDER BY created_at DESC`
  );
  return NextResponse.json({ components: rows });
}

/** POST /api/admin/components, create component resource */
export async function POST(req: NextRequest) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { title, description, prompt, category, cover_image, files, featured, published, author } = await req.json();

    if (!title || !description || !prompt) {
      return NextResponse.json({ error: "title, description and prompt are required" }, { status: 400 });
    }

    const slug = slugify(title);
    const published_at = published ? new Date() : null;

    const { rows } = await pool.query(
      `INSERT INTO component_resources (slug, title, description, prompt, category, cover_image, files, featured, published, author, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING id::text, slug, title, published, created_at`,
      [slug, title, description, prompt, category ?? "General", cover_image ?? null,
       JSON.stringify(files ?? []), featured ?? false, published ?? false, author ?? "nanayawdev", published_at]
    );
    return NextResponse.json({ success: true, component: rows[0] }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    if (msg.includes("unique")) {
      return NextResponse.json({ error: "A component with this title already exists" }, { status: 409 });
    }
    console.error("[admin components POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
