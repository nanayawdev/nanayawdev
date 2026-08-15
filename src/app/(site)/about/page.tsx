"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CTACard } from "@/components/cta-card";
import ScrollReveal from "@/components/ScrollReveal";

const skills = [
  "React", "Next.js", "TypeScript", "Node.js",
  "PostgreSQL", "Tailwind CSS", "Framer Motion", "Figma",
];

const milestones = [
  {
    year: "Start",
    title: "Started building for the web",
    description: "Taught myself to design and code, and started shipping small projects for anyone who'd let me.",
  },
  {
    year: "Growth",
    title: "Went full-stack",
    description: "Expanded into backend, databases, and infrastructure so I could ship complete products end to end, not just interfaces.",
  },
  {
    year: "Now",
    title: "Working with founders and brands",
    description: "Helping startups and brands go global through design, development, and storytelling — one project at a time.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="pt-40 pb-16 lg:pt-52 lg:pb-24 max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-20 items-center">
          <div>
            <motion.p
              className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              About Me
            </motion.p>
            <motion.h1
              className="font-display max-w-xl overflow-visible text-[clamp(2.75rem,6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-foreground mb-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
            >
              Hi, I&apos;m nanayawdev.
            </motion.h1>

            <ScrollReveal
              baseOpacity={0}
              enableBlur
              baseRotation={3}
              blurStrength={8}
              containerClassName="my-0"
              textClassName="!text-xl lg:!text-2xl !font-normal tracking-tight text-muted-foreground"
            >
              I&apos;m a designer, engineer, and strategist rolled into one. I move fast, communicate clearly, and I&apos;m obsessive about quality.
            </ScrollReveal>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <motion.div
                className="inline-flex items-center gap-2 border border-[#0a291a]/15 bg-[#cdf68c]/25 text-[#0a291a] px-3 py-1.5 text-xs font-medium rounded-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0a291a] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0a291a]" />
                </span>
                <span>Available for new projects</span>
              </motion.div>

              <Link
                href="/start"
                className="inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-90"
              >
                Start a Project <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <motion.div
            className="relative aspect-[4/5] w-full max-w-sm mx-auto lg:mx-0 overflow-hidden rounded-2xl border border-border bg-muted"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          >
            <Image
              src="/nanayawdev.jpeg"
              alt="nanayawdev"
              fill
              priority
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Skills strip */}
      <section className="border-t border-border py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-8">
          <motion.p
            className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            What I Work With
          </motion.p>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <motion.span
                key={skill}
                className="border border-border rounded-full px-4 py-2 text-sm text-foreground"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                viewport={{ once: true }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Journey timeline */}
      <section className="border-t border-border py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-8">
          <motion.p
            className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            How I Got Here
          </motion.p>
          <motion.h2
            className="font-display text-4xl lg:text-6xl font-semibold text-foreground leading-none tracking-tight mb-14"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            viewport={{ once: true }}
          >
            My Journey
          </motion.h2>

          <div className="max-w-3xl divide-y divide-border border-t border-border">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.title}
                className="grid grid-cols-[5rem_1fr] gap-6 py-8 lg:grid-cols-[7rem_1fr]"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60 pt-1">
                  {milestone.year}
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{milestone.title}</h3>
                  <p className="text-muted-foreground text-base leading-relaxed">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-md">
            <CTACard />
          </div>
        </div>
      </section>

    </div>
  );
}
