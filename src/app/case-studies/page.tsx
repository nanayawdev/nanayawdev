"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { EyeIcon } from "lucide-react";
import { InquireBriefModal } from "@/components/inquire-brief";
import { useState } from "react";

const caseStudies = [
  {
    id: 1,
    title: "Remora Digital",
    logo: "RD",
    description: "Digital platform development",
    image: "/hero1.avif"
  },
  {
    id: 2,
    title: "Appointment App",
    logo: "AA",
    description: "Appointment App",
    image: "/hero2.avif"
  },
  {
    id: 3,
    title: "Ultimate Kairos",
    logo: "UK",
    description: "Bakes & More",
    image: "/hero3.avif"
  },
  {
    id: 4,
    title: "Yum Chef",
    logo: "YC",
    description: "OH YES!",
    image: "/hero6.webp"
  },
  {
    id: 5,
    title: "EcoTech Solutions",
    logo: "ES",
    description: "Sustainable technology platform",
    image: "/hero7.webp"
  },
  {
    id: 6,
    title: "FinanceFlow",
    logo: "FF",
    description: "Financial management app",
    image: "/hero8.jpg"
  }
];

export default function CaseStudies() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28">
        <div className="flex flex-col">
          {/* Top Content - Centered */}
          <div className="min-h-[25vh] sm:min-h-[30vh] lg:min-h-[35vh] flex items-end justify-center py-4 sm:py-6 lg:py-16">
            <div className="max-w-5xl text-foreground text-center">
              {/* Main Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">Case Studies</h1>
                <p className="text-sm lg:text-base text-muted-foreground max-w-3xl mx-auto">
                  Deep dive into our successful projects and the impact we&apos;ve made helping African startups and brands go global.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Bottom - Case Studies */}
          <div className="pb-10 lg:pb-12">
            <div className="w-full lg:max-w-7xl lg:mx-auto lg:px-4">
              {/* Case Studies Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {caseStudies.map((study, index) => (
                  <Link key={study.id} href="/case-studies">
                    <motion.div
                      className="relative group cursor-pointer"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      {/* Card Container */}
                      <div className="relative aspect-[3/2] rounded-3xl overflow-hidden">
                        {/* Project Image */}
                        <Image
                          src={study.image}
                          alt={study.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                       
                          
                        {/* Large Title Overlay */}
                        <div className="absolute top-8 left-8 right-8">
                          <h3 className="text-white text-5xl lg:text-6xl font-bold tracking-tight uppercase">
                            {study.title}
                          </h3>
                        </div>
                        
                        {/* Bottom Info Card */}
                        <div className="absolute bottom-6 left-6 right-6">
                          <div className="bg-card rounded-3xl p-5 shadow-2xl border flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              {/* Logo Circle */}
                              <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-primary-foreground font-bold text-lg">{study.logo}</span>
                              </div>
                              
                              {/* Text Content */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-foreground font-semibold text-lg mb-0.5">
                                  {study.title}
                                </h4>
                                <p className="text-muted-foreground text-sm">
                                  {study.description}
                                </p>
                              </div>
                              
                              {/* View Project Icon Button */}
                              <div className="flex-shrink-0">
                                <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                                  <EyeIcon className="w-5 h-5" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>

              {/* CTA Section */}
              <motion.div
                className="mt-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="max-w-7xl mx-auto bg-card text-foreground rounded-4xl p-8 lg:p-12 border border-border relative overflow-hidden">
                  {/* Decorative corner elements */}
                  <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-border rounded-tr-2xl"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-border rounded-br-2xl"></div>
                  <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-border rounded-tl-2xl"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-border rounded-bl-2xl"></div>
                  
                  <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                      Want to See Your Success Story Here?
                    </h2>
                    <p className="text-muted-foreground text-lg mb-6">
                      Let&apos;s work together to create your own success story.
                    </p>
                    <motion.button
                      className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:bg-primary/90 transition-colors duration-200 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={openModal}
                    >
                      Start Your Project
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal */}
      <InquireBriefModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
