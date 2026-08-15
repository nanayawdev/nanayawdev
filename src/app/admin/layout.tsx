"use client";

import { useEffect, useState } from "react";
import { ConfirmModal } from "@/components/confirm-modal";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  HelpCircle,
  Mail,
  MessageSquare,
  LogOut,
  PenLine,
  Bell,
  ChevronRight,
  FolderKanban,
  BookOpen,
  Layers,
  Users,
} from "lucide-react";

const NAV = [
  { href: "/admin",            label: "Dashboard",  icon: LayoutDashboard },
  { href: "/admin/enquiries",  label: "Enquiries",  icon: FileText },
  { href: "/admin/questions",  label: "Questions",  icon: HelpCircle },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/chat",       label: "Live Chat",  icon: MessageSquare },
  { href: "/admin/blog",          label: "Blog",          icon: PenLine },
  { href: "/admin/projects",      label: "Projects",      icon: FolderKanban },
  { href: "/admin/case-studies",  label: "Case Studies",  icon: BookOpen },
  { href: "/admin/services",      label: "Services",      icon: Layers },
  { href: "/admin/team",          label: "Team",          icon: Users },
];

const PAGE_TITLES: Record<string, string> = {
  "/admin":            "Dashboard",
  "/admin/enquiries":  "Enquiries",
  "/admin/questions":  "Questions",
  "/admin/newsletter": "Newsletter",
  "/admin/chat":       "Live Chat",
  "/admin/blog":          "Blog",
  "/admin/projects":      "Projects",
  "/admin/case-studies":  "Case Studies",
  "/admin/services":      "Services",
  "/admin/team":          "Team",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [ready, setReady]           = useState(false);
  const [username, setUsername]     = useState("devadmin");
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") { setReady(true); return; }
    const token = localStorage.getItem("admin_token");
    if (!token) { router.replace("/admin/login"); return; }
    // Decode username from JWT payload (middle segment)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUsername(payload.username ?? "Admin");
    } catch { /* ignore */ }
    setReady(true);
  }, [pathname, router]);

  function logout() {
    setShowLogout(false);
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  }

  if (!ready) return null;
  if (pathname === "/admin/login") return <>{children}</>;

  const pageTitle = PAGE_TITLES[pathname] ?? "Admin";

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside className="w-60 shrink-0 border-r border-border flex flex-col bg-background">

        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <div className="h-7 w-7 shrink-0 overflow-hidden">
            <Image src="/logo.png" alt="D&C" width={28} height={28} className="object-contain" />
          </div>
          <div>
            <p className="text-xs font-bold leading-none text-foreground">nanayawdev</p>
            <p className="mt-0.5 text-[0.55rem] uppercase tracking-[0.18em] text-muted-foreground">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3">
          <p className="px-5 pb-2 pt-1 text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/50">
            Navigation
          </p>
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`group flex items-center gap-3 px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-colors ${
                  active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="h-3 w-3 opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-border px-5 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-7 w-7 items-center justify-center bg-foreground text-background text-[0.6rem] font-bold uppercase shrink-0">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-foreground">{username}</p>
              <p className="text-[0.55rem] uppercase tracking-widest text-muted-foreground">Administrator</p>
            </div>
          </div>
          <button
            onClick={() => setShowLogout(true)}
            className="flex w-full items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <p className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Admin
            </p>
            <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground">
              {pageTitle}
            </p>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            >
              View Site ↗
            </a>
            <button
              aria-label="Notifications"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>

      <ConfirmModal
        open={showLogout}
        title="Sign out?"
        description="You will be returned to the login screen."
        confirmLabel="Yes, sign out"
        onConfirm={logout}
        onCancel={() => setShowLogout(false)}
      />
    </div>
  );
}
