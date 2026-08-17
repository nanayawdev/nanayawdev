import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SurfacePanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6", className)}>
      {children}
    </div>
  );
}
