import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO newsletter_subscribers (email)
       VALUES ($1)
       ON CONFLICT (email) DO UPDATE SET active = TRUE`,
      [email]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[newsletter POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
