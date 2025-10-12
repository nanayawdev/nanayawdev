"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

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
    description: "Appointment App"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <Link key={project.id} href="/projects">
              <motion.div
                className="relative group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.01 }}
              >
                {/* Card Container */}
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                  {/* Project Image */}
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                
                  
                  {/* Large Title Overlay */}
                  <div className="absolute top-8 left-8 right-8">
                    <h3 className="text-white text-5xl lg:text-6xl font-bold tracking-tight uppercase">
                      {project.title}
                    </h3>
                  </div>
                  
                  {/* Bottom Info Card */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-card rounded-3xl p-5 shadow-2xl border flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Logo Circle */}
                        <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-foreground font-bold text-lg">{project.logo}</span>
                        </div>
                        
                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-foreground font-semibold text-lg mb-0.5">
                            {project.title}
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            {project.description}
                          </p>
                        </div>
                        
                        {/* View Project Icon Button */}
                        <div className="flex-shrink-0">
                          <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                            <svg 
                              className="w-5 h-5" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M9 5l7 7-7 7" 
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* See More Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <Link href="/projects">
            <motion.button
              className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary/90 transition-colors duration-200 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              See More
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
