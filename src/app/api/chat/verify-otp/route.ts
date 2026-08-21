import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { signChatToken } from "@/lib/auth";

/** POST /api/chat/verify-otp, verify OTP and return chat JWT */
export async function POST(req: NextRequest) {
  try {
    const { session_id, otp } = await req.json();

    if (!session_id || !otp) {
      return NextResponse.json({ error: "session_id and otp are required" }, { status: 400 });
    }

    const { rows } = await pool.query(
      `SELECT id::text, phone, otp, otp_expires_at, status FROM chat_sessions WHERE id = $1`,
      [session_id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const session = rows[0];

    if (session.status === "closed") {
      return NextResponse.json({ error: "Session is closed" }, { status: 400 });
    }

    if (session.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }

    if (new Date(session.otp_expires_at) < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 401 });
    }

    const token = signChatToken({ sub: session.id, phone: session.phone });

    await pool.query(
      `UPDATE chat_sessions SET status = 'active', token = $1, otp = NULL WHERE id = $2`,
      [token, session.id]
    );

    return NextResponse.json({ success: true, token, session_id: session.id });
  } catch (err) {
    console.error("[verify-otp POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
