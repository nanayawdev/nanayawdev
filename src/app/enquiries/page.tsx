"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Send, User, Mail, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function EnquiriesPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-2xl p-8 max-w-md w-full shadow-lg text-center"
        >
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Enquiry Sent!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for your enquiry. We&apos;ll get back to you within 24 hours with a custom quotation.
          </p>
          <Link href="/" className="text-primary hover:text-primary/80 font-medium">
            Return to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24">
      {/* Header */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/" className="p-2 hover:bg-accent rounded-md transition-colors">
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Make an Enquiry</h1>
              <p className="text-muted-foreground">Tell us about your project and we&apos;ll provide a custom quotation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-8 shadow-lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                    placeholder="+233 24 123 4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                    placeholder="Your company name"
                  />
                </div>
              </div>
            </div>

            {/* Project Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                Project Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Project Type *</label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select project type</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-app">Mobile App</option>
                    <option value="ui-ux-design">UI/UX Design</option>
                    <option value="brand-identity">Brand Identity</option>
                    <option value="consultation">Consultation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Budget Range</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select budget range</option>
                    <option value="under-10k">Under GHS 10,000</option>
                    <option value="10k-25k">GHS 10,000 - GHS 25,000</option>
                    <option value="25k-50k">GHS 25,000 - GHS 50,000</option>
                    <option value="50k-100k">GHS 50,000 - GHS 100,000</option>
                    <option value="over-100k">Over GHS 100,000</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Timeline</label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select timeline</option>
                    <option value="asap">ASAP</option>
                    <option value="1-3-days">1-3 days</option>
                    <option value="1-week">1 week</option>
                    <option value="2-weeks">2 weeks</option>
                    <option value="1-month">Within 1 month</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Project Details *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors resize-none"
                placeholder="Tell us about your project, goals, and any specific requirements..."
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Sending Enquiry...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Send Enquiry</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
