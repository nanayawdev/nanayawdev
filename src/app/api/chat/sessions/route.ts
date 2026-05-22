import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { generateOtp, otpExpiresAt, sendOtp } from "@/lib/hubtel";

/** POST /api/chat/sessions — create session and send OTP */
export async function POST(req: NextRequest) {
  try {
    const { phone, name } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: "phone is required" }, { status: 400 });
    }

    const otp = generateOtp();
    const expires = otpExpiresAt();

    // Always create a fresh session per chat request
    const { rows } = await pool.query(
      `INSERT INTO chat_sessions (phone, visitor_name, otp, otp_expires_at, status)
       VALUES ($1, $2, $3, $4, 'pending_otp')
       RETURNING id::text`,
      [phone, (name ?? "").trim(), otp, expires]
    );

    const sessionId: string = rows[0].id;

    await sendOtp(phone, otp);

    return NextResponse.json({ success: true, session_id: sessionId }, { status: 201 });
  } catch (err) {
    console.error("[chat sessions POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
