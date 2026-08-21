"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export interface InsightPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  published_at: string | null;
  created_at: string;
}

function formatDate(post: InsightPost) {
  return new Date(post.published_at ?? post.created_at)
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toUpperCase();
}

export function InsightCard({ post, index = 0 }: { post: InsightPost; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
    >
      <Link href={`/resources/${post.slug}`} className="group block">
        <div className="relative h-52 w-full overflow-hidden rounded-2xl bg-muted">
          {post.cover_image && (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>

        <p className="mt-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {formatDate(post)}
        </p>
        <h3 className="mt-2 text-xl font-bold leading-tight text-foreground">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
      </Link>
    </motion.div>
  );
}
