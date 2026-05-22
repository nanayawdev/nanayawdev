import { NextRequest } from "next/server";
import pool from "@/lib/db";
import { getChatFromRequest, getAdminFromRequest } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/chat/sessions/[id]/stream
 * Server-Sent Events stream — polls for new messages every 1.5s.
 * Both the chat user and admin connect to this endpoint.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: sessionId } = await params;

  // EventSource can't set headers — accept token via query param as fallback
  const { searchParams } = new URL(req.url);
  const qToken = searchParams.get("token");
  const reqWithFallback = qToken
    ? new Request(req.url, {
        headers: { ...Object.fromEntries(req.headers), authorization: `Bearer ${qToken}` },
      })
    : req;

  const chatUser = getChatFromRequest(reqWithFallback as import("next/server").NextRequest);
  const admin    = getAdminFromRequest(reqWithFallback as import("next/server").NextRequest);

  if (!chatUser && !admin) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (chatUser && chatUser.sub !== sessionId) {
    return new Response("Forbidden", { status: 403 });
  }

  let lastMsgTime = new Date(0);
  let closed = false;

  const stream = new ReadableStream({
    async start(controller) {
      const encode = (data: string) =>
        controller.enqueue(new TextEncoder().encode(data));

      // Send a heartbeat comment every 20s to keep the connection alive
      const heartbeat = setInterval(() => {
        if (!closed) encode(": heartbeat\n\n");
      }, 20_000);

      const poll = setInterval(async () => {
        if (closed) return;
        try {
          const { rows } = await pool.query(
            `SELECT id::text, sender, body, created_at
             FROM chat_messages
             WHERE session_id = $1 AND created_at > $2
             ORDER BY created_at ASC`,
            [sessionId, lastMsgTime]
          );

          for (const row of rows) {
            lastMsgTime = new Date(row.created_at);
            encode(`data: ${JSON.stringify(row)}\n\n`);
          }

          // Check if session was closed
          const { rows: sess } = await pool.query(
            `SELECT status FROM chat_sessions WHERE id = $1`,
            [sessionId]
          );
          if (sess[0]?.status === "closed") {
            encode(`event: closed\ndata: {}\n\n`);
            clearInterval(poll);
            clearInterval(heartbeat);
            closed = true;
            controller.close();
          }
        } catch {
          // swallow poll errors — don't crash the stream
        }
      }, 1_500);

      req.signal.addEventListener("abort", () => {
        closed = true;
        clearInterval(poll);
        clearInterval(heartbeat);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
