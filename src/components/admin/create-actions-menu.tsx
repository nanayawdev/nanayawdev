import Link from "next/link";
import { PlusIcon as Plus, CaretDownIcon as CaretDown } from "@phosphor-icons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const createLinks = [
  { label: "New Blog Post", href: "/admin/blog" },
  { label: "New Project", href: "/admin/projects" },
  { label: "New Case Study", href: "/admin/case-studies" },
  { label: "New Testimonial", href: "/admin/testimonials" },
  { label: "New Service", href: "/admin/services" },
  { label: "New App", href: "/admin/apps" },
  { label: "New Team Member", href: "/admin/team" },
];

export function CreateActionsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-90">
        <Plus className="h-3.5 w-3.5" weight="bold" />
        Create
        <CaretDown className="h-3 w-3" weight="bold" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {createLinks.map(({ label, href }) => (
          <DropdownMenuItem key={label} asChild>
            <Link href={href}>{label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
