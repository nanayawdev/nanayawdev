"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useState } from "react";

const services = [
  {
    title: "Web Development",
    subtitle: "Websites that actually work.",
    description: "We build beautiful, fast, and responsive websites that convert—from landing pages to fully custom platforms—designed to turn visitors into customers.",
    phases: ["Research", "Wireframe", "UI / UX Design", "Development", "Maintenance", "& More"]
  },
  {
    title: "UI/UX Design", 
    subtitle: "Designs that stop the scroll.",
    description: "We turn ideas into compelling visuals—whether it's for web, mobile, or print. Every design is crafted to capture attention and reflect your brand's personality.",
    phases: ["Brand Identity", "User Research", "Wireframing", "Prototyping", "Design Systems", "& More"]
  },
  {
    title: "Mobile Apps",
    subtitle: "Bring your ideas to their fingertips.",
    description: "We design and develop functional, intuitive apps that elevate user experience and solve real business needs—on iOS, Android, or both.",
    phases: ["Research", "Wireframe", "UI / UX Design", "App Development", "Maintenance", "& More"]
  },
  {
    title: "Brand Identity",
    subtitle: "Make your brand unforgettable.",
    description: "Your brand is more than just a logo—it's your personality, your story, your vibe. We help bring that essence to life, from logos to complete brand identity.",
    phases: ["Logo Design", "Visual Identity", "Brand Guidelines", "Brand Strategy", "& More"]
  },
  {
    title: "Digital Marketing",
    subtitle: "Reach people, the smart way.",
    description: "We craft data-driven digital campaigns that build awareness, drive engagement, and convert followers into loyal customers.",
    phases: ["Social Media", "Content Strategy", "SEO & SEM", "Email Marketing", "Analytics", "& More"]
  },
  {
    title: "API Integration",
    subtitle: "Connect everything seamlessly.",
    description: "We integrate powerful APIs and services to enhance your applications with real-time data, payments, and advanced functionality.",
    phases: ["Third-party APIs", "Database Integration", "Payment Systems", "Analytics", "Automation", "& More"]
  }
];

export function Services() {
  const [expandedService, setExpandedService] = useState<number | null>(null);

  const toggleService = (index: number) => {
    setExpandedService(expandedService === index ? null : index);
  };

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
              className="relative bg-card border border-border/20 rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Collapsed State */}
              <motion.div
                className="p-8 cursor-pointer hover:bg-card/80 transition-all duration-300"
                onClick={() => toggleService(index)}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{service.title}</h3>
                    <p className="text-muted-foreground text-sm">{service.subtitle}</p>
                  </div>
                  <div className="ml-4">
                    {expandedService === index ? (
                      <X className="w-6 h-6 text-muted-foreground hover:text-foreground transition-colors duration-300" />
                    ) : (
                      <Plus className="w-6 h-6 text-muted-foreground hover:text-foreground transition-colors duration-300" />
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Expanded State */}
              <AnimatePresence>
                {expandedService === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8">
                      <div className="grid lg:grid-cols-2 gap-12">
                        {/* Left Content */}
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-3xl font-bold text-foreground mb-3">{service.title}</h3>
                            <p className="text-muted-foreground text-lg mb-6">{service.subtitle}</p>
                            <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                          </div>
                          
                          {/* Phases */}
                          <div className="space-y-3">
                            {service.phases.map((phase, phaseIndex) => (
                              <div
                                key={phaseIndex}
                                className="inline-block bg-card border border-border/30 rounded-full px-4 py-2 text-sm text-foreground mr-3 mb-2"
                              >
                                {phase}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Right Content - Mobile Mockups Placeholder */}
                        <div className="relative">
                          <div className="grid grid-cols-2 gap-4">
                            {/* Mockup 1 */}
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-4 aspect-[9/16] flex flex-col justify-center items-center text-white">
                              <div className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4"></div>
                                <h4 className="font-bold text-lg mb-2">App Interface</h4>
                                <p className="text-sm opacity-90">Sample App</p>
                              </div>
                            </div>
                            
                            {/* Mockup 2 */}
                            <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-4 aspect-[9/16] flex flex-col justify-center items-center text-white">
                              <div className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4"></div>
                                <h4 className="font-bold text-lg mb-2">Mobile App</h4>
                                <p className="text-sm opacity-90">Design</p>
                              </div>
                            </div>
                            
                            {/* Mockup 3 */}
                            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-4 aspect-[9/16] flex flex-col justify-center items-center text-white">
                              <div className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4"></div>
                                <h4 className="font-bold text-lg mb-2">User Flow</h4>
                                <p className="text-sm opacity-90">Experience</p>
                              </div>
                            </div>
                            
                            {/* Mockup 4 */}
                            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-4 aspect-[9/16] flex flex-col justify-center items-center text-white">
                              <div className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4"></div>
                                <h4 className="font-bold text-lg mb-2">Prototype</h4>
                                <p className="text-sm opacity-90">Testing</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
