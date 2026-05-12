"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { InquireBriefModal } from "@/components/inquire-brief";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Projects" },
    { href: "/case-studies", label: "Case Studies" },
  ];

  return (
    <>
      <nav className="fixed bottom-6 z-50 w-full flex justify-center px-4">

        {/* Desktop — single compact floating pill */}
        <div className="hidden lg:flex items-center gap-1 bg-background/60 backdrop-blur-2xl border border-border/60 rounded-full px-3 py-2 shadow-xl shadow-black/10 dark:shadow-black/40">
          {/* Logo */}
          <Link href="/" className="mr-2">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image src="/logo.png" alt="Devs & Cre8vs" width={32} height={32} className="w-full h-full object-contain" />
            </div>
          </Link>

          <div className="w-px h-4 bg-foreground/10 mx-1" />

          {/* Nav links */}
          {navigationItems.map((item) => (
            <motion.div key={item.href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={item.href}
                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition-colors ${
                  isActive(item.href)
                    ? "text-foreground bg-foreground/8"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive(item.href) && (
                  <span className="w-1.5 h-1.5 rounded-sm bg-foreground shrink-0" />
                )}
                {item.label}
              </Link>
            </motion.div>
          ))}

          <div className="w-px h-4 bg-foreground/10 mx-1" />

          <ThemeToggle />

          <motion.button
            className="ml-1 bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-medium cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={openModal}
          >
            Let&apos;s Talk
          </motion.button>
        </div>

        {/* Mobile — full-width floating pill */}
        <div className="lg:hidden w-full max-w-sm relative">
          <div className="flex items-center justify-between bg-background/60 backdrop-blur-2xl border border-border/60 rounded-full px-4 py-2.5 shadow-xl shadow-black/10 dark:shadow-black/40">
            <Link href="/" onClick={closeMobileMenu}>
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Image src="/logo.png" alt="Devs & Cre8vs" width={32} height={32} className="w-full h-full object-contain" />
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <motion.button
                onClick={() => setIsMobileMenuOpen((v) => !v)}
                className="p-2 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-foreground" />
                ) : (
                  <Menu className="w-5 h-5 text-foreground" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile menu — slides up from the bar */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute bottom-full mb-3 left-0 right-0"
              >
                <div className="bg-background/70 backdrop-blur-2xl border border-border/60 rounded-2xl p-3 shadow-xl shadow-black/10 dark:shadow-black/40">
                  <div className="space-y-1">
                    {navigationItems.map((item, index) => (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15, delay: index * 0.04 }}
                      >
                        <Link
                          href={item.href}
                          onClick={closeMobileMenu}
                          className={`flex items-center gap-2.5 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
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
                      </motion.div>
                    ))}

                    <div className="pt-2 mt-1 border-t border-border/40">
                      <motion.button
                        className="w-full bg-primary text-primary-foreground py-2.5 px-6 rounded-xl text-sm font-medium cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { closeMobileMenu(); openModal(); }}
                      >
                        Let&apos;s Talk
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <InquireBriefModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
