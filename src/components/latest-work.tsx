"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Thomisia Travel",
    category: "Travel & Tour Platform",
    description: "A full-featured booking platform for a travel agency with real-time availability and payment integration.",
    image: "/hero1.avif",
    url: "https://thomisiatravelandtour.com",
    span: "col-span-2",
    height: "h-[420px] lg:h-[520px]",
  },
  {
    id: 2,
    title: "Urban Drive",
    category: "Ride Booking App",
    description: "iOS & Android ride-hailing app with live driver tracking and in-app payments.",
    image: "/hero2.avif",
    url: "https://urbandriveapp.vercel.app",
    span: "col-span-1",
    height: "h-[420px] lg:h-[520px]",
  },
  {
    id: 3,
    title: "Brand Identity",
    category: "Visual Identity",
    description: "End-to-end brand identity system for an emerging African fintech startup.",
    image: "/hero6.webp",
    url: "/projects",
    span: "col-span-1",
    height: "h-[340px] lg:h-[400px]",
  },
  {
    id: 4,
    title: "Digital Campaign",
    category: "Digital Marketing",
    description: "A multi-channel campaign that drove 3× growth in organic traffic within 90 days.",
    image: "/hero7.webp",
    url: "/projects",
    span: "col-span-2",
    height: "h-[340px] lg:h-[400px]",
  },
];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  return (
    <motion.div
      className={`${project.span} ${project.height} relative group rounded-2xl lg:rounded-3xl overflow-hidden cursor-pointer`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      viewport={{ once: true }}
    >
      <a href={project.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
        {/* Image */}
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Default gradient — always visible at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          {/* Category — always visible */}
          <span className="inline-block text-white/60 text-xs font-medium uppercase tracking-widest mb-2">
            {project.category}
          </span>

          {/* Title — always visible */}
          <h3 className="text-white text-2xl lg:text-3xl font-bold leading-tight mb-0">
            {project.title}
          </h3>

          {/* Description — slides up on hover */}
          <div className="overflow-hidden">
            <motion.p
              className="text-white/80 text-sm leading-relaxed mt-3 max-w-md"
              initial={false}
              animate={{ opacity: 0, y: 12 }}
              whileHover={{ opacity: 1, y: 0 }}
            >
              {project.description}
            </motion.p>
          </div>
        </div>

        {/* Arrow — top right, appears on hover */}
        <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <ArrowUpRight className="w-4 h-4 text-white" />
        </div>
      </a>
    </motion.div>
  );
}

export function LatestWork() {
  return (
    <section className="py-16 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-8">

        <div className="flex items-end justify-between mb-10">
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
              className="text-4xl lg:text-6xl font-bold text-foreground leading-none tracking-tight"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              viewport={{ once: true }}
            >
              Latest Projects
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
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ x: 4 }}
              >
                View all <ArrowUpRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
