"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Big_Shoulders } from "next/font/google";
import { Sparkle } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: "900",
  variable: "--font-big-shoulders",
});

export function NameHero() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] py-24 lg:py-32">
      <div className="text-center">
        <motion.p
          className="mb-8 text-[0.7rem] font-medium uppercase tracking-[0.3em] text-white/50"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Crafting Digital Products
        </motion.p>

        {/* Stacked name + portrait cutout — full-width so the type can scale up dramatically */}
        <div className="relative mx-auto w-full px-4">
          <motion.h2
            className={`${bigShoulders.className} select-none text-[clamp(6rem,19vw,15rem)] font-black uppercase leading-[0.82] tracking-[-0.02em] text-[#cdf68c]`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Nanayaw
            <br />
            Dev
          </motion.h2>

          <motion.div
            className="absolute left-1/2 top-1/2 h-[clamp(180px,20vw,260px)] w-[clamp(120px,13vw,175px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[999px] bg-muted"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Image
              src="/ny.jpg"
              alt="nanayawdev"
              fill
              sizes="175px"
              className="object-cover"
            />
          </motion.div>
        </div>

        <motion.div
          className="mt-10 flex justify-center text-[#cdf68c]"
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Sparkle className="h-6 w-6" fill="currentColor" />
        </motion.div>

        <div className="mx-auto mt-8 max-w-md px-8">
          <ScrollReveal
            baseOpacity={0}
            enableBlur
            baseRotation={3}
            blurStrength={8}
            containerClassName="my-0"
            textClassName="!text-base !font-normal !leading-relaxed text-white/60"
          >
            I&apos;m Nana Yaw - a designer, engineer, and strategist rolled into one, building digital products that are thoughtful, functional, and built to work.
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
