"use client";

import { useState, useRef, useEffect } from "react";
import { Phone, X, Send, Minus } from "lucide-react";

type Stage = "idle" | "phone" | "otp" | "chat" | "closed";
type Message = { id: string; sender: "agent" | "user"; body: string; created_at: string };

const STORAGE_KEY = "arssent_chat_session";

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
          className={`flex w-[340px] flex-col border border-border bg-background shadow-lg transition-all duration-300 ${
            minimised ? "h-0 overflow-hidden" : "h-[460px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3 shrink-0">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground">
                Arssent
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

            {/* — Stage: idle — start chat prompt */}
            {stage === "idle" && (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-sm font-semibold text-foreground">Start a live chat</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enter your phone number and we&apos;ll send you a one-time code to begin.
                </p>
                <button
                  onClick={() => setStage("phone")}
                  className="w-full bg-foreground text-background py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-90"
                >
                  Start Chat
                </button>
              </div>
            )}

            {/* — Stage: phone — enter name + phone number */}
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
                  className="border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+233 XX XXX XXXX"
                  className="border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground"
                />
                {error && <p className="text-[0.6rem] text-red-500 uppercase tracking-widest">{error}</p>}
                <button
                  onClick={requestOtp}
                  disabled={loading || !phone.trim() || !name.trim()}
                  className="bg-[#FD4912] text-white py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "Sending…" : "Send Code"}
                </button>
              </div>
            )}

            {/* — Stage: otp — enter code */}
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
                  className="border border-border bg-background px-4 py-2.5 text-sm text-foreground tracking-[0.3em] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground"
                />
                {error && <p className="text-[0.6rem] text-red-500 uppercase tracking-widest">{error}</p>}
                <button
                  onClick={verifyOtp}
                  disabled={loading || otp.length < 6}
                  className="bg-foreground text-background py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "Verifying…" : "Verify & Start Chat"}
                </button>
                <button onClick={() => { setStage("phone"); setError(""); }} className="text-[0.6rem] text-muted-foreground hover:text-foreground uppercase tracking-widest">
                  ← Change number
                </button>
              </div>
            )}

            {/* — Stage: chat — live messages */}
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
                      <p className={`max-w-[80%] px-3 py-2 text-xs leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-foreground text-background"
                          : "border border-border bg-muted text-foreground"
                      }`}>
                        {msg.body}
                      </p>
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
                      <button onClick={sendMessage} disabled={!input.trim()} aria-label="Send" className="px-3 py-2.5 text-muted-foreground hover:text-foreground disabled:opacity-40">
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
        aria-label="Speak to an Agent"
        className="group flex items-center gap-2.5 border border-border bg-background px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground shadow-sm transition-all duration-200 hover:bg-foreground hover:text-background"
      >
        <Phone className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:rotate-12" />
        Speak to an Agent
      </button>
    </div>
  );
}
