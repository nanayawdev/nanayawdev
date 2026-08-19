"use client";

import { useEffect, useState } from "react";
import { ConfirmModal } from "@/components/confirm-modal";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronRight } from "lucide-react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { UserDropdown } from "@/components/admin/user-dropdown";

const PAGE_TITLES: Record<string, string> = {
  "/admin":            "Dashboard",
  "/admin/enquiries":  "Enquiries",
  "/admin/questions":  "Questions",
  "/admin/newsletter": "Newsletter",
  "/admin/chat":       "Live Chat",
  "/admin/blog":          "Blog",
  "/admin/components":    "Components",
  "/admin/projects":      "Projects",
  "/admin/apps":          "Apps",
  "/admin/case-studies":  "Case Studies",
  "/admin/services":      "Services",
  "/admin/team":          "Team",
  "/admin/testimonials":  "Testimonials",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [ready, setReady]           = useState(false);
  const [username, setUsername]     = useState("devadmin");
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") { setReady(true); return; }

    function checkToken(): boolean {
      const token = localStorage.getItem("admin_token");
      if (!token) { router.replace("/admin/login"); return false; }
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        // exp is seconds since epoch; expired or malformed tokens force a fresh login
        // instead of silently rendering an "authenticated" shell with no data.
        if (!payload.exp || Date.now() >= payload.exp * 1000) {
          localStorage.removeItem("admin_token");
          router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
          return false;
        }
        setUsername(payload.username ?? "Admin");
        return true;
      } catch {
        localStorage.removeItem("admin_token");
        router.replace("/admin/login");
        return false;
      }
    }

    if (checkToken()) setReady(true);

    // catch expiry while the tab is left open, not just on navigation
    const interval = setInterval(checkToken, 60_000);
    return () => clearInterval(interval);
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
    <div className="admin-theme">
      <SidebarProvider className="h-svh overflow-hidden bg-[radial-gradient(circle_at_top,_hsl(var(--muted))_0%,_transparent_55%),_hsl(var(--background))] text-foreground">
        <AppSidebar />

        <SidebarInset className="flex flex-col min-h-0 overflow-hidden border border-border/60 bg-background/95 shadow-sm">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Admin
              </p>
              <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-foreground">
                {pageTitle}
              </p>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                View Site ↗
              </a>
              <button
                aria-label="Notifications"
                className="flex size-8 items-center justify-center rounded-full border border-border/60 bg-muted/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Bell className="h-4 w-4" />
              </button>
              <UserDropdown username={username} onSignOut={() => setShowLogout(true)} />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>

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
