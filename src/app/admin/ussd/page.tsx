"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";

interface SessionSummary {
  session_id: string;
  mobile: string;
  application_name: string | null;
  extension: string | null;
  started_at: string;
  last_at: string;
  turns: number;
  completed: boolean;
  last_message: string;
}

interface Turn {
  id: string;
  mobile: string;
  application_name: string | null;
  extension: string | null;
  step_before: string;
  input: string;
  message: string;
  continue_session: boolean;
  created_at: string;
}

export default function AdminUssdSessionsPage() {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [selected, setSelected] = useState<SessionSummary | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [loadingTurns, setLoadingTurns] = useState(false);

  useEffect(() => {
    adminFetch("/api/admin/ussd/sessions")
      .then((r) => r.json())
      .then((d) => setSessions(d.sessions ?? []));
  }, []);

  async function openSession(s: SessionSummary) {
    setSelected(s);
    setLoadingTurns(true);
    const res = await adminFetch(`/api/admin/ussd/sessions/${encodeURIComponent(s.session_id)}`);
    const data = await res.json();
    setTurns(data.turns ?? []);
    setLoadingTurns(false);
  }

  return (
    <div className="flex gap-6 h-full">
      {/* List */}
      <div className="w-96 shrink-0 rounded-lg border border-border overflow-y-auto">
        <div className="border-b border-border px-5 py-4">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {sessions.length} sessions
          </p>
        </div>
        {sessions.length === 0 && (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-muted-foreground">No USSD activity logged yet.</p>
          </div>
        )}
        {sessions.map((s) => (
          <button
            key={s.session_id}
            onClick={() => openSession(s)}
            className={`w-full text-left border-b border-border px-5 py-4 transition-colors hover:bg-muted/30 ${
              selected?.session_id === s.session_id ? "bg-muted/40" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-sm font-semibold text-foreground truncate">{s.mobile}</p>
              <span className={`shrink-0 px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider ${
                s.completed ? "bg-muted text-foreground" : "bg-[#cdf68c] text-[#0a291a]"
              }`}>
                {s.completed ? "Ended" : "In progress"}
              </span>
            </div>
            <p className="text-[0.65rem] text-muted-foreground truncate">{s.last_message}</p>
            <p className="text-[0.6rem] text-muted-foreground/70 mt-1">
              {s.turns} turn{s.turns === 1 ? "" : "s"} · {new Date(s.started_at).toLocaleString()}
              {s.extension && <span className="ml-1">· ext {s.extension}</span>}
            </p>
          </button>
        ))}
      </div>

      {/* Detail */}
      {selected ? (
        <div className="flex-1 rounded-lg border border-border p-8 overflow-y-auto">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">{selected.mobile}</h2>
              <p className="text-sm text-muted-foreground">
                Session {selected.session_id}
                {selected.application_name && <span> · {selected.application_name}</span>}
              </p>
            </div>
            <span className={`shrink-0 rounded-full px-3 py-1 text-[0.6rem] font-bold uppercase tracking-wider ${
              selected.completed ? "bg-muted text-foreground" : "bg-[#cdf68c] text-[#0a291a]"
            }`}>
              {selected.completed ? "Ended" : "In progress"}
            </span>
          </div>

          {loadingTurns && <p className="text-sm text-muted-foreground">Loading…</p>}

          <div className="space-y-4">
            {turns.map((t) => (
              <div key={t.id} className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {t.step_before}
                  </span>
                  <span className="text-[0.6rem] text-muted-foreground/70">{new Date(t.created_at).toLocaleTimeString()}</span>
                </div>
                {t.input && (
                  <p className="text-sm text-foreground mb-2">
                    <span className="text-muted-foreground">Caller typed: </span>
                    <span className="font-mono">{t.input}</span>
                  </p>
                )}
                <p className="text-sm text-foreground whitespace-pre-wrap">{t.message}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          Select a session to view its full conversation
        </div>
      )}
    </div>
  );
}
