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
    title: "African-First Design",
    description: "We understand African markets and create designs that resonate locally while competing globally."
  },
  {
    icon: Sparkles,
    title: "Innovation & Imagination",
    description: "Where cutting-edge technology meets creative storytelling to bring your vision to life."
  },
  {
    icon: Layers,
    title: "Full-Stack Solutions",
    description: "From brand identity to web development, we're your one-stop creative and technical partner."
  },
  {
    icon: Users,
    title: "Startup-Focused",
    description: "We specialize in helping African startups scale with digital experiences that drive growth."
  },
  {
    icon: Lightbulb,
    title: "Global Ambition",
    description: "We build digital experiences that help African brands compete on the world stage."
  },
  {
    icon: Search,
    title: "Results-Driven",
    description: "Every project is crafted with purpose—to grow your brand, engage your audience, and drive business success."
  }
];

export function WhyUs() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-8">
        {/* Main Title */}
        <motion.h2
          className="text-4xl lg:text-6xl font-bold text-foreground mb-16 text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Why You'll Love Us
        </motion.h2>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-card border border-border rounded-2xl p-8 hover:border-border/80 transition-colors duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Icon and Heading - Same Line */}
              <div className="flex items-center gap-4 mb-6">
                <feature.icon className="w-8 h-8 text-foreground flex-shrink-0" />
                <h3 className="text-2xl text-foreground">
                  {feature.title}
                </h3>
              </div>

              {/* Divider */}
              <div className="border-t border-border/60 mb-6"></div>

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
