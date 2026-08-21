"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Big_Shoulders } from "next/font/google";
import {
  ArrowUpRightIcon,
  CodeIcon,
  BracketsCurlyIcon,
  StackIcon,
  LightningIcon,
} from "@phosphor-icons/react";
import ScrollReveal from "@/components/ScrollReveal";

const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: "900",
  variable: "--font-big-shoulders",
});

const techStack = [
  { label: "Golang", icon: CodeIcon },
  { label: "Next.js", icon: BracketsCurlyIcon },
  { label: "Laravel", icon: StackIcon },
  { label: "Swift/Kotlin", icon: LightningIcon },
];

export function NameHero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-background py-20 lg:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.p
          className="mb-4 text-sm text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Hello, I&apos;m Nana Yaw
        </motion.p>

        <motion.h1
          className={`${bigShoulders.className} select-none text-[clamp(3.2rem,10vw,7.5rem)] font-black uppercase leading-[0.85] tracking-[-0.02em] text-foreground`}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Designer+
          <br />
          Developer
        </motion.h1>

        <div className="mt-16 grid grid-cols-1 items-center gap-10 text-left lg:grid-cols-[1fr_1.1fr_1fr] lg:gap-8">
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <ScrollReveal
              baseOpacity={0}
              enableBlur
              baseRotation={3}
              blurStrength={8}
              containerClassName="my-0"
              textClassName="!text-base !font-normal !leading-relaxed text-muted-foreground"
            >
              A software engineer from Ghana, building digital products across multiple mediums, from web to mobile
            </ScrollReveal>

            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-background transition-opacity hover:opacity-90"
            >
              Contact Now
              <ArrowUpRightIcon className="h-4 w-4" weight="bold" />
            </Link>
          </motion.div>

          <motion.div
            className="relative order-1 mx-auto h-[320px] w-[260px] overflow-hidden rounded-2xl bg-muted lg:order-2 lg:h-[380px] lg:w-[300px]"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Image
              src="/ny.jpg"
              alt="Nana Yaw"
              fill
              sizes="300px"
              className="object-cover"
            />
          </motion.div>

          <motion.div
            className="order-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Featured Tech
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {techStack.map(({ label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-foreground" weight="duotone" />
                  <span className="text-sm text-foreground">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
