"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import { useState, useCallback } from "react";
import { ArrowUpRight } from "lucide-react";

const projects = [
  { id: 1, title: "Thomisia Travel", category: "Web", year: "2024", description: "Travel & Tour Platform", image: "/hero1.avif", url: "https://thomisiatravelandtour.com" },
  { id: 2, title: "Urban Drive", category: "Mobile", year: "2024", description: "Ride Booking App", image: "/hero2.avif", url: "https://urbandriveapp.vercel.app" },
  { id: 3, title: "Evvents Africa", category: "Web", year: "2023", description: "Event Management Platform", image: "/hero3.avif", url: "https://evventsafrica.vercel.app" },
  { id: 4, title: "Urban Tickets", category: "Mobile", year: "2023", description: "Ticketing Platform", image: "/hero6.webp", url: "https://urbantickets.app" },
  { id: 5, title: "Healthier BT", category: "Web", year: "2023", description: "Health & Wellness", image: "/hero7.webp", url: "https://healthierbtsolutions.com" },
  { id: 6, title: "Atink News", category: "Web", year: "2023", description: "News & Media Platform", image: "/hero8.jpg", url: "https://atinknews.net" },
  { id: 7, title: "Licia Luxe", category: "Brand", year: "2022", description: "Luxury Fashion Brand", image: "/hero1.avif", url: "https://licialuxe.vercel.app" },
  { id: 8, title: "SMS App", category: "Mobile", year: "2022", description: "Bulk Messaging Platform", image: "/hero2.avif", url: "https://smsappv1.vercel.app" },
];

const filters = ["All", "Web", "Mobile", "Brand"];

const PREVIEW_W = 380;
const PREVIEW_H = 260;

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [hoveredId, setHoveredId] = useState<number | null>(null);

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

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const hoveredProject = projects.find((p) => p.id === hoveredId);

  return (
    <div className="min-h-screen bg-background" onMouseMove={handleMouseMove}>

      {/* Floating image preview — follows cursor */}
      <AnimatePresence>
        {hoveredId && hoveredProject && (
          <motion.div
            className="fixed top-0 left-0 z-50 pointer-events-none rounded-2xl overflow-hidden"
            style={{
              width: PREVIEW_W,
              height: PREVIEW_H,
              x: springX,
              y: springY,
            }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src={hoveredProject.image}
              alt={hoveredProject.title}
              fill
              className="object-cover"
            />
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
          Our Work
        </motion.p>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
          <motion.h1
            className="text-5xl lg:text-8xl font-bold text-foreground leading-none tracking-tight"
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
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-6 lg:gap-10 py-7 lg:py-9"
                  onMouseEnter={() => setHoveredId(project.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Index */}
                  <span className="text-xs font-medium text-muted-foreground/40 tabular-nums w-8 shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Title */}
                  <motion.h2
                    className="flex-1 text-3xl lg:text-5xl font-bold text-foreground leading-none tracking-tight transition-colors duration-200 group-hover:text-muted-foreground"
                    animate={{ x: hoveredId === project.id ? 8 : 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {project.title}
                  </motion.h2>

                  {/* Category */}
                  <span className="hidden lg:block text-sm text-muted-foreground border border-border px-3 py-1 rounded-full shrink-0">
                    {project.category}
                  </span>

                  {/* Description */}
                  <span className="hidden lg:block text-sm text-muted-foreground shrink-0 w-48 text-right">
                    {project.description}
                  </span>

                  {/* Year + Arrow */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm text-muted-foreground/50 hidden lg:block">
                      {project.year}
                    </span>
                    <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0">
                      <ArrowUpRight className="w-3.5 h-3.5 text-foreground" />
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
