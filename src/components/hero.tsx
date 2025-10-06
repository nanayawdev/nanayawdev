"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LightRays from "./light-rays";
import "./light-rays.css";

export function Hero() {

  return (
    <section className="relative min-h-screen bg-background overflow-hidden">
      {/* Light Rays Background */}
      <div className="absolute inset-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          pulsating={true}
          fadeDistance={1.0}
          saturation={1.0}
        />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col">
          {/* Top Content - Centered */}
          <div className="min-h-[60vh] flex items-end justify-center py-8 lg:py-16">
            <div className="max-w-5xl text-foreground text-center">
              {/* YES! Badge */}
              <div className="mb-6">
                <motion.div 
                  className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-foreground px-4 py-2 text-sm font-medium rounded-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    borderColor: "rgba(255, 255, 255, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge variant="default" className="text-xs font-semibold rounded-full">
                    YES!
                  </Badge>
                  <span>Creativity powered by code</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
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
            <div className="w-full lg:max-w-7xl lg:mx-auto lg:px-4">
              <motion.div
                className="relative rounded-none lg:rounded-lg overflow-hidden shadow-2xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <Image
                  src="/hero.avif"
                  alt="Devs & Creatives Digital Services"
                  width={1200}
                  height={600}
                  className="w-full h-[500px] lg:h-[600px] object-cover"
                  priority
                />
                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
