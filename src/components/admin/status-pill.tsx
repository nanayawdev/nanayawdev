import type { ReactNode } from "react";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "info" | "neutral" | "brand";

const TONE_STYLES: Record<Tone, string> = {
  success: "bg-emerald-500/10 text-emerald-400",
  warning: "bg-amber-500/10 text-amber-400",
  danger: "bg-red-500/10 text-red-400",
  info: "bg-sky-500/10 text-sky-400",
  neutral: "bg-muted text-muted-foreground",
  brand: "bg-primary/10 text-primary",
};

const SUCCESS_WORDS = ["paid", "active", "published", "completed", "resolved", "approved", "sent"];
const WARNING_WORDS = ["pending", "draft", "processing", "waiting"];
const DANGER_WORDS = ["cancelled", "canceled", "failed", "expired", "rejected", "unread"];

function inferTone(value: ReactNode): Tone {
  const text = typeof value === "string" ? value.toLowerCase() : "";
  if (SUCCESS_WORDS.some((w) => text.includes(w))) return "success";
  if (WARNING_WORDS.some((w) => text.includes(w))) return "warning";
  if (DANGER_WORDS.some((w) => text.includes(w))) return "danger";
  return "neutral";
}

interface StatusPillProps {
  children: ReactNode;
  tone?: Tone;
  icon?: boolean;
  className?: string;
}

export function StatusPill({ children, tone, icon = true, className }: StatusPillProps) {
  const resolvedTone = tone ?? inferTone(children);
  const Icon =
    resolvedTone === "success" ? CheckCircle2 : resolvedTone === "danger" ? XCircle : Clock;

  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-full px-2.5 text-xs font-medium",
        TONE_STYLES[resolvedTone],
        className
      )}
    >
      {icon && <Icon className="size-3" />}
      {children}
    </span>
  );
}
