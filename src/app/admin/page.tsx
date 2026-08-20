"use client";

import { useEffect, useState } from "react";
import { FileText, HelpCircle, Mail, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { MetricCard } from "@/components/admin/metric-card";
import { adminFetch } from "@/lib/admin-fetch";

interface Stats {
  enquiries: number;
  questions: number;
  subscribers: number;
  activeChats: number;
}

function useAdminFetch<T>(url: string, key: string): T | null {
  const [data, setData] = useState<T | null>(null);
  useEffect(() => {
    adminFetch(url)
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
    { label: "Enquiries",     value: stats.enquiries,   icon: FileText,      href: "/admin/enquiries" },
    { label: "FAQ Questions", value: stats.questions,   icon: HelpCircle,    href: "/admin/questions" },
    { label: "Subscribers",   value: stats.subscribers, icon: Mail,          href: "/admin/newsletter" },
    { label: "Active Chats",  value: stats.activeChats, icon: MessageSquare, href: "/admin/chat" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader eyebrow="Overview" title="Dashboard" description="Your site at a glance." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, icon, href }) => (
          <MetricCard key={label} label={label} value={value} icon={icon} href={href} />
        ))}
      </div>
    </div>
  );
}
