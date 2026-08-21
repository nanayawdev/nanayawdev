"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { FileTextIcon as FileText, SealQuestionIcon as HelpCircle, EnvelopeSimpleIcon as Mail, ChatTextIcon as MessageSquare } from "@phosphor-icons/react";

export interface ActivityPoint {
  date: string;
  count: number;
}

export interface DashboardStats {
  enquiries: number;
  questions: number;
  subscribers: number;
  activeChats: number;
}

interface ActivityOverviewProps {
  businessName: string;
  stats: DashboardStats;
  activity: ActivityPoint[];
  lastEnquiryAt: string | null;
}

function relativeDay(iso: string | null) {
  if (!iso) return "No enquiries yet";
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return "Last enquiry received today";
  if (days === 1) return "Last enquiry received yesterday";
  return `Last enquiry received ${days} days ago`;
}

export function ActivityOverview({ businessName, stats, activity, lastEnquiryAt }: ActivityOverviewProps) {
  const total = activity.reduce((sum, p) => sum + p.count, 0);

  const breakdown = [
    { label: "Enquiries", value: stats.enquiries, icon: FileText },
    { label: "Subscribers", value: stats.subscribers, icon: Mail },
    { label: "Active Chats", value: stats.activeChats, icon: MessageSquare },
    { label: "FAQ Questions", value: stats.questions, icon: HelpCircle },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {businessName}
          </p>
          <p className="mt-3 text-5xl font-semibold tracking-tight text-foreground">{total}</p>
          <p className="mt-1 text-sm text-muted-foreground">Total interactions in the last 14 days</p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            {breakdown.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2.5">
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-lg font-semibold leading-none text-foreground">{value}</p>
                  <p className="mt-1 text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex min-h-[160px] flex-col justify-between">
          <div className="h-[160px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activity} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#cdf68c" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#cdf68c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#cdf68c"
                  strokeWidth={2}
                  fill="url(#activityFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {relativeDay(lastEnquiryAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
