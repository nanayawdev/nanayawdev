"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const services = [
  {
    name: "Web Design",
    description: "We design visually compelling, user-centric websites that blend creativity with functional brand from scratch.",
    tags: ["UX/UI Design", "Responsive Layouts", "Web Development"],
    image: "/hero1.avif"
  },
  {
    name: "Mobile Apps",
    description: "We create intuitive mobile experiences that engage users and drive business growth across iOS and Android platforms.",
    tags: ["iOS Development", "Android Development", "Cross-Platform"],
    image: "/hero.avif"
  },
  {
    name: "Brand Identity",
    description: "We craft memorable brand identities that tell your story and connect with your audience on an emotional level.",
    tags: ["Logo Design", "Brand Guidelines", "Visual Identity"],
    image: "/hero2.avif"
  },
  {
    name: "Digital Marketing",
    description: "We develop data-driven marketing strategies that increase visibility and convert prospects into loyal customers.",
    tags: ["SEO", "Social Media", "Content Strategy"],
    image: "/hero3.avif"
  }
];

export function Services() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-8">
        {/* Main Header */}
        <motion.h2
          className="text-4xl lg:text-6xl font-bold text-foreground mb-16 text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          What We Do
        </motion.h2>

        {/* Services Grid */}
        <div className="space-y-0">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              className="py-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Divider - show for all items */}
              <div className="mb-8 border-t border-border/20"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 items-start">
                {/* Left Column - Service Name (1/6) */}
                <div className="text-left lg:col-span-1">
                  <h3 className="text-xl lg:text-2xl font-medium text-foreground">
                    {service.name}
                  </h3>
                </div>

                {/* Middle Column - Image (3/6) */}
                <div className="flex flex-col items-center lg:col-span-3">
                  <div className="relative w-full">
                    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                      <Image
                        src={service.image}
                        alt={`${service.name} Service`}
                        width={600}
                        height={360}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column - Service Details with Pills (2/6) */}
                <div className="text-left lg:col-span-2">
                  <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                    {service.description}
                  </p>
                  
                  {/* Pills/Tags */}
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
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