"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Content */}
      <div className="min-h-screen flex items-center">
        <div className="max-w-4xl mx-auto px-8 py-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Heading */}
            <div className="flex items-center gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-shrink-0"
              >
                <Users className="w-16 h-16 lg:w-20 lg:h-20 text-primary" />
              </motion.div>
              <h1 className="text-6xl lg:text-8xl font-bold leading-tight">
                <span className="text-foreground">About</span>{" "}
                <span className="text-muted-foreground">us</span>
              </h1>
            </div>

            {/* First Paragraph */}
            <motion.p
              className="text-foreground text-lg lg:text-xl leading-relaxed max-w-3xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              At Devs & Creatives, we strive to stay current with the latest trends, 
              technologies, and algorithm updates so that we can continue to provide 
              our clients with the most effective and cutting-edge digital marketing 
              services possible.
            </motion.p>

            {/* Second Paragraph */}
            <motion.p
              className="text-foreground text-lg lg:text-xl leading-relaxed max-w-3xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              We pride ourselves on our customer service and strive to build long-lasting 
              relationships with our clients. With our years of experience, we are confident 
              that we can help you achieve your business goals and succeed online.
            </motion.p>
          </motion.div>
        </div>
      </div>

    </div>
  );
}
