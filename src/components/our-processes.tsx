"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const processes = [
  {
    id: 1,
    title: "Kickoff Meeting",
    description: "We get to know you, your brand, your goals, your vibe (and maybe your favorite snacks). This is where the ideas start flying and the creative wheels start turning."
  },
  {
    id: 2,
    title: "Magic in Progress",
    description: "We head into the creative cave and start sketching, designing, writing, and building. You'll get updates, sneak peeks, and maybe a few happy dances along the way."
  },
  {
    id: 3,
    title: "Feedback",
    description: "You tell us what's working and what's not. We tweak, polish, and sprinkle on the final touches until it's just right—like, chef's kiss right."
  },
  {
    id: 4,
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
            className="relative flex items-start"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="relative w-full rounded-4xl overflow-hidden">
              <Image
                src="/man-playing.avif"
                alt="Our Creative Team"
                width={500}
                height={800}
                className="w-full h-auto object-cover grayscale"
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
                  className="bg-card border border-border rounded-4xl p-6 relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {/* Heading and Number Row */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground">
                      {process.title}
                    </h3>
                    {/* Number */}
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center shadow-inner">
                      <span className="text-foreground font-semibold text-sm">{process.id}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
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
