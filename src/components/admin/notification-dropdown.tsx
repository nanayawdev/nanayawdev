"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BellIcon as Bell,
  FileTextIcon as FileText,
  SealQuestionIcon as HelpCircle,
  ChatTextIcon as MessageSquare,
} from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminFetch } from "@/lib/admin-fetch";

type NotificationType = "enquiry" | "question" | "chat";

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  excerpt: string;
  href: string;
  created_at: string;
}

const TYPE_ICON: Record<NotificationType, typeof FileText> = {
  enquiry: FileText,
  question: HelpCircle,
  chat: MessageSquare,
};

const TYPE_LABEL: Record<NotificationType, string> = {
  enquiry: "New enquiry",
  question: "New question",
  chat: "Awaiting reply",
};

const POLL_INTERVAL_MS = 30_000;

function timeAgo(iso: string): string {
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationDropdown() {
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await adminFetch("/api/admin/notifications");
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setItems(data.items ?? []);
        setTotal(data.total ?? 0);
      } catch {
        // silent, next poll will retry
      }
    }

    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={total > 0 ? `Notifications (${total} unread)` : "Notifications"}
          className="relative flex size-8 items-center justify-center rounded-full border border-border/60 bg-muted/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="h-4 w-4" weight="duotone" />
          {total > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#cdf68c] px-1 text-[0.6rem] font-bold text-[#0a291a]">
              {total > 9 ? "9+" : total}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Inbox</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">You&apos;re all caught up.</p>
        )}
        {items.map((item) => {
          const Icon = TYPE_ICON[item.type];
          return (
            <DropdownMenuItem
              key={`${item.type}-${item.id}`}
              className="flex items-start gap-2.5 py-2.5"
              onSelect={() => router.push(item.href)}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" weight="duotone" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-semibold text-foreground">{item.title}</p>
                  <span className="shrink-0 text-[0.6rem] text-muted-foreground">{timeAgo(item.created_at)}</span>
                </div>
                <p className="truncate text-[0.65rem] text-muted-foreground">{TYPE_LABEL[item.type]}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{item.excerpt}</p>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
