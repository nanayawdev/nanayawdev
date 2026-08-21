"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";

interface Question {
  id: string;
  name: string;
  email: string;
  phone: string;
  question: string;
  answered: boolean;
  created_at: string;
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected]   = useState<Question | null>(null);
  const [smsText, setSmsText]     = useState("");
  const [smsSending, setSmsSending] = useState(false);
  const [smsResult, setSmsResult] = useState<"sent" | "error" | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody]       = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailResult, setEmailResult]   = useState<"sent" | "error" | null>(null);

  useEffect(() => {
    adminFetch("/api/admin/questions")
      .then((r) => r.json())
      .then((d) => setQuestions(d.questions ?? []));
  }, []);

  async function toggleAnswered(q: Question) {
    const res = await adminFetch("/api/admin/questions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: q.id, answered: !q.answered }),
    });
    const data = await res.json();
    setQuestions((prev) => prev.map((item) => (item.id === q.id ? data.question : item)));
    if (selected?.id === q.id) setSelected(data.question);
  }

  return (
    <div className="flex gap-6 h-full">
      {/* List */}
      <div className="w-80 shrink-0 border border-border overflow-y-auto">
        <div className="border-b border-border px-5 py-4">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {questions.length} questions
          </p>
        </div>
        {questions.map((q) => (
          <button
            key={q.id}
            onClick={() => setSelected(q)}
            className={`w-full text-left border-b border-border px-5 py-4 transition-colors hover:bg-muted/30 ${
              selected?.id === q.id ? "bg-muted/40" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-sm font-semibold text-foreground truncate">{q.name}</p>
              {q.answered && (
                <span className="shrink-0 px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider bg-foreground text-background">
                  Answered
                </span>
              )}
            </div>
            <p className="text-[0.65rem] text-muted-foreground mt-1 line-clamp-2">{q.question}</p>
          </button>
        ))}
      </div>

      {/* Detail */}
      {selected ? (
        <div className="flex-1 border border-border p-8 overflow-y-auto">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">{selected.name}</h2>
              <p className="text-sm text-muted-foreground">{selected.email}</p>
              <p className="text-[0.65rem] text-muted-foreground mt-1">
                {new Date(selected.created_at).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => toggleAnswered(selected)}
              className={`rounded-full px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-90 ${
                selected.answered
                  ? "bg-muted text-foreground border border-border"
                  : "bg-foreground text-background"
              }`}
            >
              {selected.answered ? "Mark Unanswered" : "Mark Answered"}
            </button>
          </div>

          <div className="border border-border p-6">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Question</p>
            <p className="text-base text-foreground leading-relaxed">{selected.question}</p>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {/* Email composer */}
            <div className="border border-border p-4">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
                Reply via Email → {selected.email}
              </p>
              <div className="space-y-3">
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground"
                />
                <textarea
                  rows={4}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder={`Hi ${selected.name.split(" ")[0]},\n\n`}
                  className="w-full resize-none border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              </div>
              {emailResult === "sent" && <p className="text-[0.65rem] text-green-600 uppercase tracking-widest mt-2 mb-2">Email sent!</p>}
              {emailResult === "error" && <p className="text-[0.65rem] text-red-500 uppercase tracking-widest mt-2 mb-2">Failed to send email.</p>}
              <button
                disabled={emailSending || !emailSubject.trim() || !emailBody.trim()}
                onClick={async () => {
                  setEmailSending(true); setEmailResult(null);
                  try {
                    const res = await adminFetch("/api/admin/email", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ to: selected.email, subject: emailSubject, message: emailBody }),
                    });
                    setEmailResult(res.ok ? "sent" : "error");
                    if (res.ok) { setEmailSubject(""); setEmailBody(""); }
                  } catch { setEmailResult("error"); }
                  finally { setEmailSending(false); }
                }}
                className="mt-3 rounded-full bg-foreground text-background px-6 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {emailSending ? "Sending…" : "Send Email"}
              </button>
            </div>

            {selected.phone && (
              <div className="border border-border p-4">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
                  Reply via SMS → {selected.phone}
                </p>
                <textarea
                  rows={3}
                  value={smsText}
                  onChange={(e) => setSmsText(e.target.value)}
                  placeholder="Type your SMS reply…"
                  className="w-full resize-none border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground mb-3"
                />
                {smsResult === "sent" && <p className="text-[0.65rem] text-green-600 uppercase tracking-widest mb-2">SMS sent!</p>}
                {smsResult === "error" && <p className="text-[0.65rem] text-red-500 uppercase tracking-widest mb-2">Failed to send SMS.</p>}
                <button
                  disabled={smsSending || !smsText.trim()}
                  onClick={async () => {
                    setSmsSending(true); setSmsResult(null);
                    try {
                      const res = await adminFetch("/api/admin/sms", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ phone: selected.phone, message: smsText }),
                      });
                      setSmsResult(res.ok ? "sent" : "error");
                      if (res.ok) setSmsText("");
                    } catch { setSmsResult("error"); }
                    finally { setSmsSending(false); }
                  }}
                  className="rounded-full bg-[#cdf68c] px-6 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#0a291a] transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {smsSending ? "Sending…" : "Send SMS"}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          Select a question to view details
        </div>
      )}
    </div>
  );
}
