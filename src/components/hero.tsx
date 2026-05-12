"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

export function Hero() {
  return (
    <section className="relative min-h-screen bg-background overflow-hidden flex items-center justify-center">
      {/* Shader Gradient Background */}
      <div className="absolute inset-0 z-0">
        <ShaderGradientCanvas
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          <ShaderGradient
            animate="on"
            brightness={1.2}
            cAzimuthAngle={180}
            cDistance={2.4}
            cPolarAngle={95}
            cameraZoom={1}
            color1="#ff6a1a"
            color2="#c73c00"
            color3="#FD4912"
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
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto text-foreground text-center">
          {/* Badge */}
          <div className="mb-6 sm:mb-8">
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
              <Badge variant="default" className="text-[10px] rounded-full">
                YES!
              </Badge>
              <span>We&apos;re developers and creatives</span>
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>

          {/* Main Title */}
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-[-3.5px] mb-6 sm:mb-8 leading-none"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            We Design. We Build. We Make it Matter.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-sm sm:text-base lg:text-lg font-light leading-relaxed opacity-90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            A digital agency helping startups and brands go global through design, development, and storytelling. We empower brands with world-class digital experiences.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
