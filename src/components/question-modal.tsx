"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface QuestionModalProps {
  open: boolean;
  onClose: () => void;
}

export function QuestionModal({ open, onClose }: QuestionModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [question, setQuestion] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setSubmitted(false);
      setName("");
      setEmail("");
      setPhone("");
      setQuestion("");
    }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setApiError("");
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: phone || undefined, question }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && createPortal(
        <>
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            className="fixed inset-0 z-[1000] bg-foreground/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed inset-x-4 bottom-0 z-[1001] border border-border bg-background sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-border px-6 py-5">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Got a question?
                </p>
                <h2 className="mt-1 text-xl font-bold leading-snug text-foreground">
                  Send us a message
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="ml-4 mt-0.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="py-8 text-center"
                >
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#FD4912] mb-3">
                    Message received
                  </p>
                  <p className="text-base font-semibold text-foreground mb-2">
                    We&apos;ll get back to you within 24 hours.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Keep an eye on your inbox.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Phone <span className="normal-case tracking-normal text-muted-foreground/50">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+233 XX XXX XXXX"
                      className="w-full border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Your Question
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="What would you like to know?"
                      className="w-full resize-none border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground"
                    />
                  </div>
                  {apiError && (
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-red-500">
                      {apiError}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#FD4912] px-6 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? "Sending…" : "Send Question"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>,
        document.body
      )}
    </AnimatePresence>
  );
}
