"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Plus } from "lucide-react";

const services = [
  {
    id: 1,
    name: "Web Design & Development",
    shortDescription: "Custom websites and web applications",
    description: "We design visually compelling, user-centric websites that blend creativity with functional brand from scratch.",
    tags: ["UX/UI Design", "Responsive Layouts", "Web Apps Development"],
    image: "/hero1.avif"
  },
  {
    id: 2,
    name: "Mobile Apps Development",
    shortDescription: "iOS and Android mobile applications",
    description: "We create intuitive mobile experiences that engage users and drive business growth across iOS and Android platforms.",
    tags: ["iOS Development", "Android Development", "Cross-Platform", "Mobile Apps Development"],
    image: "/hero.avif"
  },
  {
    id: 3,
    name: "Brand Identity",
    shortDescription: "Complete brand identity and visual design",
    description: "We craft memorable brand identities that tell your story and connect with your audience on an emotional level.",
    tags: ["Logo Design", "Brand Guidelines", "Visual Identity", "Brand Identity Development"],
    image: "/hero6.webp"
  },
  {
    id: 4,
    name: "Digital Marketing",
    shortDescription: "Data-driven marketing strategies",
    description: "We develop data-driven marketing strategies that increase visibility and convert prospects into loyal customers.",
    tags: ["SEO", "Social Media", "Content Strategy", "Digital Marketing"],
    image: "/hero7.webp"
  }
];

export function Services() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-8">
        {/* Main Header */}
        <motion.h2
          className="text-4xl lg:text-6xl font-bold text-foreground mb-8 text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          What We Do
        </motion.h2>

        {/* Services Expandable Cards */}
        <div className="space-y-4">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className="bg-card border border-border rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => toggleItem(service.id)}
                className="w-full px-6 py-8 text-left flex items-center justify-between hover:bg-muted/50 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex-1">
                  <h3 className="text-3xl lg:text-4xl font-medium text-foreground mb-2">
                    {service.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {service.shortDescription}
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: openItems.includes(service.id) ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 ml-4"
                >
                  <Plus className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              </button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openItems.includes(service.id) ? "auto" : 0,
                  opacity: openItems.includes(service.id) ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-6 pt-6 pb-8">
                  {/* Expanded Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left Column - Description and Tags */}
                    <div>
                      <p className="text-muted-foreground leading-relaxed text-lg mb-6" style={{ fontSize: '18px' }}>
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

                    {/* Right Column - Image */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-full">
                        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                          <Image
                            src={service.image}
                            alt={`${service.name} Service`}
                            width={500}
                            height={300}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}