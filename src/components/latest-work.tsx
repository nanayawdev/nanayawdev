"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const projects = [
  {
    id: 1,
    title: "Remora Digital",
    image: "/hero1.avif",
    logo: "RD",
    description: "Digital platform development"
  },
  {
    id: 2,
    title: "Appointment App",
    image: "/hero2.avif",
    logo: "AA",
    description: "Never Miss An Appointment Again"
  },
  {
    id: 3,
    title: "Ultimate Kairos",
    image: "/hero3.avif",
    logo: "UK",
    description: "Bakes & More"
  },
  {
    id: 4,
    title: "Yum Chef",
    image: "/hero6.webp",
    logo: "YC",
    description: "OH YES!"
  }
];

export function LatestWork() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-8">
        {/* Main Header */}
        <motion.h2
          className="text-4xl lg:text-6xl font-bold text-foreground mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Our Latest Work
        </motion.h2>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="relative group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Project Image */}
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-900">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={300}
                  height={375}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Project Logo/Title */}
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <span className="text-black font-bold text-sm">{project.logo}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{project.title}</h3>
                      <p className="text-white/80 text-sm">{project.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
