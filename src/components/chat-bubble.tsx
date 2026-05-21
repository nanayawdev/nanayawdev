"use client";

import { useState, useRef, useEffect } from "react";
import { Phone, X, Send, Minus } from "lucide-react";

type Message = { id: number; from: "agent" | "user"; text: string };

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    from: "agent",
    text: "Hey 👋 Welcome to Devs & Creatives. How can we help you today?",
  },
];

export function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [minimised, setMinimised] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && !minimised) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, minimised]);

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: "user", text },
    ]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: "agent",
          text: "Thanks for reaching out! A team member will be with you shortly.",
        },
      ]);
    }, 900);
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
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground">
                Devs &amp; Creatives
              </p>
              <p className="text-[0.6rem] text-muted-foreground">
                Support Chat
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMinimised((v) => !v)}
                aria-label="Minimise chat"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[80%] px-3 py-2 text-xs leading-relaxed ${
                    msg.from === "user"
                      ? "bg-foreground text-background"
                      : "border border-border bg-muted text-foreground"
                  }`}
                >
                  {msg.text}
                </p>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-border px-3 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message…"
              className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              onClick={handleSend}
              aria-label="Send message"
              className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
              disabled={!input.trim()}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => {
          setOpen((v) => !v);
          setMinimised(false);
        }}
        aria-label="Speak to an Agent"
        className="group flex items-center gap-2.5 border border-border bg-background px-5 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground shadow-sm transition-all duration-200 hover:bg-foreground hover:text-background"
      >
        <Phone className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:rotate-12" />
        Speak to an Agent
      </button>
    </div>
  );
}
