"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { InquireBriefModal } from "@/components/inquire-brief";
import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";
import { ArrowUpRight } from "lucide-react";

export function MainCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-8">
        <motion.div
          className="relative rounded-3xl overflow-hidden min-h-[420px] lg:min-h-[480px] flex items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* ShaderGradient background */}
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

          {/* Dark overlay for text legibility */}
          <div className="absolute inset-0 bg-black/30 z-10" />

          {/* Content */}
          <div className="relative z-20 w-full px-10 lg:px-16 py-16 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="max-w-2xl">
              <motion.p
                className="text-white/60 text-sm font-medium uppercase tracking-widest mb-5"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Let&apos;s Work Together
              </motion.p>
              <motion.h2
                className="text-4xl lg:text-6xl xl:text-7xl font-bold text-white leading-none tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Got a project
                <br />
                in mind?
              </motion.h2>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:items-end shrink-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p className="text-white/70 text-base max-w-xs lg:text-right leading-relaxed">
                Tell us what you&apos;re building and we&apos;ll take it from there.
              </p>
              <motion.button
                className="inline-flex items-center gap-2 bg-white text-black px-7 py-4 rounded-full font-semibold text-base hover:bg-white/90 transition-colors cursor-pointer shrink-0"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsModalOpen(true)}
              >
                Let&apos;s Talk
                <ArrowUpRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <InquireBriefModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
