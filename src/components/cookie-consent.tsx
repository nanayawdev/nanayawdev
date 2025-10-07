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
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
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
          className="fixed bottom-6 left-6 right-6 z-50 max-w-md mx-auto lg:mx-0 lg:max-w-lg"
        >
          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg backdrop-blur-sm">
            {/* Header */}
            <h3 className="text-xl font-bold text-foreground mb-3">
              Cookie Settings
            </h3>

            {/* Body Text */}
            <p className="text-muted-foreground text-base mb-6 leading-relaxed">
              We use cookies to personalize content, run ads, and analyze traffic.{" "}
              <Link 
                href="/privacy" 
                className="text-primary hover:text-primary/80 underline transition-colors"
              >
                Read our Privacy Policy
              </Link>
              .
            </p>

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <motion.button
                onClick={handleReject}
                className="px-6 py-3 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Reject
              </motion.button>
              <motion.button
                onClick={handleAccept}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
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
