"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { OurProcesses } from "@/components/our-processes";

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
  },
  {
    id: 5,
    title: "EcoTech Solutions",
    image: "/hero7.webp",
    logo: "ES",
    description: "Sustainable technology platform"
  },
  {
    id: 6,
    title: "FinanceFlow",
    image: "/hero8.jpg",
    logo: "FF",
    description: "Financial management app"
  },
  {
    id: 7,
    title: "HealthConnect",
    image: "/hero1.avif",
    logo: "HC",
    description: "Healthcare platform"
  },
  {
    id: 8,
    title: "EduTech Hub",
    image: "/hero2.avif",
    logo: "EH",
    description: "Educational technology"
  }
];

export default function Projects() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28">
        <div className="flex flex-col">
          {/* Top Content - Centered */}
          <div className="min-h-[25vh] sm:min-h-[30vh] lg:min-h-[35vh] flex items-end justify-center py-4 sm:py-6 lg:py-16">
            <div className="max-w-5xl text-foreground text-center">
              {/* Main Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">Our Projects</h1>
                <p className="text-sm lg:text-base text-muted-foreground max-w-3xl mx-auto">
                  Showcasing our successful projects that have helped African startups and brands achieve global reach through innovative digital solutions.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Bottom - Projects Grid */}
          <div className="pb-10 lg:pb-12">
            <div className="w-full lg:max-w-7xl lg:mx-auto lg:px-4">

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="relative group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Project Image */}
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-900">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={300}
                  height={375}
                  className="w-full h-full object-cover group-hover:scale-105 group-hover:grayscale transition-all duration-300"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Project Logo/Title */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">{project.logo}</span>
                      </div>
                      <div>
                        <h3 className="text-foreground font-semibold text-lg">{project.title}</h3>
                        <p className="text-muted-foreground text-sm">{project.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
              </div>

            {/* Our Process Section */}
            <div className="mt-16">
              <OurProcesses />
            </div>

            {/* CTA Section */}
            <motion.div
              className="mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="max-w-7xl mx-auto bg-card text-foreground rounded-4xl p-8 lg:p-12 border border-border relative overflow-hidden">
                {/* Decorative corner elements */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-border rounded-tr-2xl"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-border rounded-br-2xl"></div>
                <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-border rounded-tl-2xl"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-border rounded-bl-2xl"></div>
                
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                    Ready to see your project here?
                  </h2>
                  <p className="text-muted-foreground text-lg mb-6">
                    Let&apos;s build it together.
                  </p>
                  <motion.button
                    className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary/90 transition-colors duration-200 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Your Project
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}