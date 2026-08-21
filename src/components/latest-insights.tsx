"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRightIcon as ArrowUpRight } from "@phosphor-icons/react";
import { InsightCard, type InsightPost } from "@/components/insight-card";

export function LatestInsights() {
  const [posts, setPosts] = useState<InsightPost[]>([]);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => (r.ok ? r.json() : { posts: [] }))
      .then((d) => setPosts((d.posts ?? []).slice(0, 3)));
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="bg-background py-16 lg:py-28">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-12 flex flex-col items-start gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap items-end gap-3">
            <motion.h2
              className="text-[clamp(3.5rem,9vw,8rem)] font-semibold leading-[0.85] tracking-[-0.08em] text-foreground"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              viewport={{ once: true }}
            >
              Latest Insights
            </motion.h2>
            <motion.p
              className="pb-2 text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              (Blog)
            </motion.p>
          </div>

          <Link
            href="/resources"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-muted"
          >
            See All
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <InsightCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
