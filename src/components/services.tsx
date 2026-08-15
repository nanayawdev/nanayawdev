"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  cover_image: string | null;
}

export function Services({ showHeading = true }: { showHeading?: boolean }) {
  const [services, setServices] = useState<Service[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.ok ? r.json() : { services: [] })
      .then((d) => setServices(d.services ?? []));
  }, []);

  return (
    <section className="py-16 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-8">

        {showHeading && (
          <div className="mb-12">
            <motion.p
              className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              What I Do
            </motion.p>
            <motion.h2
              className="max-w-3xl text-[clamp(3.5rem,9vw,8rem)] font-semibold leading-[0.85] tracking-[-0.08em] text-foreground"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              viewport={{ once: true }}
            >
              My Services
            </motion.h2>
          </div>
        )}

        <div className="divide-y divide-border">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className="group relative overflow-hidden"
              onHoverStart={() => setHovered(service.id)}
              onHoverEnd={() => setHovered(null)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              {/* Background image — fades in on hover */}
              {service.cover_image && (
                <motion.div
                  className="absolute inset-0 z-0"
                  animate={{ opacity: hovered === service.id ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Image src={service.cover_image} alt="" fill className="object-cover" aria-hidden />
                  <div className="absolute inset-0 bg-background/85 dark:bg-background/80" />
                </motion.div>
              )}

              <Link href={`/services/${service.slug}`}>
                <motion.div
                  className="relative z-10 flex items-start gap-8 py-10 lg:py-12"
                  animate={{ x: hovered === service.id ? 8 : 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <span className="text-sm font-medium text-muted-foreground/50 pt-2 w-10 shrink-0 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-4xl lg:text-6xl font-bold text-foreground leading-none tracking-tight mb-0">
                      {service.title}
                    </h3>

                    <AnimatePresence>
                      {hovered === service.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <p className="text-muted-foreground text-base lg:text-lg leading-relaxed mb-4 max-w-2xl">
                            {service.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {service.tags.map((tag) => (
                              <span key={tag} className="px-3 py-1 text-xs font-medium border border-border rounded-full text-muted-foreground">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.span
                    className="text-muted-foreground/30 text-2xl pt-1 shrink-0 select-none"
                    animate={{ opacity: hovered === service.id ? 1 : 0, x: hovered === service.id ? 0 : -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    →
                  </motion.span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

  );
}
