"use client";

import { useEffect, useRef, useState } from "react";
import { PaperPlaneTiltIcon as Send, PaperclipIcon as Paperclip, FileArrowDownIcon as FileArrowDown } from "@phosphor-icons/react";
import { ConfirmModal } from "@/components/confirm-modal";
import { adminFetch } from "@/lib/admin-fetch";
import { linkify } from "@/lib/linkify";

interface Session {
  id: number;
  phone: string;
  visitor_name: string | null;
  status: string;
  created_at: string;
}

interface Message {
  id: number;
  sender: "user" | "agent";
  body: string;
  attachment_url: string | null;
  attachment_name: string | null;
  attachment_type: string | null;
  created_at: string;
}

export default function AdminChatPage() {
  const [sessions, setSessions]   = useState<Session[]>([]);
  const [active, setActive]       = useState<Session | null>(null);
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState("");
  const [sending, setSending]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [ending, setEnding]       = useState(false);
  const bottomRef                 = useRef<HTMLDivElement>(null);
  const esRef                     = useRef<EventSource | null>(null);
  const fileInputRef              = useRef<HTMLInputElement>(null);

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

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !active) return;
    setUploading(true);
    setUploadError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const uploadRes = await adminFetch("/api/admin/chat/upload", { method: "POST", body: form });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error ?? "Upload failed");

      await adminFetch(`/api/chat/sessions/${active.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: input.trim(),
          attachment_url: uploadData.url,
          attachment_name: uploadData.name,
          attachment_type: uploadData.type,
        }),
      });
      setInput("");
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function closeSession() {
    if (!active) return;
    setEnding(true);
    await adminFetch(`/api/chat/sessions/${active.id}/close`, { method: "POST" });
    setSessions((prev) =>
      prev.map((s) => (s.id === active.id ? { ...s, status: "closed" } : s))
    );
    setActive((prev) => prev ? { ...prev, status: "closed" } : null);
    setEnding(false);
    setConfirmEnd(false);
  }

  const statusColor: Record<string, string> = {
    active:      "bg-green-500",
    pending_otp: "bg-yellow-500",
    closed:      "bg-muted",
  };

  const files = messages.filter((m) => m.attachment_url);

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
                <p className="text-sm font-semibold text-foreground">{s.visitor_name || s.phone}</p>
              </div>
              {s.visitor_name && <p className="text-[0.65rem] text-muted-foreground">{s.phone}</p>}
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
        <div className="flex-1 flex min-w-0 overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <p className="text-sm font-bold text-foreground">{active.visitor_name || active.phone}</p>
              {active.visitor_name && <p className="text-[0.65rem] text-muted-foreground">{active.phone}</p>}
              <p className="text-[0.6rem] text-muted-foreground uppercase tracking-widest">{active.status}</p>
            </div>
            {active.status !== "closed" && (
              <button
                onClick={() => setConfirmEnd(true)}
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
                  {m.body && <p className="whitespace-pre-wrap break-words">{linkify(m.body)}</p>}
                  {m.attachment_url && (
                    <a
                      href={m.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={m.attachment_name ?? undefined}
                      className={`mt-2 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-opacity hover:opacity-80 ${
                        m.sender === "agent" ? "border-background/30" : "border-border"
                      }`}
                    >
                      <FileArrowDown className="h-4 w-4 shrink-0" />
                      <span className="truncate">{m.attachment_name ?? "Download file"}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          {active.status !== "closed" ? (
            <div className="border-t border-border">
              {uploadError && (
                <p className="px-5 pt-2 text-[0.65rem] uppercase tracking-widest text-red-500">{uploadError}</p>
              )}
              <div className="flex items-center gap-0">
                <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  aria-label="Attach a file"
                  title="Attach a file (PDF, Word, PowerPoint, image — max 4 MB)"
                  className="shrink-0 px-4 py-4 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder={uploading ? "Uploading…" : "Type a message…"}
                  disabled={uploading}
                  className="flex-1 bg-background px-5 py-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none disabled:opacity-60"
                />
                <button
                  onClick={sendMessage}
                  disabled={sending || uploading || !input.trim()}
                  className="h-full rounded-full px-5 py-4 bg-foreground text-background transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-border px-6 py-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Conversation ended
            </div>
          )}
        </div>

        {/* Files sidebar */}
        <div className="w-64 shrink-0 border-l border-border flex flex-col">
          <div className="border-b border-border px-5 py-4">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {files.length} {files.length === 1 ? "File" : "Files"}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {files.length === 0 ? (
              <p className="px-2 py-8 text-center text-xs text-muted-foreground">No files shared yet</p>
            ) : (
              files.map((m) => (
                <a
                  key={m.id}
                  href={m.attachment_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={m.attachment_name ?? undefined}
                  className="flex items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 text-xs transition-colors hover:bg-muted/40"
                >
                  <FileArrowDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">{m.attachment_name ?? "File"}</p>
                    <p className="text-[0.6rem] text-muted-foreground">
                      {m.sender === "agent" ? "You" : "Visitor"} · {new Date(m.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          Select a session to start chatting
        </div>
      )}

      <ConfirmModal
        open={confirmEnd}
        title="End this conversation?"
        description="The visitor won't be able to send further messages in this chat once it's closed."
        confirmLabel="End Conversation"
        destructive
        loading={ending}
        onConfirm={closeSession}
        onCancel={() => setConfirmEnd(false)}
      />
    </div>
  );
}
