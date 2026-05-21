"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { resources } from "@/lib/resources-data";

const featured = resources.find((r) => r.featured);
const rest = resources.filter((r) => !r.featured);

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 pt-40 lg:pt-52 pb-24">

        {/* Header */}
        <motion.p
          className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Resources
        </motion.p>
        <motion.h1
          className="max-w-3xl text-[clamp(3.5rem,9vw,8rem)] font-semibold leading-[0.85] tracking-[-0.08em] text-foreground mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
        >
          Insights &amp; Ideas
        </motion.h1>

        {/* Featured post */}
        {featured && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link href={`/resources/${featured.slug}`} className="group relative block overflow-hidden border border-border">
              {/* Image */}
              <div className="relative w-full aspect-[16/7] overflow-hidden">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  className="object-cover grayscale transition duration-700 group-hover:grayscale-0"
                  priority
                />
                <div className="absolute inset-0 bg-foreground/40" />
              </div>

              {/* Featured badge */}
              <div className="absolute top-5 left-5">
                <span className="bg-background px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-foreground">
                  Featured
                </span>
              </div>

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between gap-6">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-background/60 mb-3">
                    {featured.date}
                  </p>
                  <h2 className="text-2xl lg:text-4xl font-bold leading-snug text-background max-w-2xl mb-4">
                    {featured.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-muted-foreground/30 flex items-center justify-center text-[0.6rem] font-bold text-background">
                      {featured.author.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-background leading-none">
                        {featured.author}
                      </p>
                      <p className="text-[0.6rem] text-background/50 uppercase tracking-widest mt-0.5">
                        {featured.authorRole}
                      </p>
                    </div>
                  </div>
                </div>
                <span className="shrink-0 border border-background/40 px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-background transition-colors group-hover:bg-background group-hover:text-foreground">
                  Read More
                </span>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post, index) => (
            <motion.div
              key={post.slug}
              className="bg-background"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + index * 0.07 }}
            >
              <Link href={`/resources/${post.slug}`} className="group block h-full">
                {/* Image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover grayscale transition duration-700 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/10 transition-colors duration-500" />

                  {/* Overlay content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-background/60 mb-2">
                      {post.date}
                    </p>
                    <h3 className="text-lg font-bold leading-snug text-background mb-4">
                      {post.title}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-background">
                      Read More
                      <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
