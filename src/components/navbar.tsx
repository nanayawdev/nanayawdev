"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { motion } from "framer-motion";

export function Navbar() {
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
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2">
                <div className="flex items-center space-x-4">
                  <a href="/" className="text-sm font-medium text-white flex items-center py-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mr-2"></span>
                    Home
                  </a>
                  <a href="/services" className="text-sm font-medium text-white/70 hover:text-white transition-colors py-2">
                    Services
                  </a>
                  <a href="/portfolio" className="text-sm font-medium text-white/70 hover:text-white transition-colors py-2">
                    Projects
                  </a>
                  <a href="/case-studies" className="text-sm font-medium text-white/70 hover:text-white transition-colors py-2">
                    Case Studies
                  </a>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2">
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
