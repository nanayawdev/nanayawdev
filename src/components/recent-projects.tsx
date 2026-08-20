"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon as ArrowUpRight } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  cover_image: string | null;
  client_url: string | null;
  slug: string;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      viewport={{ once: true }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group block"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          {project.cover_image ? (
            <Image
              src={project.cover_image}
              alt={project.title}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-muted" />
          )}
          <span className="absolute left-4 top-4 border border-white/30 bg-black/30 px-3 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-white backdrop-blur-md">
            {project.category}
          </span>
          <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-white/30 bg-black/30 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-1 group-hover:translate-x-1">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-semibold leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-muted-foreground">
            {project.title}
          </h3>
          <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
            {project.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export function RecentProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => (r.ok ? r.json() : { projects: [] }))
      .then((d) => setProjects((d.projects ?? []).slice(0, 3)));
  }, []);

  if (projects.length === 0) return null;

  return (
    <section className="py-16 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-12 flex flex-col gap-8 border-b border-border pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <motion.p
              className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Recent Work
            </motion.p>
            <motion.h2
              className="font-display text-4xl lg:text-6xl font-semibold text-foreground leading-none tracking-tight"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              viewport={{ once: true }}
            >
              Recent Projects
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link href="/projects">
              <motion.span
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                whileHover={{ x: 4 }}
              >
                View all <ArrowUpRight className="h-4 w-4" />
              </motion.span>
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
