"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/case-studies", label: "Case Studies" },
  { href: "/resources", label: "Resources" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Hide navbar on the /start page
  if (pathname === "/start") return null;

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      animate={{
        backgroundColor: scrolled ? "hsl(var(--background) / 0.8)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <Image src="/logo.png" alt="Octacore" width={40} height={40} className="w-full h-full object-contain" />
            </div>
          </Link>

          {/* Desktop — center nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-colors duration-200 ${
                  isActive(item.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive(item.href) && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-foreground/8"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop — right actions */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <Link href="/start">
              <motion.span
                className="inline-block bg-foreground text-background px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] cursor-pointer transition-opacity hover:opacity-90"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Let&apos;s Talk
              </motion.span>
            </Link>
          </div>

          {/* Mobile — right actions */}
          <div className="lg:hidden flex items-center gap-2">
            <Link href="/start">
              <motion.span
                className="inline-block bg-foreground text-background px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] cursor-pointer transition-opacity hover:opacity-90"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Let&apos;s Talk
              </motion.span>
            </Link>
            <motion.button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="p-2 text-foreground"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="lg:hidden overflow-hidden border-t border-border/50 bg-background/90 backdrop-blur-xl"
          >
            <div className="max-w-7xl mx-auto px-6 py-4 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-4 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-colors ${
                    isActive(item.href)
                      ? "bg-foreground/8 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                  }`}
                >
                  {isActive(item.href) && (
                    <span className="w-1.5 h-1.5 rounded-sm bg-foreground shrink-0" />
                  )}
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 pb-1 flex items-center justify-between gap-3">
                <Link href="/start" className="flex-1">
                  <span className="block w-full bg-foreground text-background py-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-center cursor-pointer transition-opacity hover:opacity-90">
                    Let&apos;s Talk
                  </span>
                </Link>
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
