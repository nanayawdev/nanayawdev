"use client";

import { motion } from "framer-motion";
import { 
  Paintbrush, 
  Sparkles, 
  Layers, 
  Users, 
  Lightbulb, 
  Search 
} from "lucide-react";

const features = [
  {
    icon: Paintbrush,
    title: "Design That Delivers",
    description: "Smart, strategic visuals built to grow your brand and move the needle."
  },
  {
    icon: Sparkles,
    title: "Creative Sparks",
    description: "We craft ideas that break the mold and make your brand unforgettable."
  },
  {
    icon: Layers,
    title: "Adaptable & Flexible",
    description: "Tailored solutions for evolving market needs."
  },
  {
    icon: Users,
    title: "Human-Centered Approach",
    description: "We craft brands that connect emotionally and authentically."
  },
  {
    icon: Lightbulb,
    title: "Ideas You Didn't See Coming",
    description: "Bringing global trends with a local understanding."
  },
  {
    icon: Search,
    title: "Every Detail Matters",
    description: "Every element we design is intentional—measured, refined, and built to perform."
  }
];

export function WhyUs() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-8">
        {/* Main Title */}
        <motion.h2
          className="text-4xl lg:text-5xl font-bold text-foreground mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Why Us?
        </motion.h2>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="border border-border/60 dark:border-border/40 rounded-2xl p-8 hover:border-border/80 dark:hover:border-border/60 transition-colors duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Icon - Above text */}
              <div className="mb-4">
                <feature.icon className="w-16 h-16 text-muted-foreground/70" />
              </div>

              {/* Title */}
              <h3 className="text-xl text-foreground mb-4 text-left">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed text-left">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
