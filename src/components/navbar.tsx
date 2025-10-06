"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/portfolio", label: "Projects" },
    { href: "/case-studies", label: "Case Studies" }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full pt-4 sm:pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Left - Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
              <span className="text-lg sm:text-xl font-semibold text-foreground">
                Devs & Creatives
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Navigation */}
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full px-6 py-2 shadow-lg shadow-black/5 dark:shadow-black/20">
              <div className="flex items-center space-x-4 relative">
                {navigationItems.map((item) => (
                  <motion.div
                    key={item.href}
                    className={`text-sm font-medium py-2 ${isActive(item.href) ? 'text-foreground flex items-center' : 'text-muted-foreground hover:text-foreground transition-colors'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href={item.href} className="flex items-center">
                      <motion.span 
                        className="w-1.5 h-1.5 bg-foreground rounded-full mr-2"
                        initial={false}
                        animate={{ 
                          opacity: isActive(item.href) ? 1 : 0,
                          scale: isActive(item.href) ? 1 : 0.5
                        }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                      />
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full px-2 py-2 shadow-lg shadow-black/5 dark:shadow-black/20">
              <div className="flex items-center space-x-3">
                <motion.button 
                  className="bg-primary text-primary-foreground px-4 sm:px-6 py-2 rounded-full text-sm font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.button>
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full px-2 py-2 shadow-lg shadow-black/5 dark:shadow-black/20">
              <ThemeToggle />
            </div>
            <motion.button
              onClick={toggleMobileMenu}
              className="bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full p-2 shadow-lg shadow-black/5 dark:shadow-black/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-foreground" />
              ) : (
                <Menu className="h-5 w-5 text-foreground" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden"
            >
              <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl mt-4 p-6 shadow-lg shadow-black/5 dark:shadow-black/20">
                <div className="space-y-4">
                  {navigationItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMobileMenu}
                        className={`flex items-center py-3 px-4 rounded-lg transition-colors ${
                          isActive(item.href)
                            ? 'bg-primary/20 text-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                        }`}
                      >
                        <motion.span 
                          className="w-2 h-2 bg-primary rounded-full mr-3"
                          initial={false}
                          animate={{ 
                            opacity: isActive(item.href) ? 1 : 0,
                            scale: isActive(item.href) ? 1 : 0.5
                          }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                        />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                  
                  {/* Mobile CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="pt-4 border-t border-white/10 dark:border-white/5"
                  >
                    <motion.button 
                      className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg text-sm font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={closeMobileMenu}
                    >
                      Get Started
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
