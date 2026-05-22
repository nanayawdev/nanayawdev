import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const SECRET = process.env.JWT_SECRET!;
const EXPIRY = "8h";

export interface AdminPayload {
  sub: string;
  username: string;
  role: "admin";
}

export function signAdminToken(payload: Omit<AdminPayload, "role">): string {
  return jwt.sign({ ...payload, role: "admin" }, SECRET, { expiresIn: EXPIRY });
}

export function verifyAdminToken(token: string): AdminPayload {
  const payload = jwt.verify(token, SECRET) as AdminPayload;
  if (payload.role !== "admin") throw new Error("Not an admin token");
  return payload;
}

export function getAdminFromRequest(req: NextRequest): AdminPayload | null {
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;
  try {
    return verifyAdminToken(token);
  } catch {
    return null;
  }
}

export interface ChatPayload {
  sub: string;   // session id (UUID)
  phone: string;
  role: "chat";
}

export function signChatToken(payload: Omit<ChatPayload, "role">): string {
  return jwt.sign({ ...payload, role: "chat" }, SECRET, { expiresIn: "24h" });
}

export function verifyChatToken(token: string): ChatPayload {
  const payload = jwt.verify(token, SECRET) as ChatPayload;
  if (payload.role !== "chat") throw new Error("Not a chat token");
  return payload;
}

export function getChatFromRequest(req: NextRequest): ChatPayload | null {
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return null;
  try {
    return verifyChatToken(token);
  } catch {
    return null;
  }
}
