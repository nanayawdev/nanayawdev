"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUp, Facebook, Link2, Linkedin, Twitter, Check } from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import { splitHtmlForAd } from "@/lib/ad-utils";

interface Post {
  id: string; slug: string; title: string; excerpt: string;
  body: string; category: string; tags: string[]; cover_image: string | null;
  featured: boolean; author: string;
  published_at: string | null; created_at: string;
}

const SITE_URL = "https://nanayawdev.com";

export default function ResourceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost]       = useState<Post | null>(null);
  const [related, setRelated] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [copied, setCopied]   = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            setRelated([...sameCategory, ...rest].slice(0, 4));
          });
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-background" />;
  if (!post) return notFound();

  const dateStr = new Date(post.published_at ?? post.created_at)
    .toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const pageUrl = `${SITE_URL}/resources/${slug}`;
  const shareLinks = [
    { icon: Twitter, label: "Share on X", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(post.title)}` },
    { icon: Linkedin, label: "Share on LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}` },
    { icon: Facebook, label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}` },
  ];

  function copyLink() {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const [bodyFirstHalf, bodySecondHalf] = splitHtmlForAd(post.body);

  return (
    <div className="min-h-screen bg-background">

      <div className="mx-auto flex max-w-6xl gap-6 px-8 pt-32 lg:pt-40">

        {/* Share rail */}
        <div className="hidden shrink-0 lg:sticky lg:top-40 lg:flex lg:h-fit lg:w-12 lg:flex-col lg:items-center lg:gap-3">
          {shareLinks.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
          <button
            onClick={copyLink}
            aria-label="Copy link"
            className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
          </button>
        </div>

        <div className="min-w-0 flex-1">

          {/* Back */}
          <Link href="/resources" className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All Resources
          </Link>

          {/* Hero — centered */}
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Link href={`/resources?category=${encodeURIComponent(post.category)}`} className="text-foreground transition-colors hover:text-muted-foreground">
                {post.category}
              </Link>
              {" · "}{dateStr}
            </p>

            <h1 className="mb-6 text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[0.95] tracking-[-0.03em] text-foreground">
              {post.title}
            </h1>

            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>

            <div className="mb-12 flex items-center justify-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center border border-border bg-muted text-[0.6rem] font-bold text-foreground">
                {post.author.split(" ").map((n) => n[0]).join("")}
              </div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground leading-none">
                By {post.author}
              </p>
            </div>

            {/* Mobile share row */}
            <div className="mb-12 flex items-center justify-center gap-3 lg:hidden">
              {shareLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
              <button
                onClick={copyLink}
                aria-label="Copy link"
                className="flex h-9 w-9 items-center justify-center border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Cover image */}
          {post.cover_image && (
            <div className="relative mx-auto aspect-[16/9] w-full max-w-4xl overflow-hidden">
              <Image src={post.cover_image} alt={post.title} fill className="object-cover" priority />
            </div>
          )}

          {/* Display ad — below the hero, above the body */}
          <div className="mx-auto mt-10 max-w-3xl">
            <AdSlot format="auto" className="min-h-[100px]" />
          </div>

          {/* Sidebar + body */}
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 py-16 lg:grid-cols-[220px_1fr] lg:py-20">

            {/* More resources */}
            {related.length > 0 && (
              <aside className="order-2 lg:order-1 lg:sticky lg:top-40 lg:h-fit">
                <p className="mb-5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">More Resources</p>
                <div className="space-y-5">
                  {related.map((r) => (
                    <Link key={r.slug} href={`/resources/${r.slug}`} className="group flex gap-3">
                      {r.cover_image && (
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm opacity-80 transition-opacity duration-300 group-hover:opacity-100">
                          <Image src={r.cover_image} alt={r.title} fill className="object-cover" />
                        </div>
                      )}
                      <p className="text-sm font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-[#cdf68c]">
                        {r.title}
                      </p>
                    </Link>
                  ))}
                </div>

                {/* Sidebar display ad */}
                <AdSlot format="auto" className="mt-8 min-h-[250px]" />
              </aside>
            )}

            {/* Body */}
            <div className="order-1 min-w-0 lg:order-2">
              <div className="prose-custom prose-dropcap" dangerouslySetInnerHTML={{ __html: bodyFirstHalf }} />

              {/* In-article ad — injected mid-post for longer articles */}
              {bodySecondHalf && <AdSlot format="in-article" className="my-8" />}

              {bodySecondHalf && (
                <div className="prose-custom" dangerouslySetInnerHTML={{ __html: bodySecondHalf }} />
              )}

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

              {/* Matched content — native recirculation unit */}
              <AdSlot format="matched-content" className="mt-14 min-h-[300px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`fixed bottom-6 left-6 z-50 flex h-10 w-10 items-center justify-center border border-border bg-background text-foreground transition-all duration-300 hover:bg-muted ${
          showBackToTop ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        <ArrowUp className="h-4 w-4" />
      </button>

    </div>
  );
}
