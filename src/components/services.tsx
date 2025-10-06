"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

const services = [
  {
    title: "Web Development",
    subtitle: "Websites that actually work."
  },
  {
    title: "UI/UX Design", 
    subtitle: "Designs that stop the scroll."
  },
  {
    title: "Mobile Apps",
    subtitle: "Bring your ideas to their fingertips."
  },
  {
    title: "Brand Identity",
    subtitle: "Make your brand unforgettable."
  },
  {
    title: "Digital Marketing",
    subtitle: "Reach people, the smart way."
  },
  {
    title: "API Integration",
    subtitle: "Connect everything seamlessly."
  }
];

export function Services() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-8">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-foreground mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Our Services
        </motion.h2>
        
        <div className="space-y-4">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="group relative bg-card border border-border/20 rounded-2xl p-8 hover:bg-card/80 transition-all duration-300 cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm">{service.subtitle}</p>
                </div>
                <div className="ml-4">
                  <Plus className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
