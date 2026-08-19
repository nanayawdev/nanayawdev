"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

interface Post {
  id: string; slug: string; title: string; excerpt: string;
  body: string; category: string; tags: string[]; cover_image: string | null;
  featured: boolean; author: string;
  published_at: string | null; created_at: string;
}


export default function ResourceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost]       = useState<Post | null>(null);
  const [related, setRelated] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then((r) => { if (r.status === 404) { setLoading(false); return null; } return r.json(); })
      .then((data) => {
        if (!data) return;
        setPost(data.post);
        // fetch related — prioritize same category, fall back to others
        fetch("/api/blog")
          .then((r) => r.json())
          .then((d) => {
            const others = (d.posts ?? []).filter((p: Post) => p.slug !== slug);
            const sameCategory = others.filter((p: Post) => p.category === data.post.category);
            const rest = others.filter((p: Post) => p.category !== data.post.category);
            setRelated([...sameCategory, ...rest].slice(0, 2));
          });
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-background" />;
  if (!post) return notFound();

  const dateStr = new Date(post.published_at ?? post.created_at)
    .toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-background">

      {/* Cover image — full-bleed hero, only when present */}
      {post.cover_image && (
        <div className="relative mt-20 aspect-[21/9] w-full overflow-hidden lg:mt-24">
          <Image src={post.cover_image} alt={post.title} fill className="object-cover" priority />
        </div>
      )}

      <div className={`mx-auto max-w-3xl px-8 pb-24 ${post.cover_image ? "pt-12" : "pt-32 lg:pt-40"}`}>

        {/* Back */}
        <Link href="/resources" className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> All Resources
        </Link>

        {/* Meta */}
        <p className="mb-5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          <Link href={`/resources?category=${encodeURIComponent(post.category)}`} className="text-foreground transition-colors hover:text-muted-foreground">
            {post.category}
          </Link>
          {" · "}{dateStr}
        </p>

        {/* Title */}
        <h1 className="mb-6 text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[0.95] tracking-[-0.03em] text-foreground">
          {post.title}
        </h1>

        {/* Excerpt / dek */}
        <p className="mb-8 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>

        {/* Author */}
        <div className="mb-10 flex items-center gap-3 border-y border-border py-5">
          <div className="flex h-9 w-9 items-center justify-center border border-border bg-muted text-[0.6rem] font-bold text-foreground">
            {post.author.split(" ").map((n) => n[0]).join("")}
          </div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground leading-none">{post.author}</p>
        </div>

        {/* Body */}
        <div className="prose-custom" dangerouslySetInnerHTML={{ __html: post.body }} />

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="mt-14 flex flex-wrap gap-2 border-t border-border pt-8">
            {post.tags.map((t) => (
              <span key={t} className="text-[0.7rem] uppercase tracking-wider text-muted-foreground/60">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="border-t border-border">
          <div className="mx-auto max-w-3xl px-8 py-16 lg:py-20">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Related resources</h2>
              <Link href="/resources" className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:text-muted-foreground">
                View All
              </Link>
            </div>
            <div className="divide-y divide-border">
              {related.map((r) => (
                <Link key={r.slug} href={`/resources/${r.slug}`} className="group flex items-center gap-6 py-6">
                  <div className="min-w-0 flex-1">
                    <p className="mb-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {r.category}
                    </p>
                    <p className="text-lg font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-muted-foreground">
                      {r.title}
                    </p>
                  </div>
                  {r.cover_image && (
                    <div className="relative h-14 w-20 shrink-0 self-stretch overflow-hidden rounded-xl opacity-70 transition-opacity duration-300 group-hover:opacity-100">
                      <Image src={r.cover_image} alt={r.title} fill className="object-cover" />
                    </div>
                  )}
                  <ArrowUpRight className="h-5 w-5 shrink-0 translate-x-1 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
