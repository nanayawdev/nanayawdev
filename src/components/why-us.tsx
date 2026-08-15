"use client";

import { motion } from "framer-motion";

const reasons = [
  {
    title: "Locally Rooted Design",
    description: "I understand the markets I build for deeply — I create experiences that feel local, travel globally, and speak to your audience in a way generic agencies never will.",
  },
  {
    title: "Full-Stack, One Person",
    description: "Brand identity, web, mobile, marketing — all under one roof. No handoff gaps, no blame games. One person owns the entire outcome.",
  },
  {
    title: "Startup Speed",
    description: "I move at the pace of ambitious founders. Fast iterations, direct communication, and zero corporate overhead between you and the person building your product.",
  },
  {
    title: "Global Ambition",
    description: "I've helped brands compete on the world stage. I know what it takes to go from local to international and I build with that goal from day one.",
  },
  {
    title: "Results, Not Deliverables",
    description: "I don't hand you files and disappear. I care about whether your product grows, converts, and stands out — and I measure my work against that.",
  },
];

export function WhyUs() {
  return (
    <section className="py-16 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16 lg:gap-24 items-start">

          {/* Left — sticky headline */}
          <div className="lg:sticky lg:top-32">
            <motion.p
              className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Why Me
            </motion.p>
            <motion.h2
              className="font-display text-4xl lg:text-6xl font-bold text-foreground leading-none tracking-tight"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              viewport={{ once: true }}
            >
              Why You&apos;ll
              <br />
              Love Working With Me
            </motion.h2>
            <motion.p
              className="mt-6 text-muted-foreground text-base leading-relaxed max-w-xs"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              I&apos;m not your average agency. Here&apos;s what makes working with me different.
            </motion.p>
          </div>

          {/* Right — reasons list */}
          <div className="divide-y divide-border">
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                className="py-8 lg:py-10 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-6">
                  {/* Index */}
                  <span className="text-xs font-medium text-muted-foreground/40 tabular-nums pt-1.5 w-6 shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-3 leading-snug">
                      {reason.title}
                    </h3>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
