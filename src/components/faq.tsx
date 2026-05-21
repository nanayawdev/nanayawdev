"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus } from "lucide-react";
import { CTACard } from "@/components/cta-card";

const faqData = [
  {
    id: 1,
    question: "What services do you offer?",
    answer: "We cover the full digital stack — brand identity, web design and development, mobile apps, and digital marketing. Most clients come to us for one thing and stay for everything else.",
  },
  {
    id: 2,
    question: "Do you work with international clients?",
    answer: "Yes. While we specialise in African markets, we work with founders and brands worldwide. Our edge is combining local cultural depth with international design and engineering standards.",
  },
  {
    id: 3,
    question: "How long does a typical project take?",
    answer: "A brand identity takes 2–3 weeks. A web project is typically 4–8 weeks depending on complexity. Mobile apps run 8–16 weeks. We'll give you a precise timeline before anything starts.",
  },
  {
    id: 4,
    question: "Do you offer post-launch support?",
    answer: "Always. We offer retainer-based maintenance covering updates, performance monitoring, security patches, and ongoing feature work. We don't disappear after launch.",
  },
  {
    id: 5,
    question: "What makes you different from other agencies?",
    answer: "We're builders first. Every person on our team who touches your project can design and develop — no disconnected handoffs. And we actually care whether your product succeeds, not just whether we shipped it.",
  },
  {
    id: 6,
    question: "How do we get started?",
    answer: "Hit the Let's Talk button, fill in a brief, and we'll set up a discovery call within 48 hours. From there we scope the project, agree on timelines and pricing, and kick off.",
  },
];

export function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggle = (id: number) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className="py-16 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16 lg:gap-24 items-start">

          {/* Left — sticky */}
          <div className="lg:sticky lg:top-32">
            <motion.p
              className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              FAQ
            </motion.p>
            <motion.h2
              className="text-4xl lg:text-6xl font-bold text-foreground leading-none tracking-tight"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              viewport={{ once: true }}
            >
              Common
              <br />
              Questions
            </motion.h2>
            <motion.p
              className="mt-6 text-muted-foreground text-base leading-relaxed max-w-xs"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Can&apos;t find what you&apos;re looking for? Drop us a message and we&apos;ll get back to you within 24 hours.
            </motion.p>
            <motion.div
              className="mt-10"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              viewport={{ once: true }}
            >
              <CTACard />
            </motion.div>
          </div>

          {/* Right — accordion */}
          <div className="divide-y divide-border">
            {faqData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                viewport={{ once: true }}
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-start justify-between gap-6 py-7 text-left group cursor-pointer"
                >
                  <span className={`text-base lg:text-lg font-medium leading-snug transition-colors duration-200 ${openId === item.id ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                    {item.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openId === item.id ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 mt-0.5"
                  >
                    <Plus className="w-5 h-5 text-muted-foreground" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {openId === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-muted-foreground text-base leading-relaxed pb-7 max-w-xl">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
