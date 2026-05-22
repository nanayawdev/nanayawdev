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
      `SELECT id::text, slug, client, category, year, tagline, cover_image, client_url,
              services, stats, problem, approach, result, result_headline, result_body,
              featured, published, created_at, updated_at
       FROM case_studies ORDER BY created_at DESC`
    );
    return NextResponse.json({ case_studies: rows });
  } catch (err) {
    console.error("[admin case-studies GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!getAdminFromRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const {
      client, category, year, tagline, cover_image, client_url,
      services, stats, problem, approach, result, result_headline, result_body,
      featured, published,
    } = await req.json();
    if (!client) return NextResponse.json({ error: "client is required" }, { status: 400 });
    const slug = slugify(client);
    const { rows } = await pool.query(
      `INSERT INTO case_studies
         (slug, client, category, year, tagline, cover_image, client_url, services, stats,
          problem, approach, result, result_headline, result_body, featured, published)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
       RETURNING id::text, slug, client, published, created_at`,
      [slug, client, category ?? "Web Development", year ?? null, tagline ?? "",
       cover_image ?? null, client_url ?? null, services ?? [], JSON.stringify(stats ?? []),
       problem ?? "", approach ?? "", result ?? "", result_headline ?? "", result_body ?? "",
       featured ?? false, published ?? false]
    );
    return NextResponse.json({ success: true, case_study: rows[0] }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    if (msg.includes("unique")) return NextResponse.json({ error: "A case study for this client already exists" }, { status: 409 });
    console.error("[admin case-studies POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
