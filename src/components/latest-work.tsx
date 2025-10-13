"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { EyeIcon } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Thomisia Travel",
    image: "/hero1.avif",
    logo: "TT",
    description: "Travel & Tour Platform",
    url: "https://thomisiatravelandtour.com"
  },
  {
    id: 2,
    title: "Urban Drive",
    image: "/hero2.avif",
    logo: "UD",
    description: "Ride Booking App",
    url: "https://urbandriveapp.vercel.app"
  }
];

export function LatestWork() {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Main Header */}
        <motion.h2
          className="text-3xl md:text-4xl lg:text-6xl font-bold text-foreground mb-8 md:mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Our Latest Work
        </motion.h2>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="relative group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.01 }}
            >
                {/* Card Container */}
                <div className="relative aspect-[4/3] md:aspect-[3/2] rounded-2xl md:rounded-3xl overflow-hidden">
                  {/* Project Image */}
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                 
                    
                  {/* Large Title Overlay */}
                  <div className="absolute top-4 left-4 right-4 md:top-8 md:left-8 md:right-8">
                    <h3 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight uppercase leading-tight">
                      {project.title}
                    </h3>
                  </div>
                  
                  {/* Bottom Info Card */}
                  <div className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6">
                    <div className="bg-card rounded-2xl md:rounded-3xl p-3 md:p-5 shadow-2xl border flex items-center justify-between">
                      <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                        {/* Logo Circle */}
                        <div className="w-10 h-10 md:w-14 md:h-14 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-foreground font-bold text-sm md:text-lg">{project.logo}</span>
                        </div>
                        
                        {/* Text Content */}
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <h4 className="text-foreground font-semibold text-sm md:text-lg mb-0.5 truncate">
                            {project.title}
                          </h4>
                          <p className="text-muted-foreground text-xs md:text-sm truncate">
                            {project.description}
                          </p>
                        </div>
                        
                        {/* View Project Icon Button */}
                        <div className="flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(project.url, '_blank', 'noopener,noreferrer');
                            }}
                            className="bg-primary text-primary-foreground w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors cursor-pointer"
                          >
                            <EyeIcon className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </motion.div>
          ))}
        </div>

        {/* See More Button */}
        <motion.div
          className="text-center mt-8 md:mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <Link href="/projects">
            <motion.button
              className="bg-primary text-primary-foreground px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold text-base md:text-lg hover:bg-primary/90 transition-colors duration-200 cursor-pointer"
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
