"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  HelpCircle,
  Mail,
  MessageSquare,
  PenLine,
  FolderKanban,
  BookOpen,
  Layers,
  Users,
  Quote,
  Blocks,
  Smartphone,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const NAV_GROUPS = [
  {
    label: "Main",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Inbox",
    items: [
      { href: "/admin/enquiries", label: "Enquiries", icon: FileText },
      { href: "/admin/questions", label: "Questions", icon: HelpCircle },
      { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
      { href: "/admin/chat", label: "Live Chat", icon: MessageSquare },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/blog", label: "Blog", icon: PenLine },
      { href: "/admin/components", label: "Components", icon: Blocks },
      { href: "/admin/projects", label: "Projects", icon: FolderKanban },
      { href: "/admin/apps", label: "Apps", icon: Smartphone },
      { href: "/admin/case-studies", label: "Case Studies", icon: BookOpen },
      { href: "/admin/services", label: "Services", icon: Layers },
      { href: "/admin/team", label: "Team", icon: Users },
      { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="h-16 justify-center border-b border-sidebar-border/60 px-3">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary">
            <Image src="/logo.png" alt="" width={20} height={20} className="object-contain" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-medium">nanayawdev</p>
            <p className="truncate text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton asChild isActive={active} tooltip={label}>
                      <Link href={href}>
                        <Icon strokeWidth={active ? 2 : 1.5} />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
