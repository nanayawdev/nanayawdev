"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { CTACard } from "@/components/cta-card";

interface Service {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  body: string;
  cover_image: string | null;
  tags: string[];
}

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/services/${slug}`)
      .then((r) => { if (r.status === 404) { setLoading(false); return null; } return r.json(); })
      .then((data) => {
        if (!data) return;
        setService(data.service);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-background" />;
  if (!service) return notFound();

  return (
    <div className="min-h-screen bg-background">

      {/* Back */}
      <div className="max-w-7xl mx-auto px-8 pt-32 lg:pt-36 mb-12">
        <Link href="/services" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> All Services
        </Link>
      </div>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-8 mb-10">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">Service</p>
        <h1 className="text-5xl lg:text-8xl font-bold text-foreground leading-none tracking-tight mb-4">
          {service.title}
        </h1>
        {service.tagline && (
          <p className="text-xl text-muted-foreground max-w-2xl">{service.tagline}</p>
        )}
      </div>

      {/* Cover image */}
      {service.cover_image && (
        <div className="relative w-full aspect-[16/7] overflow-hidden mb-16">
          <Image src={service.cover_image} alt={service.title} fill className="object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-16 lg:gap-24">

          {/* Sidebar */}
          <div className="lg:sticky lg:top-32 h-fit space-y-10">
            {service.tags.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">What&apos;s included</p>
                <ul className="space-y-2">
                  {service.tags.map((tag) => (
                    <li key={tag} className="flex items-center gap-2 text-base text-foreground font-medium">
                      <span className="w-1 h-1 bg-foreground rounded-full shrink-0" />
                      {tag}
                    </li>
                  ))}
                </ul>
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
            {service.description && !service.body && (
              <p className="text-foreground text-lg leading-relaxed">{service.description}</p>
            )}
            {service.body && (
              <div className="prose-custom" dangerouslySetInnerHTML={{ __html: service.body }} />
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
