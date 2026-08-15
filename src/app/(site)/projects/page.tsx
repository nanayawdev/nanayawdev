"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";

interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  cover_image: string | null;
  client_url: string | null;
  tags: string[];
  platforms: string[];
  year: string | null;
}

const PREVIEW_W = 480;
const PREVIEW_H = 300;

export default function Projects() {
  const [projects, setProjects]     = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [hoveredId, setHoveredId]   = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.ok ? r.json() : { projects: [] })
      .then((d) => setProjects(d.projects ?? []));
  }, []);

  const filters = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

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

  const filtered = activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter);
  const hoveredProject = projects.find((p) => p.id === hoveredId);

  return (
    <div className="min-h-screen bg-background" onMouseMove={handleMouseMove}>

      {/* Floating image preview — follows cursor */}
      <AnimatePresence>
        {hoveredId && hoveredProject?.cover_image && (
          <motion.div
            className="fixed top-0 left-0 z-50 overflow-hidden bg-muted pointer-events-none"
            style={{ width: PREVIEW_W, height: PREVIEW_H, x: springX, y: springY }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.2 }}
          >
            <Image src={hoveredProject.cover_image} alt={hoveredProject.title} fill className="object-contain" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-8 pt-40 lg:pt-52 pb-24">

        {/* Header */}
        <motion.p
          className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Work
        </motion.p>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
          <motion.h1
            className="max-w-3xl text-[clamp(3.5rem,9vw,8rem)] font-semibold leading-[0.85] tracking-[-0.08em] text-foreground"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
          >
            Projects
          </motion.h1>

          {/* Filters */}
          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
                  activeFilter === f
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
                {activeFilter === f && (
                  <motion.div
                    layoutId="filter-underline"
                    className="h-px bg-foreground mt-0.5"
                  />
                )}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Project list */}
        {projects.length === 0 && (
          <p className="text-muted-foreground text-base">No projects published yet — check back soon.</p>
        )}
        <div className="divide-y divide-border">
          <AnimatePresence initial={false}>
            {filtered.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="group flex items-center gap-6 lg:gap-10 py-7 lg:py-9"
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <span className="text-xs font-medium text-muted-foreground/40 tabular-nums w-8 shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <motion.h2
                    className="font-display flex-1 text-3xl lg:text-5xl font-semibold text-foreground leading-none tracking-tight transition-colors duration-200 group-hover:text-muted-foreground"
                    animate={{ x: hoveredId === project.id ? 8 : 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {project.title}
                  </motion.h2>
                  <div className="hidden lg:flex items-center gap-2 shrink-0">
                    <span className="text-sm text-muted-foreground border border-border px-3 py-1">
                      {project.category}
                    </span>
                    {project.platforms?.map((pl) => (
                      <span key={pl} className="text-xs text-muted-foreground/70 border border-border/50 px-2 py-1">
                        {pl}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm text-muted-foreground/50 hidden lg:block">{project.year}</span>
                    <div className="w-8 h-8 border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0">
                      <ArrowUpRight className="w-3.5 h-3.5 text-foreground" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
