import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getChatFromRequest, getAdminFromRequest } from "@/lib/auth";

/** POST /api/chat/sessions/[id]/messages, send a message */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
    const { body } = await req.json();

    if (!body?.trim()) {
      return NextResponse.json({ error: "body is required" }, { status: 400 });
    }

    // Determine sender, either authenticated chat user or admin
    const chatUser = getChatFromRequest(req);
    const admin    = getAdminFromRequest(req);

    if (!chatUser && !admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (chatUser && chatUser.sub !== sessionId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const sender = admin ? "agent" : "user";

    const { rows } = await pool.query(
      `INSERT INTO chat_messages (session_id, sender, body)
       VALUES ($1, $2, $3)
       RETURNING id, session_id, sender, body, created_at`,
      [sessionId, sender, body.trim()]
    );

    return NextResponse.json({ success: true, message: rows[0] }, { status: 201 });
  } catch (err) {
    console.error("[messages POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** GET /api/chat/sessions/[id]/messages, fetch message history */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;

    const chatUser = getChatFromRequest(req);
    const admin    = getAdminFromRequest(req);

    if (!chatUser && !admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (chatUser && chatUser.sub !== sessionId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { rows } = await pool.query(
      `SELECT id, sender, body, created_at
       FROM chat_messages
       WHERE session_id = $1
       ORDER BY created_at ASC`,
      [sessionId]
    );

    return NextResponse.json({ messages: rows });
  } catch (err) {
    console.error("[messages GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
