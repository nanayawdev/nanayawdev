"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { InquireBriefModal } from "@/components/inquire-brief";

export function MainCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-8">
        <motion.div
          className="bg-card text-foreground rounded-4xl p-8 lg:p-12 border border-border relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Decorative corner elements */}
          <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-border rounded-tr-2xl"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-border rounded-br-2xl"></div>
          <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-border rounded-tl-2xl"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-border rounded-bl-2xl"></div>
          
          <div className="max-w-4xl mx-auto text-center">
              {/* Main Headline */}
              <motion.h2
                className="text-4xl lg:text-5xl font-bold mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Convinced?
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
                  Let&apos;s build it together.
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
                  onClick={openModal}
                >
                  Let&apos;s Talk
                </motion.button>
              </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Modal */}
      <InquireBriefModal isOpen={isModalOpen} onClose={closeModal} />
    </section>
  );
}
