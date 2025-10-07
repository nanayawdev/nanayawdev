"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Brain, Wrench, Send, Rocket } from "lucide-react";

const processes = [
  {
    id: 1,
    icon: Brain,
    title: "Kickoff Meeting",
    description: "We get to know you, your brand, your goals, your vibe (and maybe your favorite snacks). This is where the ideas start flying and the creative wheels start turning."
  },
  {
    id: 2,
    icon: Wrench,
    title: "Magic in Progress",
    description: "We head into the creative cave and start sketching, designing, writing, and building. You'll get updates, sneak peeks, and maybe a few happy dances along the way."
  },
  {
    id: 3,
    icon: Send,
    title: "Feedback",
    description: "You tell us what's working and what's not. We tweak, polish, and sprinkle on the final touches until it's just right—like, chef's kiss right."
  },
  {
    id: 4,
    icon: Rocket,
    title: "Launch & High Fives",
    description: "Everything goes live, you look amazing, and we all celebrate. Need help down the road? We're always just a message away (no awkward breakups here)."
  }
];

export function OurProcesses() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Team Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden">
              <Image
                src="/man-playing.avif"
                alt="Our Creative Team"
                width={500}
                height={625}
                className="w-full h-full object-cover grayscale"
              />
            </div>
          </motion.div>

          {/* Right Side - Process Steps */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Section Title */}
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-12">
              Our Process
            </h2>

            {/* Process Steps */}
            <div className="space-y-6">
              {processes.map((process, index) => (
                <motion.div
                  key={process.id}
                  className="bg-card border border-border rounded-xl p-6 relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* Icon and Number Row */}
                  <div className="flex items-center justify-between mb-4">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <process.icon className="w-6 h-6 text-primary" />
                    </div>

                    {/* Number */}
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center shadow-inner">
                      <span className="text-foreground font-semibold text-sm">{process.id}</span>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {process.title}
                    </h3>
                    <div className="w-full h-px bg-border mb-3"></div>
                    <p className="text-muted-foreground leading-relaxed">
                      {process.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
