"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon as ArrowLeft } from "@phosphor-icons/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminFetch } from "@/lib/admin-fetch";

interface GroundReport {
  id: string;
  kind: "issue" | "assistance";
  category: string;
  description: string;
  phone: string;
  ticket_number: string;
  status: string;
  created_at: string;
}

interface LostFoundItem {
  id: string;
  kind: "lost" | "found";
  description: string;
  phone: string;
  status: string;
  created_at: string;
}

const REPORT_STATUS_OPTIONS = ["open", "in_progress", "resolved"];
const LOST_FOUND_STATUS_OPTIONS = ["open", "resolved"];

const STATUS_STYLE: Record<string, string> = {
  open: "border-[#cdf68c] text-[#5a7a2e]",
  in_progress: "border-blue-400 text-blue-500",
  resolved: "border-green-500 text-green-600",
};

export default function EventGroundsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [tab, setTab] = useState<"reports" | "lost-found">("reports");
  const [eventTitle, setEventTitle] = useState("");
  const [reports, setReports] = useState<GroundReport[]>([]);
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [eventRes, reportsRes, itemsRes] = await Promise.all([
        adminFetch(`/api/admin/events/${id}`),
        adminFetch(`/api/admin/events/${id}/ground-reports`),
        adminFetch(`/api/admin/events/${id}/lost-found`),
      ]);
      setEventTitle((await eventRes.json()).event?.title ?? "Event");
      setReports((await reportsRes.json()).reports ?? []);
      setItems((await itemsRes.json()).items ?? []);
      setLoading(false);
    })();
  }, [id]);

  async function updateReportStatus(reportId: string, status: string) {
    const res = await adminFetch(`/api/admin/events/${id}/ground-reports/${reportId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
    });
    if (res.ok) setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status } : r)));
  }

  async function updateItemStatus(itemId: string, status: string) {
    const res = await adminFetch(`/api/admin/events/${id}/lost-found/${itemId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
    });
    if (res.ok) setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, status } : i)));
  }

  const openReportsCount = reports.filter((r) => r.status !== "resolved").length;
  const openItemsCount = items.filter((i) => i.status !== "resolved").length;

  return (
    <div>
      <button onClick={() => router.push("/admin/events")} className="mb-6 flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Events
      </button>

      <h1 className="text-2xl font-bold tracking-tight mb-1">{eventTitle} — Grounds</h1>
      <p className="text-sm text-muted-foreground mb-8">Issues, assistance requests, and lost &amp; found reports logged via USSD.</p>

      <div className="flex items-center gap-2 mb-6 border-b border-border">
        <button
          onClick={() => setTab("reports")}
          className={`px-4 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] border-b-2 -mb-px transition-colors ${tab === "reports" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Reports & Assistance ({openReportsCount} open)
        </button>
        <button
          onClick={() => setTab("lost-found")}
          className={`px-4 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] border-b-2 -mb-px transition-colors ${tab === "lost-found" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Lost &amp; Found ({openItemsCount} open)
        </button>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {!loading && tab === "reports" && (
        reports.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-20 text-center">
            <p className="text-muted-foreground text-sm">No reports yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {reports.map((r) => (
              <div key={r.id} className="flex items-center gap-4 rounded-lg border border-border px-5 py-4 bg-background">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {r.category} <span className="text-muted-foreground font-normal">· {r.kind === "issue" ? "Issue" : "Assistance"}</span>
                  </p>
                  <p className="text-[0.65rem] text-muted-foreground mt-0.5">{r.description || "(no description)"}</p>
                  <p className="text-[0.6rem] text-muted-foreground/70 uppercase tracking-widest mt-1">{r.phone} · Ref {r.ticket_number}</p>
                </div>
                <Select value={r.status} onValueChange={(value) => updateReportStatus(r.id, value)}>
                  <SelectTrigger className={`w-36 shrink-0 rounded-lg border px-3 py-2 h-auto text-[0.65rem] font-semibold uppercase tracking-[0.18em] focus:outline-none ${STATUS_STYLE[r.status] ?? "border-border"}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        )
      )}

      {!loading && tab === "lost-found" && (
        items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-20 text-center">
            <p className="text-muted-foreground text-sm">No lost &amp; found reports yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((i) => (
              <div key={i.id} className="flex items-center gap-4 rounded-lg border border-border px-5 py-4 bg-background">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate capitalize">{i.kind} Item</p>
                  <p className="text-[0.65rem] text-muted-foreground mt-0.5">{i.description}</p>
                  <p className="text-[0.6rem] text-muted-foreground/70 uppercase tracking-widest mt-1">{i.phone}</p>
                </div>
                <Select value={i.status} onValueChange={(value) => updateItemStatus(i.id, value)}>
                  <SelectTrigger className={`w-32 shrink-0 rounded-lg border px-3 py-2 h-auto text-[0.65rem] font-semibold uppercase tracking-[0.18em] focus:outline-none ${STATUS_STYLE[i.status] ?? "border-border"}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOST_FOUND_STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
