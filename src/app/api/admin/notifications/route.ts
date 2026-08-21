import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { getAdminFromRequest } from "@/lib/auth";

const PREVIEW_LIMIT = 5;

/**
 * GET /api/admin/notifications, unread items across the Inbox section
 * (new enquiries, unanswered questions, chat sessions awaiting a reply).
 */
export async function GET(req: NextRequest) {
  if (!getAdminFromRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [enquiryRows, questionRows, chatRows, enquiryCount, questionCount, chatCount] = await Promise.all([
    pool.query(
      `SELECT id::text, name, message, created_at
       FROM project_enquiries
       WHERE status = 'new'
       ORDER BY created_at DESC
       LIMIT $1`,
      [PREVIEW_LIMIT]
    ),
    pool.query(
      `SELECT id::text, name, question, created_at
       FROM faq_questions
       WHERE answered = FALSE
       ORDER BY created_at DESC
       LIMIT $1`,
      [PREVIEW_LIMIT]
    ),
    pool.query(
      `SELECT cs.id::text, COALESCE(NULLIF(cs.visitor_name, ''), cs.phone) AS name, lm.body, lm.created_at
       FROM chat_sessions cs
       JOIN LATERAL (
         SELECT sender, body, created_at
         FROM chat_messages
         WHERE session_id = cs.id
         ORDER BY created_at DESC
         LIMIT 1
       ) lm ON TRUE
       WHERE cs.status = 'active' AND lm.sender = 'user'
       ORDER BY lm.created_at DESC
       LIMIT $1`,
      [PREVIEW_LIMIT]
    ),
    pool.query(`SELECT COUNT(*)::int AS count FROM project_enquiries WHERE status = 'new'`),
    pool.query(`SELECT COUNT(*)::int AS count FROM faq_questions WHERE answered = FALSE`),
    pool.query(
      `SELECT COUNT(*)::int AS count
       FROM chat_sessions cs
       JOIN LATERAL (
         SELECT sender FROM chat_messages WHERE session_id = cs.id ORDER BY created_at DESC LIMIT 1
       ) lm ON TRUE
       WHERE cs.status = 'active' AND lm.sender = 'user'`
    ),
  ]);

  interface Row {
    id: string;
    name: string;
    created_at: string;
    message?: string;
    question?: string;
    body?: string;
  }

  const items = [
    ...enquiryRows.rows.map((r: Row) => ({
      id: r.id,
      type: "enquiry" as const,
      title: r.name,
      excerpt: r.message ?? "",
      href: "/admin/enquiries",
      created_at: r.created_at,
    })),
    ...questionRows.rows.map((r: Row) => ({
      id: r.id,
      type: "question" as const,
      title: r.name,
      excerpt: r.question ?? "",
      href: "/admin/questions",
      created_at: r.created_at,
    })),
    ...chatRows.rows.map((r: Row) => ({
      id: r.id,
      type: "chat" as const,
      title: r.name,
      excerpt: r.body ?? "",
      href: "/admin/chat",
      created_at: r.created_at,
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const counts = {
    enquiries: enquiryCount.rows[0].count,
    questions: questionCount.rows[0].count,
    chats: chatCount.rows[0].count,
  };

  return NextResponse.json({ items, total: counts.enquiries + counts.questions + counts.chats, counts });
}
