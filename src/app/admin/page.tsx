"use client";

import { useEffect, useState } from "react";
import { CreateActionsMenu } from "@/components/admin/create-actions-menu";
import { EnquiryListCard, type DashboardEnquiry } from "@/components/admin/enquiry-list-card";
import { SetupBanner } from "@/components/admin/setup-banner";
import { QuickActions } from "@/components/admin/quick-actions";
import { ActivityOverview, type ActivityPoint, type DashboardStats } from "@/components/admin/activity-overview";
import { PageHeader } from "@/components/admin/page-header";
import { adminFetch } from "@/lib/admin-fetch";
import Link from "next/link";

interface Question {
  answered: boolean;
  created_at: string;
}

interface Subscriber {
  subscribed_at: string;
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

function buildActivity(enquiries: DashboardEnquiry[], subscribers: Subscriber[]): ActivityPoint[] {
  const days = 14;
  const buckets = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const { created_at } of enquiries) {
    const key = created_at.slice(0, 10);
    if (buckets.has(key)) buckets.set(key, buckets.get(key)! + 1);
  }
  for (const { subscribed_at } of subscribers) {
    const key = subscribed_at.slice(0, 10);
    if (buckets.has(key)) buckets.set(key, buckets.get(key)! + 1);
  }
  return Array.from(buckets, ([date, count]) => ({ date, count }));
}

export default function AdminDashboard() {
  const enquiries   = useAdminFetch<DashboardEnquiry[]>("/api/admin/enquiries", "enquiries");
  const questions   = useAdminFetch<Question[]>("/api/admin/questions", "questions");
  const subscribers = useAdminFetch<Subscriber[]>("/api/admin/subscribers", "subscribers");
  const chats       = useAdminFetch<{ status: string }[]>("/api/admin/chat/sessions?status=active", "sessions");

  const stats: DashboardStats = {
    enquiries:   enquiries?.length ?? 0,
    questions:   questions?.length ?? 0,
    subscribers: subscribers?.length ?? 0,
    activeChats: chats?.length ?? 0,
  };

  const newEnquiries         = enquiries?.filter((e) => e.status === "new").length ?? 0;
  const unansweredQuestions  = questions?.filter((q) => !q.answered).length ?? 0;
  const recentEnquiries      = enquiries?.slice(0, 4) ?? [];
  const activity             = buildActivity(enquiries ?? [], subscribers ?? []);

  return (
    <div className="space-y-12">
      <PageHeader
        eyebrow="Overview"
        title="Hi Nana, welcome back"
        description="Choose a quick action to manage your site, or check activity above."
        actions={<CreateActionsMenu />}
      />

      <SetupBanner newEnquiries={newEnquiries} unansweredQuestions={unansweredQuestions} />

      <ActivityOverview
        businessName="nanayawdev"
        stats={stats}
        activity={activity}
        lastEnquiryAt={enquiries?.[0]?.created_at ?? null}
      />

      <div>
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">Recent enquiries</h3>
          <Link href="/admin/enquiries" className="text-sm text-foreground underline underline-offset-4">
            See all
          </Link>
        </div>

        {recentEnquiries.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No enquiries yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {recentEnquiries.map((enquiry) => (
              <EnquiryListCard key={enquiry.id} enquiry={enquiry} />
            ))}
          </div>
        )}
      </div>

      <QuickActions />
    </div>
  );
}
