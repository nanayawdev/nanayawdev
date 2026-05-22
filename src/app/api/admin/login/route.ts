import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { signAdminToken } from "@/lib/auth";

/** POST /api/admin/login */
export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "username and password required" }, { status: 400 });
    }

    const { rows } = await pool.query(
      `SELECT id::text, username, password_hash FROM admin_users WHERE username = $1`,
      [username]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, rows[0].password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signAdminToken({ sub: rows[0].id, username: rows[0].username });

    return NextResponse.json({ success: true, token });
  } catch (err) {
    console.error("[admin login]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
