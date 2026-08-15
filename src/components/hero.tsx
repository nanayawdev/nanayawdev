"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

export function Hero() {
  return (
    <section className="relative min-h-screen bg-background overflow-hidden flex items-center justify-center">
      {/* Shader Gradient Background */}
      <ShaderGradientCanvas
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
        pixelDensity={1.5}
        fov={45}
        pointerEvents="none"
      >
        <ShaderGradient
          animate="on"
          brightness={1.2}
          cAzimuthAngle={180}
          cDistance={2.4}
          cPolarAngle={95}
          cameraZoom={1}
          color1="#cdf68c"
          color2="#0a291a"
          color3="#0a291a"
          envPreset="city"
          grain="off"
          lightType="3d"
          positionX={0}
          positionY={-2.1}
          positionZ={0}
          reflection={0.1}
          rotationX={0}
          rotationY={0}
          rotationZ={225}
          shader="defaults"
          type="waterPlane"
          uAmplitude={0}
          uDensity={1.8}
          uFrequency={5.5}
          uSpeed={0.2}
          uStrength={3}
          uTime={0.2}
          wireframe={false}
        />
      </ShaderGradientCanvas>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-foreground text-center">
          {/* Badge */}
          <div className="mb-6 sm:mb-8">
            <motion.div
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-foreground px-3 py-1.5 text-xs font-medium rounded-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#cdf68c] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#cdf68c]" />
              </span>
              <span>nanayawdev — available for new projects</span>
            </motion.div>
          </div>

          {/* Main Title */}
          <motion.h1
            className="font-display text-5xl sm:text-6xl lg:text-8xl font-semibold tracking-[-3.5px] mb-6 sm:mb-8 leading-none"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            I Design. I Build. I Make it Matter.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-sm sm:text-base lg:text-lg font-light leading-relaxed opacity-90 max-w-2xl mx-auto mb-8 sm:mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            I help startups and brands go global through design, development, and storytelling. I empower brands with world-class digital experiences.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.55 }}
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-sm font-medium rounded-full transition-transform hover:scale-[1.03]"
            >
              View My Work
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/start"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-foreground px-6 py-3 text-sm font-medium rounded-full transition-colors hover:bg-white/20"
            >
              Get In Touch
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
