"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover_image: string | null;
  featured: boolean;
  author: string;
  published_at: string | null;
  created_at: string;
}

const PER_PAGE = 6;

export default function ResourcesPage() {
  const [posts, setPosts]   = useState<Post[]>([]);
  const [page, setPage]     = useState(1);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((d) => setPosts(d.posts ?? []));
  }, []);

  const featured   = posts.find((p) => p.featured) ?? posts[0] ?? null;
  const rest       = posts.filter((p) => p !== featured);
  const totalPages = Math.ceil(rest.length / PER_PAGE);
  const paginated  = rest.slice((page - 1) * PER_PAGE, page * PER_PAGE);

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

        {/* Empty state */}
        {posts.length === 0 && (
          <p className="text-muted-foreground text-base mb-16">No articles published yet — check back soon.</p>
        )}

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
              <div className="relative w-full aspect-[16/7] overflow-hidden bg-muted">
                {featured.cover_image && (
                  <Image
                    src={featured.cover_image}
                    alt={featured.title}
                    fill
                    className="object-cover transition duration-700 group-hover:grayscale"
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-foreground/40" />
              </div>

              {/* Featured badge */}
              {featured.featured && (
                <div className="absolute top-5 left-5">
                  <span className="bg-background px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-foreground">
                    Featured
                  </span>
                </div>
              )}

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between gap-6">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-background/60 mb-3">
                    {new Date(featured.published_at ?? featured.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  <h2 className="text-2xl lg:text-4xl font-bold leading-snug text-background max-w-2xl mb-4">
                    {featured.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-muted-foreground/30 flex items-center justify-center text-[0.6rem] font-bold text-background">
                      {featured.author.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-background leading-none">
                      {featured.author}
                    </p>
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
          {paginated.map((post, index) => (
            <motion.div
              key={post.slug}
              className="bg-background"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + index * 0.07 }}
            >
              <Link href={`/resources/${post.slug}`} className="group block h-full">
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted">
                  {post.cover_image && (
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      className="object-cover transition duration-700 group-hover:grayscale"
                    />
                  )}
                  <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/10 transition-colors duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-background/60 mb-2">
                      {new Date(post.published_at ?? post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <h3 className="text-lg font-bold leading-snug text-background mb-4">{post.title}</h3>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-2">
            {/* Prev */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-10 w-10 items-center justify-center border border-border text-foreground transition-colors hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`flex h-10 w-10 items-center justify-center text-[0.65rem] font-semibold tracking-[0.18em] transition-colors ${
                  page === n
                    ? "border border-foreground bg-foreground text-background"
                    : "border border-border text-foreground hover:bg-muted"
                }`}
              >
                {n}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-10 w-10 items-center justify-center border border-border text-foreground transition-colors hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
