"use client";

import { useState, useRef, useEffect } from "react";
import { PhoneIcon as Phone, XIcon as X, PaperPlaneTiltIcon as Send, MinusIcon as Minus, FileArrowDownIcon as FileArrowDown } from "@phosphor-icons/react";
import { Spinner } from "@/components/admin/spinner";
import { linkify } from "@/lib/linkify";

type Stage = "idle" | "phone" | "otp" | "chat" | "closed";
type Message = {
  id: string;
  sender: "agent" | "user";
  body: string;
  attachment_url: string | null;
  attachment_name: string | null;
  attachment_type: string | null;
  created_at: string;
};

const STORAGE_KEY = "nanayawdev_chat_session";

interface PersistedSession {
  sessionId: string;
  token: string;
  phone: string;
  name: string;
}

function saveSession(s: PersistedSession) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

function loadSession(): PersistedSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as PersistedSession;
    // Validate JWT expiry client-side
    const payload = JSON.parse(atob(s.token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) { clearSession(); return null; }
    return s;
  } catch { return null; }
}

function clearSession() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

export function ChatBubble() {
  const [open, setOpen]           = useState(false);
  const [minimised, setMinimised] = useState(false);
  const [stage, setStage]         = useState<Stage>("idle");
  const [name, setName]           = useState("");
  const [phone, setPhone]         = useState("");
  const [otp, setOtp]             = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [token, setToken]         = useState<string | null>(null);
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const bottomRef                 = useRef<HTMLDivElement>(null);
  const esRef                     = useRef<EventSource | null>(null);

  // Rehydrate session from localStorage on mount
  useEffect(() => {
    const saved = loadSession();
    if (!saved) return;
    setSessionId(saved.sessionId);
    setToken(saved.token);
    setPhone(saved.phone);
    setName(saved.name ?? "");
    // Fetch existing messages then go straight to chat
    fetch(`/api/chat/sessions/${saved.sessionId}/messages`, {
      headers: { Authorization: `Bearer ${saved.token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.messages) {
          setMessages(data.messages);
          setStage("chat");
        } else {
          clearSession();
        }
      })
      .catch(() => clearSession());
  }, []);

  useEffect(() => {
    if (open && !minimised) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, minimised]);

  // SSE stream once we have a token
  useEffect(() => {
    if (!token || !sessionId) return;
    esRef.current?.close();
    const es = new EventSource(`/api/chat/sessions/${sessionId}/stream?token=${token}`);
    esRef.current = es;
    es.onmessage = (e) => {
      const msg: Message = JSON.parse(e.data);
      setMessages((prev) => prev.find((m) => m.id === msg.id) ? prev : [...prev, msg]);
    };
    es.addEventListener("closed", () => { setStage("closed"); clearSession(); });
    return () => es.close();
  }, [token, sessionId]);

  async function requestOtp() {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setSessionId(data.session_id);
      setStage("otp");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/chat/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Invalid OTP");
      setToken(data.token);
      setStage("chat");
      saveSession({ sessionId: sessionId!, token: data.token, phone, name });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    if (!input.trim() || !token || !sessionId) return;
    const body = input.trim();
    setInput("");
    await fetch(`/api/chat/sessions/${sessionId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ body }),
    });
  }

  async function endConversation() {
    if (!token || !sessionId) return;
    await fetch(`/api/chat/sessions/${sessionId}/close`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    setStage("closed");
    esRef.current?.close();
    clearSession();
  }

  function resetChat() {
    esRef.current?.close();
    clearSession();
    setStage("idle"); setName(""); setPhone(""); setOtp(""); setSessionId(null);
    setToken(null); setMessages([]); setInput(""); setError("");
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden flex-col items-end gap-3 sm:flex">
      {/* Chat panel */}
      {open && (
        <div
          className={`flex w-[340px] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-lg transition-all duration-300 ${
            minimised ? "h-0 overflow-hidden" : "h-[460px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3 shrink-0">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground">
                nanayawdev
              </p>
              <p className="text-[0.6rem] text-muted-foreground">Support Chat</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setMinimised((v) => !v)} aria-label="Minimise" className="text-muted-foreground hover:text-foreground">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => { setOpen(false); setMinimised(false); }} aria-label="Close" className="text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col overflow-hidden">

            {/* Stage: idle, start chat prompt */}
            {stage === "idle" && (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-sm font-semibold text-foreground">Start a live chat</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enter your phone number and I&apos;ll send you a one-time code to begin.
                </p>
                <button
                  onClick={() => setStage("phone")}
                  className="w-full rounded-full bg-foreground text-background py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-90"
                >
                  Start Chat
                </button>
              </div>
            )}

            {/* Stage: phone, enter name + phone number */}
            {stage === "phone" && (
              <div className="flex flex-1 flex-col justify-center gap-4 px-6">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Your details
                </p>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+233 XX XXX XXXX"
                  className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground"
                />
                {error && <p className="text-[0.6rem] text-red-500 uppercase tracking-widest">{error}</p>}
                <button
                  onClick={requestOtp}
                  disabled={loading || !phone.trim() || !name.trim()}
                  className="flex items-center justify-center rounded-full bg-[#cdf68c] text-[#0a291a] py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? <Spinner size="sm" className="text-[#0a291a]" /> : "Send Code"}
                </button>
              </div>
            )}

            {/* Stage: otp, enter code */}
            {stage === "otp" && (
              <div className="flex flex-1 flex-col justify-center gap-4 px-6">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Enter the 6-digit code sent to {phone}
                </p>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground tracking-[0.3em] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground"
                />
                {error && <p className="text-[0.6rem] text-red-500 uppercase tracking-widest">{error}</p>}
                <button
                  onClick={verifyOtp}
                  disabled={loading || otp.length < 6}
                  className="flex items-center justify-center rounded-lg bg-foreground text-background py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? <Spinner size="sm" className="text-background" /> : "Verify & Start Chat"}
                </button>
                <button onClick={() => { setStage("phone"); setError(""); }} className="text-[0.6rem] text-muted-foreground hover:text-foreground uppercase tracking-widest">
                  ← Change number
                </button>
              </div>
            )}

            {/* Stage: chat, live messages */}
            {(stage === "chat" || stage === "closed") && (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                  {messages.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center pt-4">
                      You&apos;re connected. Say hello!
                    </p>
                  )}
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-foreground text-background"
                          : "border border-border bg-muted text-foreground"
                      }`}>
                        {msg.body && <p className="whitespace-pre-wrap break-words">{linkify(msg.body)}</p>}
                        {msg.attachment_url && (
                          <a
                            href={msg.attachment_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`mt-1.5 flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 transition-opacity hover:opacity-80 ${
                              msg.sender === "user" ? "border-background/30" : "border-border"
                            }`}
                          >
                            <FileArrowDown className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{msg.attachment_name ?? "Download file"}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>

                {stage === "chat" ? (
                  <>
                    <div className="flex items-center gap-0 border-t border-border shrink-0">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type a message…"
                        className="flex-1 bg-transparent px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                      />
                      <button onClick={sendMessage} disabled={!input.trim()} aria-label="Send" className="rounded-lg px-3 py-2.5 text-muted-foreground hover:text-foreground disabled:opacity-40">
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="border-t border-border shrink-0">
                      <button onClick={endConversation} className="w-full py-2 text-[0.6rem] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                        End Conversation
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="border-t border-border px-4 py-3 shrink-0 flex items-center justify-between">
                    <p className="text-[0.6rem] text-muted-foreground uppercase tracking-widest">Conversation ended</p>
                    <button onClick={resetChat} className="text-[0.6rem] font-semibold uppercase tracking-widest text-foreground hover:opacity-70">
                      New Chat
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => { setOpen((v) => !v); setMinimised(false); }}
        aria-label="Let's Chat"
        className="group flex items-center gap-2.5 rounded-full border border-border bg-background px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground shadow-sm transition-all duration-200 hover:bg-foreground hover:text-background"
      >
        <Phone className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:rotate-12" />
        Let&apos;s Chat
      </button>
    </div>
  );
}
