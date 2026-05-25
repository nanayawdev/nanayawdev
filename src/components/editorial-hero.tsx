"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function EditorialHero() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-8 pb-24 pt-40 lg:pb-32 lg:pt-52">
        <motion.h1
          className="max-w-5xl overflow-visible text-[clamp(4rem,10vw,9rem)] font-bold leading-[0.85] tracking-[-0.07em] text-foreground"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
        >
          We&apos;re{" "}
          <span className="inline-block bg-gradient-to-r from-[#ff6a1a] via-[#FD4912] to-[#c73c00] bg-clip-text pr-[0.06em] text-transparent">
            engineers
          </span>
          <br />
          <span className="text-muted-foreground">who give a damn.</span>
        </motion.h1>
      </div>

      <motion.div
        className="relative h-[350px] w-full overflow-hidden bg-muted sm:h-[500px] lg:h-[650px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
      >
        <Image
          src="/hero6.webp"
          alt="Octacore digital studio"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
    </section>
  );
}
