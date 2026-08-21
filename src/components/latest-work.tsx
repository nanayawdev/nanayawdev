"use client";

import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon as ArrowUpRight } from "@phosphor-icons/react";
import { useState, useEffect, useCallback } from "react";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  cover_image: string | null;
  client_url: string | null;
  slug: string;
}

const PREVIEW_W = 380;
const PREVIEW_H = 260;

function ProjectRow({
  project,
  index,
  onHoverStart,
  onHoverEnd,
}: {
  project: Project;
  index: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  return (
    <motion.div
      className="group border-t border-border last:border-b"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      viewport={{ once: true }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <Link
        href={`/projects/${project.slug}`}
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

export function LatestWork() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.ok ? r.json() : { projects: [] })
      .then((d) => {
        const list: Project[] = (d.projects ?? []).slice(0, 4);
        setProjects(list);
      });
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20, mass: 0.5 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      mouseX.set(e.clientX + 24);
      mouseY.set(e.clientY - PREVIEW_H / 2);
    },
    [mouseX, mouseY]
  );

  const hoveredProject = projects.find((p) => p.id === hoveredId);

  if (projects.length === 0) return null;

  return (
    <section className="border-t border-border bg-background py-16 lg:py-28" onMouseMove={handleMouseMove}>

      {/* Floating image preview, follows cursor */}
      <AnimatePresence>
        {hoveredProject?.cover_image && (
          <motion.div
            className="fixed top-0 left-0 z-50 pointer-events-none overflow-hidden"
            style={{ width: PREVIEW_W, height: PREVIEW_H, x: springX, y: springY }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.2 }}
          >
            <Image src={hoveredProject.cover_image} alt={hoveredProject.title} fill className="object-cover" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-8">

        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
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

        <div>
          {projects.map((project, index) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={index}
              onHoverStart={() => setHoveredId(project.id)}
              onHoverEnd={() => setHoveredId(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
