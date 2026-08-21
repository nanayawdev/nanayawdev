"use client";

import { DotsThreeIcon as MoreHorizontal } from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface RowAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

/** Kebab-menu of row/card actions (edit, publish, delete, ...), used across admin list pages. */
export function RowActions({ actions }: { actions: RowAction[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Actions"
          onClick={(e) => e.stopPropagation()}
          className="flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {actions.map((a) => (
          <DropdownMenuItem
            key={a.label}
            onSelect={a.onClick}
            disabled={a.disabled}
            variant={a.destructive ? "destructive" : "default"}
          >
            <a.icon className="h-3.5 w-3.5" />
            {a.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
