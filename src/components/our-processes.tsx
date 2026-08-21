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
    description: "I map out the full scope (architecture, tech stack, design direction) before a single pixel or line of code is touched.",
  },
  {
    id: 3,
    title: "Design & Build",
    description: "I design and engineer in parallel, moving fast without cutting corners, keeping you in the loop with regular previews.",
  },
  {
    id: 4,
    title: "Review & Refine",
    description: "You give feedback, I listen and iterate until every detail is right, no rushed sign-offs, no compromises on quality.",
  },
  {
    id: 5,
    title: "Launch & Support",
    description: "I ship it, watch it land, and stay close after go-live to handle anything that comes up as real users start rolling in.",
  },
];

function ProcessCard({
  process,
  index,
}: {
  process: (typeof processes)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col gap-8 px-6 py-10 lg:gap-14 lg:px-7 lg:py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <p className="text-sm font-semibold tracking-[0.18em] text-muted-foreground">
        Step {String(process.id).padStart(2, "0")}
        <span className="text-[#cdf68c]">.</span>
      </p>

      <div>
        <h3 className="mb-3 text-2xl font-bold leading-[1.05] text-foreground">
          {process.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {process.description}
        </p>
      </div>
    </motion.div>
  );
}

export function OurProcesses() {
  return (
    <section className="border-t border-border bg-background py-16 lg:py-28">
      <div className="mx-auto max-w-7xl px-8">
        {/* Header */}
        <div className="mb-16 flex flex-col items-start gap-3 lg:mb-20 lg:flex-row lg:items-end lg:justify-between">
          <motion.h2
            className="text-[clamp(3.5rem,9vw,8rem)] font-semibold leading-[0.85] tracking-[-0.08em] text-foreground"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
          >
            My Process
          </motion.h2>
          <motion.p
            className="text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            (Process)
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 divide-y divide-border border-y border-border lg:grid-cols-5 lg:divide-x lg:divide-y-0">
          {processes.map((process, index) => (
            <ProcessCard key={process.id} process={process} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
