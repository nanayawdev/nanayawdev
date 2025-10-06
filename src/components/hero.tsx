"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
  // Service cards data
  const serviceCards = [
    { 
      title: "WEB DEVELOPMENT",
      description: "Custom websites, e-commerce platforms, and web applications",
      href: "/services/web-development"
    },
    { 
      title: "UI/UX DESIGN",
      description: "User-centered design that drives engagement and conversions",
      href: "/services/ui-ux-design"
    },
    { 
      title: "MOBILE APPS",
      description: "Native and cross-platform mobile applications",
      href: "/services/mobile-apps"
    },
    { 
      title: "BRAND IDENTITY",
      description: "Complete brand identity and design systems",
      href: "/services/brand-identity"
    },
  ];

  return (
    <section className="relative min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          {/* Top Content - Centered */}
          <div className="min-h-[60vh] flex items-end justify-center py-8 lg:py-16">
            <div className="max-w-5xl text-foreground text-center">
              {/* YES! Badge */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-3 bg-foreground text-background px-4 py-2 text-sm font-medium">
                  <Badge variant="default" className="text-xs font-semibold">
                    YES!
                  </Badge>
                  <span>We bring your ideas to life</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Main Title */}
              <motion.h1
                className="max-w-3xl mx-auto text-5xl sm:text-6xl lg:text-7xl font-bold tracking-[-3.5px] mb-6 leading-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                Building digital experiences that speak.
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-sm sm:text-base lg:text-base font-light leading-relaxed mb-8 opacity-90 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                A digital agency helping African startups and brands go global through design, development, and storytelling. We empower African brands with world-class digital experiences.
              </motion.p>
            </div>
          </div>

          {/* Bottom - Hero Image */}
          <div className="pb-12 lg:pb-16">
            <div className="w-full max-w-7xl mx-auto">
              <motion.div
                className="relative rounded-lg overflow-hidden shadow-2xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <Image
                  src="/hero.avif"
                  alt="Devs & Creatives Digital Services"
                  width={1200}
                  height={600}
                  className="w-full h-auto object-cover"
                  priority
                />
              </motion.div>
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="pb-12 lg:pb-16">
            <div className="w-full max-w-7xl mx-auto">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {serviceCards.map((card, index) => (
                  <Link key={index} href={card.href}>
                    <motion.div
                      className="group relative bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 1 + (index * 0.1),
                        ease: "easeOut"
                      }}
                      whileHover={{ y: -5 }}
                    >
                      {/* Card Content */}
                      <div className="p-4 sm:p-6 flex flex-col min-h-[120px] bg-card">
                        <h3 className="font-bold text-foreground mb-2 text-sm sm:text-base uppercase tracking-wide">
                          {card.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-4 flex-grow leading-relaxed">
                          {card.description}
                        </p>
                        <div className="inline-flex items-center text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 transition-colors duration-200 mt-auto">
                          Explore
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </div>
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
