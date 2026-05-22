"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CTACard } from "@/components/cta-card";

interface Post {
  id: string; slug: string; title: string; excerpt: string;
  body: string; category: string; cover_image: string | null;
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
        // fetch related (same category, different slug)
        fetch("/api/blog")
          .then((r) => r.json())
          .then((d) => setRelated((d.posts ?? []).filter((p: Post) => p.slug !== slug).slice(0, 2)));
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-background" />;
  if (!post) return notFound();

  const dateStr = new Date(post.published_at ?? post.created_at)
    .toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-background">

      {/* Back */}
      <div className="max-w-7xl mx-auto px-8 pt-32 lg:pt-36 mb-10">
        <Link href="/resources" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> All Resources
        </Link>
      </div>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-8 mb-10">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">
          {post.category} · {dateStr}
        </p>
        <h1 className="max-w-3xl text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.9] tracking-[-0.05em] text-foreground mb-6">
          {post.title}
        </h1>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-muted flex items-center justify-center text-[0.6rem] font-bold text-foreground border border-border">
            {post.author.split(" ").map((n) => n[0]).join("")}
          </div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground leading-none">{post.author}</p>
        </div>
      </div>

      {/* Cover image */}
      {post.cover_image && (
        <div className="relative w-full aspect-[16/7] overflow-hidden mb-16">
          <Image src={post.cover_image} alt={post.title} fill className="object-cover" priority />
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-16 lg:gap-24 items-start">

          {/* Sidebar */}
          <div className="lg:sticky lg:top-32 h-fit space-y-10">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">About this article</p>
              <p className="text-base text-muted-foreground leading-relaxed">{post.excerpt}</p>
            </div>
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Category</p>
              <span className="inline-block border border-border px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground">
                {post.category}
              </span>
            </div>
            <CTACard />
          </div>

          {/* Body */}
          <div
            className="prose-custom"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="border-t border-border">
          <div className="max-w-7xl mx-auto px-8 py-16 lg:py-20">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">Related resources</h2>
              <Link href="/resources" className="border border-border px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-muted">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {related.map((r) => (
                <Link key={r.slug} href={`/resources/${r.slug}`} className="group flex overflow-hidden border border-border bg-muted/30 transition-colors hover:bg-muted/50">
                  <div className="relative w-2/5 shrink-0 overflow-hidden bg-muted">
                    {r.cover_image && (
                      <Image src={r.cover_image} alt={r.title} fill sizes="20vw" className="object-cover grayscale transition duration-500 group-hover:grayscale-0" />
                    )}
                  </div>
                  <div className="flex flex-col justify-between p-6">
                    <div>
                      <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {r.category} · {new Date(r.published_at ?? r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      <p className="text-base font-semibold leading-snug text-foreground">{r.title}</p>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground">
                      Read More <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
