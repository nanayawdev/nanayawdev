"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";

interface Subscriber {
  id: number;
  email: string;
  active: boolean;
  subscribed_at: string;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    adminFetch("/api/admin/subscribers")
      .then((r) => r.json())
      .then((d) => setSubscribers(d.subscribers ?? []));
  }, []);

  async function toggleActive(s: Subscriber) {
    const res = await adminFetch("/api/admin/subscribers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: s.id, active: !s.active }),
    });
    const data = await res.json();
    setSubscribers((prev) => prev.map((item) => (item.id === s.id ? data.subscriber : item)));
  }

  const active   = subscribers.filter((s) => s.active).length;
  const inactive = subscribers.filter((s) => !s.active).length;

  return (
    <div>
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1">Newsletter</p>
      <h1 className="text-3xl font-bold text-foreground mb-8">Subscribers</h1>

      {/* Stats */}
      <div className="flex gap-4 mb-8">
        <div className="border border-border px-6 py-4">
          <p className="text-2xl font-bold text-foreground">{active}</p>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mt-1">Active</p>
        </div>
        <div className="border border-border px-6 py-4">
          <p className="text-2xl font-bold text-foreground">{inactive}</p>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mt-1">Unsubscribed</p>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border">
        <div className="grid grid-cols-[1fr_160px_120px] border-b border-border px-5 py-3 bg-muted/20">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Email</p>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Subscribed</p>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Status</p>
        </div>
        {subscribers.map((s) => (
          <div
            key={s.id}
            className="grid grid-cols-[1fr_160px_120px] items-center border-b border-border px-5 py-3 last:border-0"
          >
            <p className="text-sm text-foreground">{s.email}</p>
            <p className="text-[0.65rem] text-muted-foreground">
              {new Date(s.subscribed_at).toLocaleDateString()}
            </p>
            <button
              onClick={() => toggleActive(s)}
              className={`justify-self-start rounded-full px-3 py-1 text-[0.55rem] font-bold uppercase tracking-wider transition-opacity hover:opacity-80 ${
                s.active ? "bg-foreground text-background" : "bg-muted text-muted-foreground border border-border"
              }`}
            >
              {s.active ? "Active" : "Inactive"}
            </button>
          </div>
        ))}
        {subscribers.length === 0 && (
          <p className="px-5 py-8 text-sm text-muted-foreground text-center">No subscribers yet</p>
        )}
      </div>
    </div>
  );
}
