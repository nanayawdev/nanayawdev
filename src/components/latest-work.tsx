"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

const projects = [
  {
    id: 1,
    title: "Thomisia Travel",
    category: "Travel & Tour Platform",
    description: "A full-featured booking platform for a travel agency with real-time availability and payment integration.",
    image: "/hero1.avif",
    url: "https://thomisiatravelandtour.com",
  },
  {
    id: 2,
    title: "Urban Drive",
    category: "Ride Booking App",
    description: "iOS & Android ride-hailing app with live driver tracking and in-app payments.",
    image: "/hero2.avif",
    url: "https://urbandriveapp.vercel.app",
  },
  {
    id: 3,
    title: "Brand Identity",
    category: "Visual Identity",
    description: "End-to-end brand identity system for an emerging African fintech startup.",
    image: "/hero6.webp",
    url: "/projects",
  },
  {
    id: 4,
    title: "Digital Campaign",
    category: "Digital Marketing",
    description: "A multi-channel campaign that drove 3× growth in organic traffic within 90 days.",
    image: "/hero7.webp",
    url: "/projects",
  },
];

function ProjectRow({
  project,
  index,
  onPreview,
}: {
  project: typeof projects[0];
  index: number;
  onPreview: () => void;
}) {
  const isExternal = project.url.startsWith("http");

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
        href={project.url}
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

        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:border-foreground group-hover:text-foreground">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </Link>
    </motion.div>
  );
}

function ProjectPreview({ project }: { project: typeof projects[0] }) {
  return (
    <motion.div
      key={project.id}
      className="sticky top-28 hidden overflow-hidden border border-border bg-muted lg:block"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="relative aspect-[4/5]">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="33vw"
          className="object-cover grayscale transition duration-700 hover:grayscale-0"
        />
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
  const [activeProject, setActiveProject] = useState(projects[0]);

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
              Our Work
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

          <ProjectPreview project={activeProject} />
        </div>
      </div>
    </section>
  );
}
