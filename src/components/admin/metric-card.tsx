import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  caption?: string;
  icon?: ComponentType<{ className?: string }>;
  href?: string;
  tone?: string;
}

export function MetricCard({ label, value, caption, icon: Icon, href, tone }: MetricCardProps) {
  const Comp = href ? "a" : "div";

  return (
    <Comp
      {...(href ? { href } : {})}
      className={cn(
        "block rounded-[var(--radius)] bg-card p-5 shadow-sm ring-1 ring-foreground/10 transition-colors",
        href && "hover:bg-muted/40"
      )}
    >
      {Icon && (
        <div
          className={cn(
            "mb-4 flex size-9 items-center justify-center rounded-lg",
            tone ?? "bg-primary/10 text-primary"
          )}
        >
          <Icon className="size-4" />
        </div>
      )}
      <p className="text-[2.25rem] font-semibold leading-none tracking-tight">{value}</p>
      <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      {caption && <p className="mt-1 text-xs text-muted-foreground">{caption}</p>}
    </Comp>
  );
}
