"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-purple-800/30">
        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        {/* Shooting Stars / Light Trails */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-px h-16 bg-gradient-to-b from-white to-transparent opacity-60"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${Math.random() * 50}%`,
                transform: `rotate(${-30 + Math.random() * 60}deg)`,
                animation: `shooting-star ${3 + Math.random() * 4}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-4xl mx-auto px-8 py-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Heading */}
            <h1 className="text-6xl lg:text-8xl font-bold leading-tight">
              <span className="text-white">About</span>{" "}
              <span className="text-gray-300">us</span>
            </h1>

            {/* First Paragraph */}
            <motion.p
              className="text-white text-lg lg:text-xl leading-relaxed max-w-3xl"
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
              className="text-white text-lg lg:text-xl leading-relaxed max-w-3xl"
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

      {/* Custom CSS for shooting star animation */}
      <style jsx>{`
        @keyframes shooting-star {
          0% {
            transform: translateX(-100px) translateY(-100px) rotate(-30deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100vw) translateY(100vh) rotate(-30deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
