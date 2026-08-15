"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { CTACard } from "@/components/cta-card";

interface Stat { label: string; value: string; }
interface CaseStudy {
  id: string; slug: string; client: string; category: string; year: string | null;
  tagline: string; cover_image: string | null; client_url: string | null;
  services: string[]; stats: Stat[];
  problem: string; approach: string; result: string;
  result_headline: string; result_body: string;
}

export default function CaseStudyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [study, setStudy]   = useState<CaseStudy | null>(null);
  const [related, setRelated] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/case-studies/${slug}`)
      .then((r) => { if (r.status === 404) { setLoading(false); return null; } return r.json(); })
      .then((data) => {
        if (!data) return;
        const cs = data.case_study;
        if (typeof cs.stats === "string") cs.stats = JSON.parse(cs.stats);
        setStudy(cs);
        fetch("/api/case-studies")
          .then((r) => r.json())
          .then((d) => setRelated((d.case_studies ?? []).filter((s: CaseStudy) => s.slug !== slug).slice(0, 2)));
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-background" />;
  if (!study) return notFound();

  const stats: Stat[] = Array.isArray(study.stats) ? study.stats.filter((s) => s.value && s.label) : [];

  return (
    <div className="min-h-screen bg-background">

      {/* Back */}
      <div className="max-w-7xl mx-auto px-8 pt-32 lg:pt-36 mb-12">
        <Link href="/case-studies" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> All Case Studies
        </Link>
      </div>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-8 mb-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
              {study.category}{study.year ? ` · ${study.year}` : ""}
            </p>
            <h1 className="font-display text-5xl lg:text-8xl font-semibold text-foreground leading-none tracking-tight mb-4">{study.client}</h1>
            <p className="text-xl text-muted-foreground max-w-xl">{study.tagline}</p>
          </div>
          {study.client_url && (
            <a href={study.client_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-90 shrink-0">
              Visit Site <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Hero image */}
      {study.cover_image && (
        <div className="relative w-full aspect-[16/7] overflow-hidden mb-16">
          <Image src={study.cover_image} alt={study.client} fill className="object-cover" />
        </div>
      )}

      {/* Stats */}
      {stats.length > 0 && (
        <div className="border-y border-border">
          <div className="max-w-7xl mx-auto px-8 py-12">
            <div className={`grid grid-cols-${stats.length} divide-x divide-border`}>
              {stats.map((stat) => (
                <div key={stat.label} className="px-8 first:pl-0 last:pr-0 text-center">
                  <p className="text-4xl lg:text-6xl font-bold text-foreground mb-2">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Story */}
      <div className="max-w-7xl mx-auto px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-16 lg:gap-24">
          <div className="lg:sticky lg:top-32 h-fit space-y-10">
            {study.services.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Services</p>
                <ul className="space-y-2">
                  {study.services.map((s) => <li key={s} className="text-base text-foreground font-medium">{s}</li>)}
                </ul>
              </div>
            )}
            <CTACard />
          </div>

          <div className="space-y-14">
            {[
              { label: "The Problem", body: study.problem },
              { label: "My Approach", body: study.approach },
            ].filter((x) => x.body).map(({ label, body }) => (
              <div key={label}>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">{label}</p>
                <p className="text-foreground text-lg leading-relaxed">{body}</p>
              </div>
            ))}

            {(study.result || study.result_headline) && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Results</p>
                {study.result_headline && (
                  <h3 className="text-2xl font-bold leading-snug text-foreground mb-4">{study.result_headline}</h3>
                )}
                {study.result && <p className="text-foreground text-lg leading-relaxed mb-8">{study.result}</p>}
                {stats.length > 0 && (
                  <>
                    <p className="text-sm text-muted-foreground mb-6">The results are clear:</p>
                    <div className={`grid grid-cols-${stats.length} divide-x divide-border border border-border mb-8`}>
                      {stats.map((stat) => (
                        <div key={stat.label} className="bg-muted/40 px-5 py-6">
                          <p className="text-3xl font-bold text-foreground mb-2">{stat.value}</p>
                          <p className="text-xs leading-snug text-muted-foreground">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {study.result_body && <p className="text-foreground text-lg leading-relaxed">{study.result_body}</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="border-t border-border">
          <div className="max-w-7xl mx-auto px-8 py-16 lg:py-20">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">More case studies</h2>
              <Link href="/case-studies" className="border border-border px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-muted">View All</Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {related.map((r) => (
                <Link key={r.slug} href={`/case-studies/${r.slug}`} className="group flex overflow-hidden border border-border bg-muted/30 transition-colors hover:bg-muted/50">
                  <div className="relative w-2/5 shrink-0 overflow-hidden bg-muted">
                    {r.cover_image && (
                      <Image src={r.cover_image} alt={r.client} fill sizes="20vw" className="object-cover grayscale transition duration-500 group-hover:grayscale-0" />
                    )}
                  </div>
                  <div className="flex flex-col justify-between p-6">
                    <div>
                      <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{r.client}</p>
                      <p className="text-base font-semibold leading-snug text-foreground">{r.result_headline}</p>
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
