"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const services = [
  {
    id: 1,
    name: "Web Design & Development",
    description: "We design visually compelling, user-centric websites that blend creativity with functional brand from scratch.",
    tags: ["UX/UI Design", "Responsive Layouts", "Web Apps"],
    image: "/hero1.avif",
  },
  {
    id: 2,
    name: "Mobile Apps Development",
    description: "We create intuitive mobile experiences that engage users and drive business growth across iOS and Android platforms.",
    tags: ["iOS", "Android", "Cross-Platform"],
    image: "/hero2.avif",
  },
  {
    id: 3,
    name: "Brand Identity",
    description: "We craft memorable brand identities that tell your story and connect with your audience on an emotional level.",
    tags: ["Logo Design", "Brand Guidelines", "Visual Identity"],
    image: "/hero6.webp",
  },
  {
    id: 4,
    name: "Digital Marketing",
    description: "We develop data-driven marketing strategies that increase visibility and convert prospects into loyal customers.",
    tags: ["SEO", "Social Media", "Content Strategy"],
    image: "/hero7.webp",
  },
];

export function Services() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="py-16 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-8">

        <motion.p
          className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          What We Do
        </motion.p>

        <div className="divide-y divide-border">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className="group relative cursor-default overflow-hidden"
              onHoverStart={() => setHovered(service.id)}
              onHoverEnd={() => setHovered(null)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
            >
              {/* Background image — fades in on hover */}
              <motion.div
                className="absolute inset-0 z-0"
                animate={{ opacity: hovered === service.id ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={service.image}
                  alt=""
                  fill
                  className="object-cover"
                  aria-hidden
                />
                <div className="absolute inset-0 bg-background/85 dark:bg-background/80" />
              </motion.div>

              <motion.div
                className="relative z-10 flex items-start gap-8 py-10 lg:py-12"
                animate={{ x: hovered === service.id ? 8 : 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Index */}
                <span className="text-sm font-medium text-muted-foreground/50 pt-2 w-10 shrink-0 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-4xl lg:text-6xl font-bold text-foreground leading-none tracking-tight mb-0">
                    {service.name}
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
                            <span
                              key={tag}
                              className="px-3 py-1 text-xs font-medium border border-border rounded-full text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Arrow indicator */}
                <motion.span
                  className="text-muted-foreground/30 text-2xl pt-1 shrink-0 select-none"
                  animate={{
                    opacity: hovered === service.id ? 1 : 0,
                    x: hovered === service.id ? 0 : -8,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  →
                </motion.span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

  );
}
