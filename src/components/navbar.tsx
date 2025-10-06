"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full pt-8">
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
              <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full px-6 py-2 shadow-lg shadow-black/5 dark:shadow-black/20">
                <div className="flex items-center space-x-4 relative">
                  <motion.a 
                    href="/" 
                    className={`text-sm font-medium flex items-center py-2 ${isActive('/') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground transition-colors'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span 
                      className="w-1.5 h-1.5 bg-foreground rounded-full mr-2"
                      initial={false}
                      animate={{ 
                        opacity: isActive('/') ? 1 : 0,
                        scale: isActive('/') ? 1 : 0.5
                      }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    />
                    Home
                  </motion.a>
                  <motion.a 
                    href="/services" 
                    className={`text-sm font-medium py-2 ${isActive('/services') ? 'text-foreground flex items-center' : 'text-muted-foreground hover:text-foreground transition-colors'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span 
                      className="w-1.5 h-1.5 bg-foreground rounded-full mr-2"
                      initial={false}
                      animate={{ 
                        opacity: isActive('/services') ? 1 : 0,
                        scale: isActive('/services') ? 1 : 0.5
                      }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    />
                    Services
                  </motion.a>
                  <motion.a 
                    href="/portfolio" 
                    className={`text-sm font-medium py-2 ${isActive('/portfolio') ? 'text-foreground flex items-center' : 'text-muted-foreground hover:text-foreground transition-colors'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span 
                      className="w-1.5 h-1.5 bg-foreground rounded-full mr-2"
                      initial={false}
                      animate={{ 
                        opacity: isActive('/portfolio') ? 1 : 0,
                        scale: isActive('/portfolio') ? 1 : 0.5
                      }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    />
                    Projects
                  </motion.a>
                  <motion.a 
                    href="/case-studies" 
                    className={`text-sm font-medium py-2 ${isActive('/case-studies') ? 'text-foreground flex items-center' : 'text-muted-foreground hover:text-foreground transition-colors'}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span 
                      className="w-1.5 h-1.5 bg-foreground rounded-full mr-2"
                      initial={false}
                      animate={{ 
                        opacity: isActive('/case-studies') ? 1 : 0,
                        scale: isActive('/case-studies') ? 1 : 0.5
                      }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    />
                    Case Studies
                  </motion.a>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full px-2 py-2 shadow-lg shadow-black/5 dark:shadow-black/20">
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
