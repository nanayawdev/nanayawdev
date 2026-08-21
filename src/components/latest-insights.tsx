"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRightIcon as ArrowUpRight } from "@phosphor-icons/react";
import { Big_Shoulders } from "next/font/google";

const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: "900",
  variable: "--font-big-shoulders",
});

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover_image: string | null;
  published_at: string | null;
  created_at: string;
}

function formatDate(post: Post) {
  return new Date(post.published_at ?? post.created_at)
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toUpperCase();
}

export function LatestInsights() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => (r.ok ? r.json() : { posts: [] }))
      .then((d) => setPosts((d.posts ?? []).slice(0, 3)));
  }, []);

  if (posts.length === 0) return null;

  const [featured, ...rest] = posts;

  return (
    <section className="bg-background py-16 lg:py-28">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-3">
              <motion.h2
                className={`${bigShoulders.className} select-none text-[clamp(2.5rem,7vw,5.5rem)] font-black uppercase leading-[0.85] tracking-[-0.02em] text-foreground`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Latest Insights
              </motion.h2>
              <span className="hidden text-sm text-muted-foreground sm:inline">(Blog)</span>
            </div>
          </div>

          <Link
            href="/resources"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-muted"
          >
            See All
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Link href={`/resources/${featured.slug}`} className="group relative block h-full min-h-[420px] overflow-hidden rounded-2xl bg-muted">
              {featured.cover_image && (
                <Image
                  src={featured.cover_image}
                  alt={featured.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

              <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-black">
                {featured.category}
              </span>

              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="mb-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/70">
                  {formatDate(featured)}
                </p>
                <h3 className="text-2xl font-bold leading-tight text-white">{featured.title}</h3>
              </div>
            </Link>
          </motion.div>

          {rest.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (i + 1) * 0.08 }}
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
                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-black">
                    {post.category}
                  </span>
                </div>

                <p className="mt-4 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {formatDate(post)}
                </p>
                <h3 className="mt-2 text-xl font-bold leading-tight text-foreground">{post.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
