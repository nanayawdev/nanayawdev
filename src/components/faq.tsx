"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Plus, ArrowRight } from "lucide-react";

const faqData = [
  {
    id: 1,
    question: "What services do you offer for African startups?",
    answer: "We provide comprehensive digital services including brand identity design, web development, mobile app prototypes, UI/UX design, and digital strategy. Our team specializes in helping African startups scale globally through world-class digital experiences."
  },
  {
    id: 2,
    question: "Do you work with international clients?",
    answer: "Yes! While we specialize in African markets, we work with clients worldwide. Our global perspective combined with local market understanding helps us create digital experiences that resonate across cultures."
  },
  {
    id: 3,
    question: "Can you guarantee project delivery timelines?",
    answer: "We provide detailed project timelines and milestones for every engagement. Our agile development process ensures transparent communication and regular updates throughout the project lifecycle."
  },
  {
    id: 4,
    question: "Do you offer ongoing maintenance and support?",
    answer: "Absolutely! We provide comprehensive maintenance and hosting services to ensure your digital products continue to perform optimally. Our support includes regular updates, security patches, and performance monitoring."
  },
  {
    id: 5,
    question: "What makes your approach different for African brands?",
    answer: "We understand African markets deeply while maintaining global standards. Our team combines local cultural insights with international design trends to create brands that compete effectively on the world stage."
  },
  {
    id: 6,
    question: "Do you help with digital marketing strategy?",
    answer: "Yes! We offer digital marketing strategy as part of our comprehensive services. This includes brand positioning, content strategy, and growth planning to help your brand reach its target audience effectively."
  }
];

export function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl lg:text-5xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Quick answers to your most common questions.
          </motion.p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-12">
          {faqData.map((item, index) => (
            <motion.div
              key={item.id}
              className="bg-card border border-border rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-muted/50 transition-colors duration-200 cursor-pointer"
              >
                <h3 className="text-lg font-medium text-foreground pr-4">
                  {item.question}
                </h3>
                <motion.div
                  animate={{ rotate: openItems.includes(item.id) ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <Plus className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              </button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openItems.includes(item.id) ? "auto" : 0,
                  opacity: openItems.includes(item.id) ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-5">
                  <p className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-full text-foreground hover:bg-muted transition-colors duration-200 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="font-medium">View All</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
