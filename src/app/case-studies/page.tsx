"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const caseStudies = [
  {
    slug: "thomisia-travel",
    client: "Thomisia Travel",
    category: "Web Development",
    outcome: "3× increase in online bookings",
    year: "2024",
    image: "/hero1.avif",
  },
  {
    slug: "urban-drive",
    client: "Urban Drive",
    category: "Mobile App",
    outcome: "10,000 rides in first 60 days",
    year: "2024",
    image: "/hero2.avif",
  },
  {
    slug: "evvents-africa",
    client: "Evvents Africa",
    category: "Web Platform",
    outcome: "50+ events managed at launch",
    year: "2023",
    image: "/hero3.avif",
  },
  {
    slug: "urban-tickets",
    client: "Urban Tickets",
    category: "Mobile App",
    outcome: "20,000 tickets sold in 90 days",
    year: "2023",
    image: "/hero6.webp",
  },
  {
    slug: "healthier-bt",
    client: "Healthier BT",
    category: "Web & Brand",
    outcome: "40% rise in consultation bookings",
    year: "2023",
    image: "/hero7.webp",
  },
];

export default function CaseStudies() {
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
          Case Studies
        </motion.p>
        <motion.h1
          className="max-w-3xl text-[clamp(3.5rem,9vw,8rem)] font-semibold leading-[0.85] tracking-[-0.08em] text-foreground mb-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
        >
          The Work
          <br />
          Behind the Work
        </motion.h1>
        <motion.p
          className="text-muted-foreground text-lg max-w-xl mb-20"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Five stories of real problems, real solutions, and real results for African brands.
        </motion.p>

        {/* Editorial list */}
        <div className="divide-y divide-border">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              viewport={{ once: true }}
            >
              <Link href={`/case-studies/${study.slug}`} className="group flex items-center gap-8 py-8 lg:py-10">

                {/* Index */}
                <span className="text-sm font-medium text-muted-foreground/40 tabular-nums w-8 shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-6 mb-2">
                    <h2 className="text-2xl lg:text-4xl font-bold text-foreground leading-tight group-hover:text-muted-foreground transition-colors duration-200">
                      {study.client}
                    </h2>
                    <span className="text-sm text-muted-foreground border border-border px-3 py-0.5 rounded-full w-fit">
                      {study.category}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-base">{study.outcome}</p>
                </div>

                {/* Thumbnail */}
                <div className="relative w-20 h-14 lg:w-32 lg:h-20 rounded-xl overflow-hidden shrink-0 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  <Image src={study.image} alt={study.client} fill className="object-cover" />
                </div>

                {/* Year + Arrow */}
                <div className="hidden lg:flex flex-col items-end gap-2 shrink-0">
                  <span className="text-sm text-muted-foreground/50">{study.year}</span>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0" />
                </div>

              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
