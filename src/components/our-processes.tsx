"use client";

import { motion } from "framer-motion";

const processes = [
  {
    id: 1,
    title: "Discovery",
    description: "We dig into your brand, goals, and audience so every decision we make is grounded in what actually matters for your business.",
  },
  {
    id: 2,
    title: "Strategy",
    description: "We map out the full scope — architecture, tech stack, design direction — before a single pixel or line of code is touched.",
  },
  {
    id: 3,
    title: "Design & Build",
    description: "Our designers and engineers work in parallel, moving fast without cutting corners, keeping you in the loop with regular previews.",
  },
  {
    id: 4,
    title: "Review & Refine",
    description: "You give feedback, we listen and iterate until every detail is right — no rushed sign-offs, no compromises on quality.",
  },
  {
    id: 5,
    title: "Launch & Support",
    description: "We ship it, watch it land, and stay close after go-live to handle anything that comes up as real users start rolling in.",
  },
];

export function OurProcesses() {
  return (
    <section className="py-16 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-8">

        {/* Header */}
        <div className="mb-16 lg:mb-20">
          <motion.p
            className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            How We Work
          </motion.p>
          <motion.h2
            className="text-4xl lg:text-6xl font-bold text-foreground leading-none tracking-tight"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            viewport={{ once: true }}
          >
            Our Process
          </motion.h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
          {processes.map((process, index) => (
            <motion.div
              key={process.id}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Connector line — sits behind the number row */}
              <div className="flex items-center mb-8">
                <div className="relative flex items-center justify-center w-12 h-12 rounded-full border border-border bg-background shrink-0 z-10">
                  <span className="text-sm font-semibold text-foreground tabular-nums">
                    {String(process.id).padStart(2, "0")}
                  </span>
                </div>
                {/* Line to next step */}
                {index < processes.length - 1 && (
                  <div className="hidden md:block flex-1 h-px bg-border ml-0" />
                )}
              </div>

              {/* Content */}
              <div className="pr-8">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {process.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {process.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
