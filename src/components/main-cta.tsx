"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

function MagneticButton({ children, href }: { children: React.ReactNode; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = (e.clientX - centerX) * 0.15;
    const distY = (e.clientY - centerY) * 0.15;
    setPosition({ x: distX, y: distY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative inline-flex items-center gap-2 border border-white text-white px-6 py-3 font-medium overflow-hidden transition-colors hover:text-black"
    >
      <motion.span
        className="absolute inset-0 bg-white"
        initial={{ x: "-100%" }}
        whileHover={{ x: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.span
        className="relative z-10 flex items-center gap-2"
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 350, damping: 15, mass: 0.5 }}
      >
        {children}
        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </motion.span>
    </Link>
  );
}

export function MainCTA() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a]">
      {/* Subtle animated mesh gradient background */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#FD4912]/30 via-transparent to-black"
          animate={{
            background: [
              "radial-gradient(circle at 20% 80%, rgba(253,73,18,0.25) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(253,73,18,0.15) 0%, transparent 40%)",
              "radial-gradient(circle at 80% 80%, rgba(253,73,18,0.25) 0%, transparent 50%), radial-gradient(circle at 20% 20%, rgba(253,73,18,0.15) 0%, transparent 40%)",
              "radial-gradient(circle at 20% 80%, rgba(253,73,18,0.25) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(253,73,18,0.15) 0%, transparent 40%)",
            ],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-end">
          {/* Headline */}
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[0.9] tracking-tight"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Ready to build
            <br />
            something great?
          </motion.h2>

          {/* CTA Section */}
          <motion.div
            className="flex flex-col gap-6 lg:items-end"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.p
              className="text-white/60 text-lg lg:text-xl max-w-sm lg:text-right leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Tell us what you&apos;re building.
              <br className="hidden lg:block" />
              We&apos;ll handle the rest.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 items-start sm:items-center lg:items-end"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <MagneticButton href="/start">
                Start a Project
              </MagneticButton>

              <Link
                href="/projects"
                className="group text-white/50 hover:text-white transition-colors text-sm font-medium underline underline-offset-4 decoration-white/30 hover:decoration-white flex items-center gap-1"
              >
                View our work
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
