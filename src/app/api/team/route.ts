import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT id::text, name, role, bio, photo, initials, github, linkedin, twitter, website, sort_order
       FROM team_members
       WHERE published = TRUE
       ORDER BY sort_order ASC, created_at ASC`
    );
    return NextResponse.json({ members: rows });
  } catch (err) {
    console.error("[team GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
