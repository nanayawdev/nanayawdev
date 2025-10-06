"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  return (
    <nav className="sticky top-0 z-50 w-full pt-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Left - Brand */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <span className="text-xl font-semibold text-foreground">
                Devs & Creatives
              </span>
            </a>
          </div>

          {/* Right - Navigation and Actions */}
                <div className="flex items-center space-x-4">
            {/* Navigation */}
            <div className="hidden md:flex">
              <div className="bg-card/80 backdrop-blur-md border border-border rounded-full px-6 py-2">
                <div className="flex items-center space-x-4">
                  <motion.a 
                    href="/" 
                    className={`text-sm font-medium flex items-center py-2 ${isActive('/') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground transition-colors'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActive('/') && <span className="w-1.5 h-1.5 bg-foreground rounded-full mr-2"></span>}
                    Home
                  </motion.a>
                  <motion.a 
                    href="/services" 
                    className={`text-sm font-medium py-2 ${isActive('/services') ? 'text-foreground flex items-center' : 'text-muted-foreground hover:text-foreground transition-colors'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActive('/services') && <span className="w-1.5 h-1.5 bg-foreground rounded-full mr-2"></span>}
                    Services
                  </motion.a>
                  <motion.a 
                    href="/portfolio" 
                    className={`text-sm font-medium py-2 ${isActive('/portfolio') ? 'text-foreground flex items-center' : 'text-muted-foreground hover:text-foreground transition-colors'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActive('/portfolio') && <span className="w-1.5 h-1.5 bg-foreground rounded-full mr-2"></span>}
                    Projects
                  </motion.a>
                  <motion.a 
                    href="/case-studies" 
                    className={`text-sm font-medium py-2 ${isActive('/case-studies') ? 'text-foreground flex items-center' : 'text-muted-foreground hover:text-foreground transition-colors'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActive('/case-studies') && <span className="w-1.5 h-1.5 bg-foreground rounded-full mr-2"></span>}
                    Case Studies
                  </motion.a>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-card/80 backdrop-blur-md border border-border rounded-full px-2 py-2">
              <div className="flex items-center space-x-3">
                <motion.button 
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.button>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
