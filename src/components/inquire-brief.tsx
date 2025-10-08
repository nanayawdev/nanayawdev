"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, FileText } from "lucide-react";

interface InquireBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InquireBriefModal({ isOpen, onClose }: InquireBriefModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-8 max-w-md w-full shadow-lg shadow-black/5 dark:shadow-black/20">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Let&apos;s Talk
                </h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 bg-white/5 dark:bg-white/5 hover:bg-white/10 dark:hover:bg-white/10 rounded-md transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </motion.button>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-8 text-center">
                Choose how you&apos;d like to get started with your project
              </p>

              {/* Buttons */}
              <div className="space-y-4">
                {/* Make Enquiries Button */}
                <motion.button
                  className="w-full bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-lg p-4 flex items-center justify-center space-x-3 hover:bg-white/20 dark:hover:bg-black/30 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    // Handle make enquiries action
                    console.log("Make enquiries clicked");
                    onClose();
                  }}
                >
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">Make Enquiries</span>
                </motion.button>

                {/* Send Brief Button */}
                <motion.button
                  className="w-full bg-primary text-primary-foreground rounded-lg p-4 flex items-center justify-center space-x-3 hover:bg-primary/90 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    // Handle send brief action
                    console.log("Send brief clicked");
                    onClose();
                  }}
                >
                  <FileText className="h-5 w-5" />
                  <span className="font-medium">Send Brief</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
