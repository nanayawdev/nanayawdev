"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Big_Shoulders } from "next/font/google";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import ScrollReveal from "@/components/ScrollReveal";
import WarpText from "@/components/WarpText";

const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: "900",
  variable: "--font-big-shoulders",
});

const techStack = [
  { label: "Golang", src: "/Go_dark.svg", width: 207, height: 78 },
  { label: "Next.js", src: "/Next.js_wordmark_dark.svg", width: 394, height: 80 },
  { label: "Laravel", src: "/laravel.svg", width: 256, height: 264 },
  { label: "Swift", src: "/swift.svg", width: 256, height: 256 },
  { label: "Kotlin", src: "/kotlin.svg", width: 256, height: 256 },
  { label: "Django", src: "/django.svg", width: 800, height: 800 },
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
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <WarpText
            text={"DESIGNER+\nDEVELOPER"}
            color="#fafafa"
            fontWeight={900}
            fontSize="clamp(3.6rem, 13vw, 7.5rem)"
            letterSpacing="-0.02em"
            lineHeight={0.85}
            warpStrength={0.13}
            warpScale={1.7}
            speed={0.55}
            pointerInfluence={0.64}
            pointerStrength={0.49}
            refraction={0.024}
            ripple
            className={`${bigShoulders.className} select-none`}
            style={{ height: "clamp(6.5rem, 23vw, 13.5rem)" }}
          />
        </motion.h1>

        <motion.div
          className="mt-8 flex flex-col items-center sm:mt-10 lg:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Featured Tech
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
            {techStack.map(({ label, src, width, height }) => (
              <Image key={label} src={src} alt={label} width={width} height={height} className="h-8 w-auto max-w-[84px] shrink-0" />
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-col items-center gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <ScrollReveal
            baseOpacity={0}
            enableBlur
            baseRotation={3}
            blurStrength={8}
            containerClassName="my-0 max-w-xl"
            textClassName="!text-base !font-normal !leading-relaxed text-muted-foreground text-center"
          >
            A software engineer from Ghana, building digital products across multiple mediums, from web to mobile
          </ScrollReveal>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-[#cdf68c] px-6 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#0a291a] transition-opacity hover:opacity-90"
          >
            Say Hi!
            <ArrowUpRightIcon className="h-4 w-4" weight="duotone" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
