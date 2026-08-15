"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { CTACard } from "@/components/cta-card";

interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  cover_image: string | null;
  client_name: string | null;
  client_url: string | null;
  tags: string[];
  platforms: string[];
  year: string | null;
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [related, setRelated] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${slug}`)
      .then((r) => { if (r.status === 404) { setLoading(false); return null; } return r.json(); })
      .then((data) => {
        if (!data) return;
        setProject(data.project);
        fetch("/api/projects")
          .then((r) => r.json())
          .then((d) => setRelated((d.projects ?? []).filter((p: Project) => p.slug !== slug).slice(0, 2)));
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-background" />;
  if (!project) return notFound();

  return (
    <div className="min-h-screen bg-background">

      {/* Back */}
      <div className="max-w-7xl mx-auto px-8 pt-32 lg:pt-36 mb-12">
        <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> All Projects
        </Link>
      </div>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-8 mb-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
              {project.category}{project.year ? ` · ${project.year}` : ""}
            </p>
            <h1 className="font-display text-5xl lg:text-8xl font-semibold text-foreground leading-none tracking-tight mb-4">
              {project.title}
            </h1>
            {project.client_name && (
              <p className="text-xl text-muted-foreground max-w-xl">Built for {project.client_name}</p>
            )}
          </div>
          {project.client_url && (
            <a href={project.client_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-90 shrink-0">
              Visit Live Site <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Cover image */}
      {project.cover_image && (
        <div className="relative w-full aspect-[16/7] overflow-hidden mb-16">
          <Image src={project.cover_image} alt={project.title} fill className="object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-16 lg:gap-24">

          {/* Sidebar */}
          <div className="lg:sticky lg:top-32 h-fit space-y-10">
            {project.tags.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Built With</p>
                <ul className="space-y-2">
                  {project.tags.map((tag) => (
                    <li key={tag} className="flex items-center gap-2 text-base text-foreground font-medium">
                      <span className="w-1 h-1 bg-foreground rounded-full shrink-0" />
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.platforms.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Platforms</p>
                <div className="flex flex-wrap gap-2">
                  {project.platforms.map((platform) => (
                    <span key={platform} className="text-sm text-muted-foreground border border-border px-3 py-1">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Link
                href="/start"
                className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-90"
              >
                Start a Project <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <CTACard />
          </div>

          {/* Body */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">About This Project</p>
            <p className="text-foreground text-lg leading-relaxed">{project.description}</p>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="border-t border-border">
          <div className="max-w-7xl mx-auto px-8 py-16 lg:py-20">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">More projects</h2>
              <Link href="/projects" className="border border-border px-5 py-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:bg-muted">View All</Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {related.map((r) => (
                <Link key={r.slug} href={`/projects/${r.slug}`} className="group flex overflow-hidden border border-border bg-muted/30 transition-colors hover:bg-muted/50">
                  <div className="relative w-2/5 shrink-0 overflow-hidden bg-muted">
                    {r.cover_image && (
                      <Image src={r.cover_image} alt={r.title} fill sizes="20vw" className="object-cover grayscale transition duration-500 group-hover:grayscale-0" />
                    )}
                  </div>
                  <div className="flex flex-col justify-between p-6">
                    <div>
                      <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{r.category}</p>
                      <p className="text-base font-semibold leading-snug text-foreground">{r.title}</p>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-foreground">
                      View Project <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
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
