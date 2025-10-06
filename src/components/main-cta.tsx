"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function MainCTA() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-8">
        <motion.div
          className="bg-foreground text-background rounded-3xl p-12 lg:p-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Headline */}
            <motion.h2
              className="text-4xl lg:text-6xl mb-6 leading-none"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Design doesn&apos;t need to be complicated.
            </motion.h2>

            {/* Description */}
            <motion.p
              className="text-lg lg:text-xl text-background/80 mb-10 leading-relaxed max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Book a quick call and get a clear look at how we work, what&apos;s included, and whether we fit your pace.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.button
                className="inline-flex items-center gap-3 bg-background text-foreground px-8 py-4 rounded-full font-semibold text-lg hover:bg-background/90 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Request Quote</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
