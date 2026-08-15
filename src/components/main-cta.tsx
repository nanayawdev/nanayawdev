"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import CurvedInput from "@/components/CurvedInput";

export function MainCTA() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  function handleSubmit(email: string) {
    const trimmed = email.trim();
    router.push(trimmed ? `/start?email=${encodeURIComponent(trimmed)}` : "/start");
  }

  return (
    <section className="py-16 lg:py-28 bg-background">
      <div className="max-w-3xl mx-auto px-8 flex flex-col items-center text-center">
        {/* Headline */}
        <motion.h2
          className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold text-foreground leading-[0.9] tracking-tight mb-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Ready to build
          <br />
          something great?
        </motion.h2>

        {/* Curved email input */}
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <CurvedInput
            placeholder="your email address"
            buttonText="Start a Project"
            type="email"
            theme={resolvedTheme === "dark" ? "dark" : "light"}
            buttonColor="#542e7b"
            width="100%"
            height={64}
            bend={22}
            onSubmit={handleSubmit}
          />
        </motion.div>
      </div>
    </section>
  );
}
