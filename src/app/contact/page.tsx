"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Contact() {
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
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-shrink-0"
              >
                <Mail className="w-16 h-16 lg:w-20 lg:h-20 text-primary" />
              </motion.div>
              <h1 className="text-4xl sm:text-5xl lg:text-8xl font-bold leading-tight">
                <span className="text-primary">Contact</span>{" "}
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
              Ready to take your brand global? Let&apos;s discuss your project and explore 
              how we can help you achieve your goals through innovative digital solutions.
            </motion.p>

            {/* Second Paragraph */}
            <motion.p
              className="text-foreground text-lg lg:text-xl leading-relaxed max-w-3xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Get in touch with our team to start your digital transformation journey. 
              We&apos;re here to help African startups and brands reach their full potential 
              on the global stage.
            </motion.p>

            {/* Contact Info */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-foreground font-semibold mb-1 text-sm">Email</h3>
                <p className="text-muted-foreground text-xs">hello@devsandcreatives.com</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-foreground font-semibold mb-1 text-sm">Phone</h3>
                <p className="text-muted-foreground text-xs">+233 XXX XXX XXXX</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-foreground font-semibold mb-1 text-sm">Location</h3>
                <p className="text-muted-foreground text-xs">Accra, Ghana</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-foreground font-semibold mb-1 text-sm">Hours</h3>
                <p className="text-muted-foreground text-xs">Mon-Fri 9AM-6PM</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
