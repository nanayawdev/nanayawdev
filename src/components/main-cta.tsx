"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function MainCTA() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-8">
        <motion.div
          className="bg-card text-foreground rounded-2xl p-8 lg:p-12 border border-border relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Decorative corner elements */}
          <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-border rounded-tr-lg"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-border rounded-br-lg"></div>
          <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-border rounded-tl-lg"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-border rounded-bl-lg"></div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left Content */}
            <div className="flex-1">
              {/* Main Headline */}
              <motion.h2
                className="text-4xl lg:text-5xl font-bold mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Convinced already?
              </motion.h2>

              {/* Description */}
              <motion.div
                className="space-y-2 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <p className="text-muted-foreground text-lg">
                  Stake your claim on the digital world today with our platform!
                </p>
                <p className="text-muted-foreground text-lg">
                  Deploy your application, database, or website in minutes.
                </p>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <motion.button
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary/90 transition-colors duration-200 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get started
                </motion.button>
              </motion.div>
            </div>

            {/* Right Icon */}
            <motion.div
              className="flex-shrink-0"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-primary rounded-xl flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
