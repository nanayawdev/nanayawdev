"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const processes = [
  {
    id: 1,
    title: "Discovery",
    description: "I dig into your brand, goals, and audience so every decision I make is grounded in what actually matters for your business.",
  },
  {
    id: 2,
    title: "Strategy",
    description: "I map out the full scope — architecture, tech stack, design direction — before a single pixel or line of code is touched.",
  },
  {
    id: 3,
    title: "Design & Build",
    description: "I design and engineer in parallel, moving fast without cutting corners, keeping you in the loop with regular previews.",
  },
  {
    id: 4,
    title: "Review & Refine",
    description: "You give feedback, I listen and iterate until every detail is right — no rushed sign-offs, no compromises on quality.",
  },
  {
    id: 5,
    title: "Launch & Support",
    description: "I ship it, watch it land, and stay close after go-live to handle anything that comes up as real users start rolling in.",
  },
];

function ProcessStep({
  process,
  isLast,
}: {
  process: (typeof processes)[number];
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  return (
    <div ref={ref} className="flex gap-6 lg:gap-8">
      {/* Rail */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-sm font-semibold tabular-nums transition-colors duration-500 ${
            inView ? "border-[#542e7b] bg-[#542e7b] text-white" : "border-border text-foreground"
          }`}
        >
          {String(process.id).padStart(2, "0")}
        </div>
        {!isLast && (
          <div className="relative mt-2 w-px flex-1 bg-border">
            <motion.div
              className="absolute inset-x-0 top-0 w-px origin-top bg-[#542e7b]"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: inView ? 1 : 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <motion.div
        className={isLast ? "pb-2" : "pb-14"}
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="mb-2 text-xl font-semibold text-foreground lg:text-2xl">
          {process.title}
        </h3>
        <p className="max-w-md text-base leading-relaxed text-muted-foreground">
          {process.description}
        </p>
      </motion.div>
    </div>
  );
}

export function OurProcesses() {
  return (
    <section className="py-16 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-8">

        {/* Header */}
        <div className="mb-16 lg:mb-20 max-w-2xl">
          <motion.p
            className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            How I Work
          </motion.p>
          <motion.h2
            className="text-[clamp(3.5rem,9vw,8rem)] font-semibold leading-[0.85] tracking-[-0.08em] text-foreground"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            viewport={{ once: true }}
          >
            My Process
          </motion.h2>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl">
          {processes.map((process, index) => (
            <ProcessStep key={process.id} process={process} isLast={index === processes.length - 1} />
          ))}
        </div>

      </div>
    </section>
  );
}
