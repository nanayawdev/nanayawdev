"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  cover_image: string | null;
  client_url: string | null;
  slug: string;
}

function ProjectRow({
  project,
  index,
  onPreview,
}: {
  project: Project;
  index: number;
  onPreview: () => void;
}) {
  const href = project.client_url ?? `/projects`;
  const isExternal = href.startsWith("http");

  return (
    <motion.div
      className="group border-t border-border last:border-b"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      viewport={{ once: true }}
      onMouseEnter={onPreview}
    >
      <Link
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="grid gap-6 py-7 transition-colors duration-300 hover:bg-muted/30 md:grid-cols-[4rem_1fr_0.9fr_auto] md:items-center md:px-4 lg:py-9"
      >
        <span className="text-xs text-muted-foreground/50 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div>
          <p className="mb-2 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {project.category}
          </p>
          <h3 className="text-3xl font-semibold leading-none tracking-[-0.045em] text-foreground md:text-4xl">
            {project.title}
          </h3>
        </div>

        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <span className="flex h-11 w-11 items-center justify-center border border-border text-muted-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:border-foreground group-hover:text-foreground">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </Link>
    </motion.div>
  );
}

function ProjectPreview({ project }: { project: Project }) {
  return (
    <motion.div
      key={project.id}
      className="sticky top-28 hidden overflow-hidden border border-border bg-muted lg:block"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="relative aspect-[4/5]">
        {project.cover_image ? (
          <Image
            src={project.cover_image}
            alt={project.title}
            fill
            sizes="33vw"
            className="object-cover grayscale transition duration-700 hover:grayscale-0"
          />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="mb-2 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-white/60">
            Current Preview
          </p>
          <h3 className="text-3xl font-semibold leading-none tracking-[-0.045em] text-white">
            {project.title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}

export function LatestWork() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.ok ? r.json() : { projects: [] })
      .then((d) => {
        const list: Project[] = (d.projects ?? []).slice(0, 4);
        setProjects(list);
        if (list.length > 0) setActiveProject(list[0]);
      });
  }, []);

  if (projects.length === 0) return null;

  return (
    <section className="border-t border-border bg-background py-16 lg:py-28">
      <div className="max-w-7xl mx-auto px-8">

        <div className="mb-12 grid grid-cols-1 gap-8 border-b border-border pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <motion.p
              className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              My Work
            </motion.p>
            <motion.h2
              className="max-w-3xl text-[clamp(3.5rem,9vw,8rem)] font-semibold leading-[0.85] tracking-[-0.08em] text-foreground"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              viewport={{ once: true }}
            >
              Latest
              <br />
              Projects
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

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_420px]">
          <div>
            {projects.map((project, index) => (
              <ProjectRow
                key={project.id}
                project={project}
                index={index}
                onPreview={() => setActiveProject(project)}
              />
            ))}
          </div>

          {activeProject && <ProjectPreview project={activeProject} />}
        </div>
      </div>
    </section>
  );
}
