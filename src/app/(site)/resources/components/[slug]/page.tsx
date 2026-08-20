"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon as ArrowLeft, CheckIcon as Check, CopyIcon as Copy, DownloadIcon as Download, FileIcon as FileIcon } from "@phosphor-icons/react";
import { CTACard } from "@/components/cta-card";

interface ComponentFile {
  name: string;
  url: string;
  size: number;
}

interface ComponentResource {
  id: string; slug: string; title: string; description: string;
  prompt: string; category: string; cover_image: string | null;
  files: ComponentFile[]; featured: boolean; author: string;
  published_at: string | null; created_at: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ComponentDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [component, setComponent] = useState<ComponentResource | null>(null);
  const [loading, setLoading]     = useState(true);
  const [copied, setCopied]       = useState(false);

  useEffect(() => {
    fetch(`/api/components/${slug}`)
      .then((r) => { if (r.status === 404) { setLoading(false); return null; } return r.json(); })
      .then((data) => {
        if (data) setComponent(data.component);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-background" />;
  if (!component) return notFound();

  const dateStr = new Date(component.published_at ?? component.created_at)
    .toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  async function copyPrompt() {
    if (!component) return;
    await navigator.clipboard.writeText(component.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
          {component.category} · {dateStr}
        </p>
        <h1 className="max-w-3xl text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.9] tracking-[-0.05em] text-foreground mb-6">
          {component.title}
        </h1>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-muted flex items-center justify-center text-[0.6rem] font-bold text-foreground border border-border">
            {component.author.split(" ").map((n) => n[0]).join("")}
          </div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground leading-none">{component.author}</p>
        </div>
      </div>

      {/* Cover image */}
      {component.cover_image && (
        <div className="relative w-full aspect-[16/7] overflow-hidden mb-16">
          <Image src={component.cover_image} alt={component.title} fill className="object-cover" priority />
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-16 lg:gap-24 items-start">

          {/* Sidebar */}
          <div className="lg:sticky lg:top-32 h-fit space-y-10">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">About this component</p>
              <p className="text-base text-muted-foreground leading-relaxed">{component.description}</p>
            </div>
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">Category</p>
              <span className="inline-block border border-border px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground">
                {component.category}
              </span>
            </div>

            {/* Files */}
            {component.files.length > 0 && (
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-3">
                  Files ({component.files.length})
                </p>
                <div className="divide-y divide-border border border-border">
                  {component.files.map((f, i) => (
                    <a
                      key={`${f.url}-${i}`}
                      href={f.url}
                      download={f.name}
                      className="group flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-muted/40"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <FileIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="truncate text-sm text-foreground">{f.name}</span>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-[0.6rem] uppercase tracking-widest text-muted-foreground">{formatSize(f.size)}</span>
                        <Download className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <CTACard />
          </div>

          {/* Prompt */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">The Prompt</p>
              <button
                onClick={copyPrompt}
                className="flex items-center gap-2 border border-border px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-muted"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy Prompt"}
              </button>
            </div>
            <pre className="whitespace-pre-wrap break-words border border-border bg-muted/20 p-6 font-mono text-xs leading-relaxed text-foreground">
              {component.prompt}
            </pre>
          </div>
        </div>
      </div>

    </div>
  );
}
