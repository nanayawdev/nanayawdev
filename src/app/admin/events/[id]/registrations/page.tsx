"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon as ArrowLeft } from "@phosphor-icons/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminFetch } from "@/lib/admin-fetch";

interface Registration {
  id: string;
  name: string | null;
  phone: string;
  email: string | null;
  quantity: number;
  amount_paid: string;
  source: "web" | "ussd";
  status: string;
  payment_status: string;
  ticket_code: string | null;
  ticket_type: string;
  payment_method: string | null;
  checked_in: boolean;
  checked_in_at: string | null;
  created_at: string;
}

const STATUS_OPTIONS = ["pending", "confirmed", "cancelled", "failed"];

const STATUS_STYLE: Record<string, string> = {
  confirmed: "border-green-500 text-green-600",
  pending: "border-[#cdf68c] text-[#5a7a2e]",
  cancelled: "border-border text-muted-foreground",
  failed: "border-red-400 text-red-500",
};

export default function EventRegistrationsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [eventTitle, setEventTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [eventRes, regRes] = await Promise.all([
        adminFetch(`/api/admin/events/${id}`),
        adminFetch(`/api/admin/events/${id}/registrations`),
      ]);
      const eventData = await eventRes.json();
      const regData = await regRes.json();
      setEventTitle(eventData.event?.title ?? "Event");
      setRegistrations(regData.registrations ?? []);
      setLoading(false);
    })();
  }, [id]);

  async function updateStatus(regId: string, status: string) {
    const res = await adminFetch(`/api/admin/events/${id}/registrations/${regId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setRegistrations((prev) => prev.map((r) => (r.id === regId ? { ...r, status } : r)));
    }
  }

  function exportCsv() {
    const header = ["Name", "Phone", "Email", "Ticket Type", "Ticket Code", "Source", "Status", "Payment", "Amount Paid", "Checked In", "Registered At"];
    const rows = registrations.map((r) => [
      r.name ?? "", r.phone, r.email ?? "", r.ticket_type, r.ticket_code ?? "", r.source, r.status, r.payment_status,
      r.amount_paid, r.checked_in ? "Yes" : "No", r.created_at,
    ]);
    const csv = [header, ...rows].map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${eventTitle.replace(/\s+/g, "-").toLowerCase()}-registrations.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <button onClick={() => router.push("/admin/events")} className="mb-6 flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Events
      </button>

      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{eventTitle} — Registrations</h1>
          <p className="text-sm text-muted-foreground mt-1">{registrations.length} total</p>
        </div>
        {registrations.length > 0 && (
          <button onClick={exportCsv} className="rounded-full border border-border px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] hover:bg-muted transition-colors">
            Export CSV
          </button>
        )}
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

      {!loading && registrations.length === 0 && (
        <div className="rounded-lg border border-dashed border-border py-20 text-center">
          <p className="text-muted-foreground text-sm">No registrations yet — web or USSD.</p>
        </div>
      )}

      <div className="space-y-2">
        {registrations.map((r) => (
          <div key={r.id} className="flex items-center gap-4 rounded-lg border border-border px-5 py-4 bg-background">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {r.name || "(name pending)"}
                {r.checked_in && <span className="ml-2 rounded-full bg-[#cdf68c] px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider text-[#0a291a]">Checked In</span>}
              </p>
              <p className="text-[0.65rem] text-muted-foreground uppercase tracking-widest mt-0.5">
                {r.phone}
                {r.email && <span className="ml-2">{r.email}</span>}
                <span className="ml-2 rounded border border-border/60 px-1.5 py-0.5">{r.source}</span>
                <span className="ml-2">{r.ticket_type} x{r.quantity}</span>
                {r.ticket_code && <span className="ml-2 font-mono">{r.ticket_code}</span>}
              </p>
            </div>
            {Number(r.amount_paid) > 0 && (
              <span className="text-xs text-muted-foreground shrink-0">GHS {Number(r.amount_paid).toFixed(2)}</span>
            )}
            <span className={`shrink-0 text-[0.6rem] font-semibold uppercase tracking-[0.18em] rounded-lg px-2.5 py-1 border ${STATUS_STYLE[r.payment_status] ?? "border-border text-muted-foreground"}`}>
              {r.payment_status}
            </span>
            <Select value={r.status} onValueChange={(value) => updateStatus(r.id, value)}>
              <SelectTrigger className="w-36 shrink-0 rounded-lg border border-border bg-background px-3 py-2 h-auto text-[0.65rem] font-semibold uppercase tracking-[0.18em] focus:outline-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}
