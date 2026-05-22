import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getChatFromRequest, getAdminFromRequest } from "@/lib/auth";

/** POST /api/chat/sessions/[id]/close — end conversation */
export async function POST(
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

    await pool.query(
      `UPDATE chat_sessions SET status = 'closed' WHERE id = $1`,
      [sessionId]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[close POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
