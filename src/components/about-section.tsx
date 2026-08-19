"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";

export function AboutSection() {
  return (
    <section id="about" className="border-t border-border bg-background">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-8 pt-40 lg:pt-42">
        <motion.div
          className="inline-flex items-center gap-2 border border-border bg-muted/40 text-foreground px-3 py-1.5 text-xs font-medium rounded-full mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span>Available for new projects</span>
        </motion.div>
        <motion.h2
          className="text-[clamp(3.5rem,9vw,8rem)] font-semibold leading-[0.85] tracking-[-0.08em] text-foreground"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          viewport={{ once: true }}
        >
          I Design, I Build, I Make it Matter
        </motion.h2>
      </div>

      {/* Full-width Image */}
      <motion.div
        className="mt-16 lg:mt-20 w-full relative h-[350px] sm:h-[500px] lg:h-[650px] overflow-hidden bg-muted"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <Image
          src="/nanayawdev.jpeg"
          alt="nanayawdev"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-8 py-16 lg:py-24">
        <div className="max-w-9xl mx-auto text-center">
          <ScrollReveal
            baseOpacity={0}
            enableBlur
            baseRotation={5}
            blurStrength={13}
            containerClassName="my-0"
            textClassName="tracking-tight !leading-[1.2]"
          >
            I&apos;m a designer, engineer, and strategist rolled into one. I build digital products that are thoughtful, functional, and built to work. My clients come back because I understand the problem, solve it well, and deliver work they&apos;re proud to put their name behind.
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
