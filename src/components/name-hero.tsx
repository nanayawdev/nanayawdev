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
            fontSize="clamp(3.2rem, 10vw, 7.5rem)"
            letterSpacing="-0.02em"
            lineHeight={0.85}
            warpStrength={0.07}
            warpScale={1.6}
            speed={0.5}
            pointerInfluence={0.4}
            pointerStrength={0.34}
            refraction={0.016}
            ripple
            className={`${bigShoulders.className} select-none`}
            style={{ height: "clamp(5.5rem, 17vw, 13rem)" }}
          />
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
              Say Hi!
              <ArrowUpRightIcon className="h-4 w-4" weight="duotone" />
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
            <div className="grid grid-cols-3 gap-x-6 gap-y-5">
              {techStack.map(({ label, src, width, height }) => (
                <div key={label} className="flex items-center">
                  <Image src={src} alt={label} width={width} height={height} className="h-8 w-auto max-w-[84px] shrink-0" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
