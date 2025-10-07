"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      {/* Content */}
      <div className="min-h-screen flex items-center">
        <div className="max-w-4xl mx-auto px-8 py-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Heading */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-shrink-0"
              >
                <FileText className="w-16 h-16 lg:w-20 lg:h-20 text-primary" />
              </motion.div>
              <h1 className="text-4xl sm:text-5xl lg:text-8xl font-bold leading-tight">
                <span className="text-foreground">Terms of</span>{" "}
                <span className="text-muted-foreground">Service</span>
              </h1>
            </div>

            {/* First Paragraph */}
            <motion.p
              className="text-foreground text-lg lg:text-xl leading-relaxed max-w-3xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              These Terms of Service govern your use of our digital agency services and 
              outline the rights and responsibilities of both parties in our working relationship.
            </motion.p>

            {/* Second Paragraph */}
            <motion.p
              className="text-foreground text-lg lg:text-xl leading-relaxed max-w-3xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              By engaging our services, you agree to these terms. We are committed to 
              providing transparent, professional service while protecting both our 
              interests and yours.
            </motion.p>

            {/* Last Updated */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <p className="text-muted-foreground text-sm">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
