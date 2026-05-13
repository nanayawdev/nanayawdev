"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

const projects = [
  { id: 1, title: "Thomisia Travel", category: "Web", description: "Full-featured travel booking platform with real-time availability.", image: "/hero1.avif", url: "https://thomisiatravelandtour.com" },
  { id: 2, title: "Urban Drive", category: "Mobile", description: "iOS & Android ride-hailing app with live driver tracking.", image: "/hero2.avif", url: "https://urbandriveapp.vercel.app" },
  { id: 3, title: "Evvents Africa", category: "Web", description: "End-to-end event management and ticketing platform.", image: "/hero3.avif", url: "https://evventsafrica.vercel.app" },
  { id: 4, title: "Urban Tickets", category: "Mobile", description: "Mobile-first ticketing app for live events across Africa.", image: "/hero6.webp", url: "https://urbantickets.app" },
  { id: 5, title: "Healthier BT", category: "Web", description: "Health and wellness solutions platform for African consumers.", image: "/hero7.webp", url: "https://healthierbtsolutions.com" },
  { id: 6, title: "Atink News", category: "Web", description: "Modern news and media platform with real-time updates.", image: "/hero8.jpg", url: "https://atinknews.net" },
  { id: 7, title: "Licia Luxe", category: "Brand", description: "Luxury fashion brand identity — logo, guidelines, and visual system.", image: "/hero1.avif", url: "https://licialuxe.vercel.app" },
  { id: 8, title: "SMS App", category: "Mobile", description: "Bulk messaging platform for businesses across West Africa.", image: "/hero2.avif", url: "https://smsappv1.vercel.app" },
];

const filters = ["All", "Web", "Mobile", "Brand"];

export default function Projects() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

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
          Our Work
        </motion.p>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <motion.h1
            className="text-5xl lg:text-8xl font-bold text-foreground leading-none tracking-tight"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
          >
            Projects
          </motion.h1>

          {/* Filter tabs */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  active === f
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground border border-border hover:border-foreground/20"
                }`}
              >
                {f}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer"
              >
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Category */}
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-medium text-white/70 uppercase tracking-widest bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>

                  {/* Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white text-xl font-bold leading-tight mb-1">{project.title}</h3>
                    <p className="text-white/60 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                      {project.description}
                    </p>
                  </div>
                </a>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
}
