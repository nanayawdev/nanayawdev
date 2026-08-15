"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Send, FileText, Upload, Target, Users, Calendar, DollarSign, Link as LinkIcon, Image, File, ChevronLeft, ChevronRight, Check } from "lucide-react";
import Link from "next/link";

export default function BriefPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectTitle: "",
    projectType: "",
    budget: "",
    timeline: "",
    targetAudience: "",
    competitors: "",
    goals: "",
    features: "",
    designPreferences: "",
    technicalRequirements: "",
    content: "",
    additionalNotes: "",
    documentReferences: null as FileList | null,
    imageReferences: null as FileList | null,
    videoReferences: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const nextStep = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.projectTitle && formData.projectType;
      case 2:
        return formData.goals;
      case 3:
        return true; // Reference materials are optional
      default:
        return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only submit if we're on the final step
    if (currentStep !== totalSteps) {
      return;
    }
    
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
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Brief Received!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for the detailed brief. I&apos;ll review it and get back to you within 24 hours with a comprehensive proposal and quotation.
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
              <h1 className="text-3xl font-bold text-foreground">Send Project Brief</h1>
              <p className="text-muted-foreground">Provide detailed information about your project for a comprehensive quotation</p>
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
          {/* Step Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step <= currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-white/10 dark:bg-black/20 text-muted-foreground'
                  }`}>
                    {step < currentStep ? <Check className="h-5 w-5" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-0.5 mx-2 transition-colors ${
                      step < currentStep ? 'bg-primary' : 'bg-white/10 dark:bg-black/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-foreground">
                {currentStep === 1 && "Contact Information"}
                {currentStep === 2 && "Project Overview"}
                {currentStep === 3 && "Reference Materials"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8" key={currentStep}>
            {/* Step 1: Contact Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    Contact Information
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

                {/* Project Overview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center">
                    <Target className="h-5 w-5 mr-2 text-primary" />
                    Project Overview
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Project Title *</label>
                      <input
                        type="text"
                        name="projectTitle"
                        value={formData.projectTitle}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
                        placeholder="e.g., E-commerce Mobile App"
                      />
                    </div>
                    
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
                        <option value="full-stack">Full Stack Solution</option>
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
                        <option value="1-week">1 week</option>
                        <option value="2-weeks">2 weeks</option>
                        <option value="1-month">Within 1 month</option>
                        <option value="2-3-months">2-3 months</option>
                        <option value="3-6-months">3-6 months</option>
                        <option value="6-months-plus">6+ months</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Project Details */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Target Audience */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Target Audience</label>
                  <textarea
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors resize-none"
                    placeholder="Describe your target audience, demographics, and user personas..."
                  />
                </div>

                {/* Competitors */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Competitors & References</label>
                  <textarea
                    name="competitors"
                    value={formData.competitors}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors resize-none"
                    placeholder="List competitors, websites, or apps you like and want to reference..."
                  />
                </div>

                {/* Goals */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Project Goals *</label>
                  <textarea
                    name="goals"
                    value={formData.goals}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors resize-none"
                    placeholder="What are the main goals and objectives of this project? What problem does it solve?"
                  />
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Key Features & Functionality</label>
                  <textarea
                    name="features"
                    value={formData.features}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors resize-none"
                    placeholder="List the main features and functionality you want to include..."
                  />
                </div>

                {/* Design Preferences */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Design Preferences</label>
                  <textarea
                    name="designPreferences"
                    value={formData.designPreferences}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors resize-none"
                    placeholder="Describe your preferred design style, colors, mood, and any brand guidelines..."
                  />
                </div>

                {/* Technical Requirements */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Technical Requirements</label>
                  <textarea
                    name="technicalRequirements"
                    value={formData.technicalRequirements}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors resize-none"
                    placeholder="Any specific technical requirements, integrations, or platforms..."
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Content & Assets</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors resize-none"
                    placeholder="What content do you have? Images, copy, brand assets, etc..."
                  />
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Additional Notes</label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors resize-none"
                    placeholder="Any additional information, constraints, or special considerations..."
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Reference Materials */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-primary" />
                    Reference Materials
                  </h3>
                  
                  {/* Document References */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center">
                      <File className="h-4 w-4 mr-2 text-primary" />
                      Document References
                    </label>
                    <input
                      type="file"
                      name="documentReferences"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.ppt,.pptx"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload PDFs, Word docs, Excel files, PowerPoint presentations, etc.
                    </p>
                  </div>

                  {/* Image References */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center">
                      <Image className="h-4 w-4 mr-2 text-primary" />
                      Image References
                    </label>
                    <input
                      type="file"
                      name="imageReferences"
                      multiple
                      accept="image/*"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload images, mockups, wireframes, design references, etc.
                    </p>
                  </div>

                  {/* Video References */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 flex items-center">
                      <LinkIcon className="h-4 w-4 mr-2 text-primary" />
                      Video References
                    </label>
                    <textarea
                      name="videoReferences"
                      value={formData.videoReferences}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors resize-none"
                      placeholder="Share links to video references, demos, tutorials, or inspiration videos..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Paste links to YouTube, Vimeo, or other video references
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-border">
              <motion.button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 px-6 py-3 bg-card border border-border rounded-lg text-foreground hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: currentStep === 1 ? 1 : 1.02 }}
                whileTap={{ scale: currentStep === 1 ? 1 : 0.98 }}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </motion.button>

              {currentStep < totalSteps ? (
                <motion.button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid(currentStep)}
                  className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: !isStepValid(currentStep) ? 1 : 1.02 }}
                  whileTap={{ scale: !isStepValid(currentStep) ? 1 : 0.98 }}
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      <span>Sending Brief...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      <span>Send Brief</span>
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
