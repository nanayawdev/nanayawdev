"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    window.dispatchEvent(new Event('cookie-consent-changed'));
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    window.dispatchEvent(new Event('cookie-consent-changed'));
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-xs mx-auto lg:mx-0"
        >
          <div className="bg-card border border-border rounded-xl p-3 shadow-lg backdrop-blur-sm flex items-center gap-2">
            <p className="text-muted-foreground text-xs leading-snug flex-1">
              I use cookies.{" "}
              <Link
                href="/privacy"
                className="text-primary hover:text-primary/80 underline transition-colors"
              >
                Learn more
              </Link>
            </p>

            <div className="flex gap-1.5 shrink-0">
              <motion.button
                onClick={handleReject}
                className="px-2.5 py-1 bg-muted text-muted-foreground rounded-md text-xs font-medium hover:bg-muted/80 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Reject
              </motion.button>
              <motion.button
                onClick={handleAccept}
                className="px-2.5 py-1 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:bg-primary/90 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Accept
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
