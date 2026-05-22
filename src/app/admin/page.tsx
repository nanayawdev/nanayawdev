"use client";

import { useEffect, useState } from "react";
import { FileText, HelpCircle, Mail, MessageSquare } from "lucide-react";

interface Stats {
  enquiries: number;
  questions: number;
  subscribers: number;
  activeChats: number;
}

function useAdminFetch<T>(url: string, key: string): T | null {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setData(d[key]))
      .catch(() => {});
  }, [url, key]);
  return data;
}

export default function AdminDashboard() {
  const enquiries   = useAdminFetch<unknown[]>("/api/admin/enquiries", "enquiries");
  const questions   = useAdminFetch<unknown[]>("/api/admin/questions", "questions");
  const subscribers = useAdminFetch<unknown[]>("/api/admin/subscribers", "subscribers");
  const chats       = useAdminFetch<{ status: string }[]>("/api/admin/chat/sessions?status=active", "sessions");

  const stats: Stats = {
    enquiries:   enquiries?.length ?? 0,
    questions:   questions?.length ?? 0,
    subscribers: subscribers?.length ?? 0,
    activeChats: chats?.length ?? 0,
  };

  const cards = [
    { label: "Enquiries",       value: stats.enquiries,   icon: FileText,       href: "/admin/enquiries" },
    { label: "FAQ Questions",   value: stats.questions,   icon: HelpCircle,     href: "/admin/questions" },
    { label: "Subscribers",     value: stats.subscribers, icon: Mail,           href: "/admin/newsletter" },
    { label: "Active Chats",    value: stats.activeChats, icon: MessageSquare,  href: "/admin/chat" },
  ];

  return (
    <div>
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1">
        Overview
      </p>
      <h1 className="text-3xl font-bold text-foreground mb-10">Dashboard</h1>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, href }) => (
          <a
            key={label}
            href={href}
            className="border border-border p-6 hover:bg-muted/30 transition-colors"
          >
            <Icon className="h-5 w-5 text-muted-foreground mb-4" />
            <p className="text-3xl font-bold text-foreground">{value}</p>
            <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {label}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
