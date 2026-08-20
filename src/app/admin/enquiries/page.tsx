"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  budget: string;
  message: string;
  status: string;
  created_at: string;
}

const STATUS_OPTIONS = ["new", "read", "replied"];

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selected, setSelected]   = useState<Enquiry | null>(null);
  const [smsText, setSmsText]     = useState("");
  const [smsSending, setSmsSending] = useState(false);
  const [smsResult, setSmsResult] = useState<"sent" | "error" | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody]       = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailResult, setEmailResult]   = useState<"sent" | "error" | null>(null);

  useEffect(() => {
    adminFetch("/api/admin/enquiries")
      .then((r) => r.json())
      .then((d) => setEnquiries(d.enquiries ?? []));
  }, []);

  async function updateStatus(id: string, status: string) {
    const res = await adminFetch("/api/admin/enquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    setEnquiries((prev) => prev.map((e) => (e.id === id ? data.enquiry : e)));
    if (selected?.id === id) setSelected(data.enquiry);
  }

  const statusColor: Record<string, string> = {
    new:     "bg-[#0a291a] text-white",
    read:    "bg-muted text-foreground",
    replied: "bg-foreground text-background",
  };

  return (
    <div className="flex gap-6 h-full max-w-6xl mx-auto">
      {/* List */}
      <div className="w-80 shrink-0 border border-border overflow-y-auto">
        <div className="border-b border-border px-5 py-4">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {enquiries.length} enquiries
          </p>
        </div>
        {enquiries.map((e) => (
          <button
            key={e.id}
            onClick={() => setSelected(e)}
            className={`w-full text-left border-b border-border px-5 py-4 transition-colors hover:bg-muted/30 ${
              selected?.id === e.id ? "bg-muted/40" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-sm font-semibold text-foreground truncate">{e.name}</p>
              <span className={`shrink-0 px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider ${statusColor[e.status] ?? "bg-muted"}`}>
                {e.status}
              </span>
            </div>
            <p className="text-[0.65rem] text-muted-foreground truncate">{e.email}</p>
            <p className="text-[0.65rem] text-muted-foreground mt-1 truncate">{e.message}</p>
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
            </div>
            <select
              value={selected.status}
              onChange={(e) => updateStatus(selected.id, e.target.value)}
              className="border border-border bg-background px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground focus:outline-none"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {selected.company && (
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1">Company</p>
                <p className="text-sm text-foreground">{selected.company}</p>
              </div>
            )}
            {selected.budget && (
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1">Budget</p>
                <p className="text-sm text-foreground">{selected.budget}</p>
              </div>
            )}
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1">Received</p>
              <p className="text-sm text-foreground">{new Date(selected.created_at).toLocaleString()}</p>
            </div>
          </div>

          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2">Message</p>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{selected.message}</p>
          </div>

          <div className="mt-8 flex flex-col gap-4">
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
                    if (res.ok) { setEmailSubject(""); setEmailBody(""); updateStatus(selected.id, "replied"); }
                  } catch { setEmailResult("error"); }
                  finally { setEmailSending(false); }
                }}
                className="mt-3 bg-foreground text-background px-6 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-90 disabled:opacity-50"
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
                      if (res.ok) { setSmsText(""); updateStatus(selected.id, "replied"); }
                    } catch { setSmsResult("error"); }
                    finally { setSmsSending(false); }
                  }}
                  className="bg-[#cdf68c] px-6 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[#0a291a] transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {smsSending ? "Sending…" : "Send SMS"}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          Select an enquiry to view details
        </div>
      )}
    </div>
  );
}
