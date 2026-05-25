"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CTACard } from "@/components/cta-card";
import { TeamSection } from "@/components/team-section";

const values = [
  {
    title: "African-First, Globally Minded",
    description: "We build from a deep understanding of African markets while holding ourselves to the highest international standards. Local insight, global ambition.",
  },
  {
    title: "Craft Over Shortcuts",
    description: "We don't use templates. Every pixel, every line of code, every word is deliberate. We'd rather take the extra day to get it right than ship something we're not proud of.",
  },
  {
    title: "Partnerships, Not Transactions",
    description: "We measure success by whether your business grows — not by whether we delivered files. Our best clients have been with us for years, not weeks.",
  },
  {
    title: "Radical Transparency",
    description: "Honest timelines, honest pricing, honest feedback. If something isn't working, we'll tell you before you have to ask.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="pt-40 pb-24 lg:pt-52 lg:pb-32 max-w-7xl mx-auto px-8">
        <motion.p
          className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About Us
        </motion.p>
        <motion.h1
          className="max-w-5xl overflow-visible text-[clamp(4rem,10vw,9rem)] font-bold leading-[0.85] tracking-[-0.07em] text-foreground"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
        >
          We Design. We Build. We Make it Matter.
        </motion.h1>
      </section>

      {/* Manifesto + Values */}
      <section className="border-t border-border">
        {/* Full-width Image */}
        <motion.div
          className="w-full relative h-[350px] sm:h-[500px] lg:h-[650px] overflow-hidden bg-muted"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <Image
            src="/hero6.webp"
            alt="Codebase Technologies Creative Studio"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        <div className="max-w-7xl mx-auto px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16 lg:gap-24 items-start">

            {/* Left — manifesto */}
            <div className="lg:sticky lg:top-32">
              <motion.p
                className="text-muted-foreground text-lg leading-relaxed mb-6"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Codebase Technologies was built on one belief: African brands deserve world-class digital experiences, built by people who understand the market from the inside.
              </motion.p>
              <motion.p
                className="text-muted-foreground text-lg leading-relaxed"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                We&apos;re a small team of designers, engineers, and strategists. We move fast, communicate clearly, and we&apos;re obsessive about quality. Our clients don&apos;t come back because we&apos;re cheap — they come back because we make them look good and their products actually work.
              </motion.p>
              <div className="mt-10">
                <CTACard />
              </div>
            </div>

            {/* Right — values */}
            <div className="divide-y divide-border">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  className="py-8"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.07 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-start gap-6">
                    <span className="text-xs font-medium text-muted-foreground/40 tabular-nums pt-1.5 w-6 shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                      <p className="text-muted-foreground text-base leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TeamSection />

    </div>
  );
}
