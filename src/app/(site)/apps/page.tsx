"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

interface App {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon_image: string | null;
  category: string;
  play_store_url: string | null;
  app_store_url: string | null;
  website_url: string | null;
  featured: boolean;
}

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([]);

  useEffect(() => {
    fetch("/api/apps")
      .then((r) => (r.ok ? r.json() : { apps: [] }))
      .then((d) => setApps(d.apps ?? []));
  }, []);

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
          Apps
        </motion.p>
        <motion.h1
          className="max-w-3xl text-[clamp(3.5rem,9vw,8rem)] font-semibold leading-[0.85] tracking-[-0.08em] text-foreground mb-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
        >
          Built &amp; Shipped
        </motion.h1>
        <motion.p
          className="text-muted-foreground text-lg max-w-xl mb-20"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          A few apps I&apos;ve built and published — live on the Play Store and App Store.
        </motion.p>

        {/* Empty state */}
        {apps.length === 0 && (
          <p className="text-muted-foreground text-base mb-16">No apps published yet — check back soon.</p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app, index) => (
            <motion.div
              key={app.slug}
              className="flex flex-col border border-border bg-background p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.07 }}
            >
              <div className="mb-5 flex items-start gap-4">
                {app.icon_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={app.icon_image} alt="" className="h-14 w-14 shrink-0 rounded-2xl border border-border object-cover" />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted text-lg font-bold text-muted-foreground">
                    {app.name[0]}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="mb-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {app.category}
                    {app.featured && <span className="ml-2 text-[#0a291a]">★ Featured</span>}
                  </p>
                  <h2 className="text-lg font-bold leading-snug text-foreground">{app.name}</h2>
                </div>
              </div>

              <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">{app.tagline}</p>

              <div className="flex flex-wrap gap-2">
                {app.play_store_url && (
                  <a
                    href={app.play_store_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border border-border px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-muted"
                  >
                    <Image src="/googleplay.svg" alt="" width={14} height={14} /> Play Store
                  </a>
                )}
                {app.app_store_url && (
                  <a
                    href={app.app_store_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border border-border px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-muted"
                  >
                    <Image src="/appstore.svg" alt="" width={14} height={14} /> App Store
                  </a>
                )}
                {app.website_url && (
                  <a
                    href={app.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border border-border px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-muted"
                  >
                    <Image src="/chrome.svg" alt="" width={14} height={14} /> Website
                  </a>
                )}
                {!app.play_store_url && !app.app_store_url && !app.website_url && (
                  <span className="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground/50">
                    <ExternalLink className="h-3.5 w-3.5" /> Coming soon
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
