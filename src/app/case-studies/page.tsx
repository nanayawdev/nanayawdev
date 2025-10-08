"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";
import { InquireBriefModal } from "@/components/inquire-brief";
import { useState } from "react";

const caseStudies = [
  {
    id: 1,
    title: "Remora Digital Platform",
    client: "Remora Digital",
    industry: "Fintech",
    timeline: "4 months",
    result: "300% Growth",
    image: "/hero1.avif",
    description: "A comprehensive digital platform that revolutionized how African fintech companies manage their operations and serve customers globally.",
    tags: ["Web Development", "UI/UX Design", "API Integration"],
    keyResults: [
      "Increased user engagement by 250%",
      "Expanded to 5 new markets",
      "Improved conversion rate by 180%"
    ]
  },
  {
    id: 2,
    title: "Appointment Management System",
    client: "HealthConnect",
    industry: "Healthcare",
    timeline: "3 months",
    result: "500% Efficiency",
    image: "/hero2.avif",
    description: "A mobile-first appointment booking system that streamlined healthcare access across multiple African countries.",
    tags: ["Mobile App", "UI/UX Design", "Backend Development"],
    keyResults: [
      "Reduced booking time by 70%",
      "Served 50,000+ patients",
      "Achieved 95% user satisfaction"
    ]
  },
  {
    id: 3,
    title: "E-commerce Revolution",
    client: "Ultimate Kairos",
    industry: "Food & Beverage",
    timeline: "5 months",
    result: "400% Sales",
    image: "/hero3.avif",
    description: "A complete digital transformation including brand identity, e-commerce platform, and mobile app for a premium bakery chain.",
    tags: ["Brand Identity", "E-commerce", "Mobile App"],
    keyResults: [
      "Increased online sales by 400%",
      "Launched in 3 new cities",
      "Built loyal customer base of 10,000+"
    ]
  }
];

export default function CaseStudies() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<typeof caseStudies[0] | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openCaseStudy = (study: typeof caseStudies[0]) => {
    setSelectedCaseStudy(study);
    // For now, we'll show an alert with the case study details
    // In a real app, this would navigate to a detailed case study page
    alert(`Case Study: ${study.title}\n\nClient: ${study.client}\nTimeline: ${study.timeline}\nResult: ${study.result}\n\nDescription: ${study.description}\n\nKey Results:\n${study.keyResults.map(result => `• ${result}`).join('\n')}`);
  };

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
              <div className="space-y-8">
                {caseStudies.map((study, index) => (
                  <motion.div
                    key={study.id}
                    className="bg-card border border-border rounded-4xl overflow-hidden group hover:border-border/80 transition-all duration-300"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      {/* Image Section */}
                      <div className="relative aspect-[4/3] lg:aspect-auto">
                        <Image
                          src={study.image}
                          alt={study.title}
                          width={600}
                          height={400}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>

                      {/* Content Section */}
                      <div className="p-8 lg:p-12">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {study.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                          {study.title}
                        </h2>

                        {/* Description */}
                        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                          {study.description}
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-6 mb-8">
                          <div>
                            <h4 className="font-semibold text-foreground text-sm mb-1">Client</h4>
                            <p className="text-muted-foreground">{study.client}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground text-sm mb-1">Timeline</h4>
                            <p className="text-muted-foreground">{study.timeline}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground text-sm mb-1">Industry</h4>
                            <p className="text-muted-foreground">{study.industry}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground text-sm mb-1">Result</h4>
                            <p className="text-primary font-semibold">{study.result}</p>
                          </div>
                        </div>

                        {/* Key Results */}
                        <div className="mb-8">
                          <h4 className="font-semibold text-foreground mb-4">Key Results:</h4>
                          <ul className="space-y-3">
                            {study.keyResults.map((result, resultIndex) => (
                              <li key={resultIndex} className="flex items-start">
                                <span className="mr-3 text-primary text-lg">✓</span>
                                <span className="text-muted-foreground">{result}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* CTA Button */}
                        <motion.button
                          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors duration-200"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => openCaseStudy(study)}
                        >
                          Read Full Case Study
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
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
