"use client";

import { useEffect, useRef, useState } from "react";
import { PaperPlaneTiltIcon as Send } from "@phosphor-icons/react";
import { adminFetch } from "@/lib/admin-fetch";

interface Session {
  id: number;
  phone: string;
  status: string;
  created_at: string;
}

interface Message {
  id: number;
  sender: "user" | "agent";
  body: string;
  created_at: string;
}

export default function AdminChatPage() {
  const [sessions, setSessions]   = useState<Session[]>([]);
  const [active, setActive]       = useState<Session | null>(null);
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState("");
  const [sending, setSending]     = useState(false);
  const bottomRef                 = useRef<HTMLDivElement>(null);
  const esRef                     = useRef<EventSource | null>(null);

  function token() { return localStorage.getItem("admin_token") ?? ""; }

  // Load sessions
  useEffect(() => {
    adminFetch("/api/admin/chat/sessions")
      .then((r) => r.json())
      .then((d) => setSessions(d.sessions ?? []));
  }, []);

  // Load messages + open SSE when active changes
  useEffect(() => {
    if (!active) return;

    // Close previous SSE
    esRef.current?.close();

    // Fetch history
    adminFetch(`/api/chat/sessions/${active.id}/messages`)
      .then((r) => r.json())
      .then((d) => setMessages(d.messages ?? []));

    // Open SSE stream
    const es = new EventSource(
      `/api/chat/sessions/${active.id}/stream?token=${token()}`
    );
    esRef.current = es;

    es.onmessage = (e) => {
      const msg: Message = JSON.parse(e.data);
      setMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    };

    es.addEventListener("closed", () => {
      setSessions((prev) =>
        prev.map((s) => (s.id === active.id ? { ...s, status: "closed" } : s))
      );
    });

    return () => es.close();
  }, [active]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!active || !input.trim()) return;
    setSending(true);
    await adminFetch(`/api/chat/sessions/${active.id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: input.trim() }),
    });
    setInput("");
    setSending(false);
  }

  async function closeSession() {
    if (!active) return;
    await adminFetch(`/api/chat/sessions/${active.id}/close`, { method: "POST" });
    setSessions((prev) =>
      prev.map((s) => (s.id === active.id ? { ...s, status: "closed" } : s))
    );
    setActive((prev) => prev ? { ...prev, status: "closed" } : null);
  }

  const statusColor: Record<string, string> = {
    active:      "bg-green-500",
    pending_otp: "bg-yellow-500",
    closed:      "bg-muted",
  };

  return (
    <div className="flex gap-0 h-[calc(100vh-4rem)] overflow-hidden rounded-lg border border-border">
      {/* Session list */}
      <div className="w-72 shrink-0 border-r border-border flex flex-col">
        <div className="border-b border-border px-5 py-4">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {sessions.length} sessions
          </p>
        </div>
        <div className="overflow-y-auto flex-1">
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => { setActive(s); setMessages([]); }}
              className={`w-full text-left border-b border-border px-5 py-4 transition-colors hover:bg-muted/30 ${
                active?.id === s.id ? "bg-muted/40" : ""
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`h-2 w-2 shrink-0 rounded-full ${statusColor[s.status] ?? "bg-muted"}`} />
                <p className="text-sm font-semibold text-foreground">{s.phone}</p>
              </div>
              <p className="text-[0.6rem] text-muted-foreground uppercase tracking-widest">{s.status}</p>
              <p className="text-[0.6rem] text-muted-foreground mt-0.5">
                {new Date(s.created_at).toLocaleString()}
              </p>
            </button>
          ))}
          {sessions.length === 0 && (
            <p className="px-5 py-8 text-sm text-muted-foreground text-center">No sessions yet</p>
          )}
        </div>
      </div>

      {/* Chat area */}
      {active ? (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <p className="text-sm font-bold text-foreground">{active.phone}</p>
              <p className="text-[0.6rem] text-muted-foreground uppercase tracking-widest">{active.status}</p>
            </div>
            {active.status !== "closed" && (
              <button
                onClick={closeSession}
                className="rounded-full border border-border px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-muted"
              >
                End Conversation
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === "agent" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2.5 text-sm leading-relaxed ${
                    m.sender === "agent"
                      ? "bg-foreground text-background"
                      : "border border-border bg-muted/30 text-foreground"
                  }`}
                >
                  {m.body}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          {active.status !== "closed" ? (
            <div className="border-t border-border flex items-center gap-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Type a message…"
                className="flex-1 bg-background px-5 py-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={sending || !input.trim()}
                className="h-full rounded-full px-5 py-4 bg-foreground text-background transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="border-t border-border px-6 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Conversation ended
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          Select a session to start chatting
        </div>
      )}
    </div>
  );
}
