"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { XIcon as X, ArrowRightIcon as ArrowRight, ArrowLeftIcon as ArrowLeft, CheckIcon as Check } from "@phosphor-icons/react";

interface InquireBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormData = {
  name: string;
  email: string;
  company: string;
  services: string[];
  description: string;
  budget: string;
  timeline: string;
  source: string;
};

const SERVICES = ["Web Design", "Web Development", "Mobile App", "Brand Identity", "Digital Marketing", "UI/UX Design"];
const BUDGETS = ["Under $2k", "$2k – $5k", "$5k – $15k", "$15k – $30k", "$30k+"];
const TIMELINES = ["ASAP", "1 – 2 months", "3 – 6 months", "6 months+", "Not sure yet"];
const SOURCES = ["Google", "Social media", "Referral", "LinkedIn", "Other"];

const STEPS = ["About you", "Your project", "Details"];

const empty: FormData = {
  name: "", email: "", company: "",
  services: [], description: "",
  budget: "", timeline: "", source: "",
};

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/30 transition-colors"
    />
  );
}

export function InquireBriefModal({ isOpen, onClose }: InquireBriefModalProps) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [form, setForm] = useState<FormData>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const set = (key: keyof FormData) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleService = (s: string) =>
    setForm((f) => ({
      ...f,
      services: f.services.includes(s)
        ? f.services.filter((x) => x !== s)
        : [...f.services, s],
    }));

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (step === 0) {
      if (!form.name.trim()) e.name = "Name is required";
      if (!form.email.trim()) e.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    }
    if (step === 1) {
      if (form.services.length === 0) e.services = "Select at least one service";
      if (!form.description.trim()) e.description = "Tell us a little about your project";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    if (step < 2) { setDir(1); setStep((s) => s + 1); }
    else handleSubmit();
  };

  const back = () => { setDir(-1); setStep((s) => s - 1); };

  const handleSubmit = () => setSubmitted(true);

  const handleClose = () => {
    onClose();
    setTimeout(() => { setStep(0); setDir(1); setForm(empty); setErrors({}); setSubmitted(false); }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-background z-50 flex flex-col shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
          >
            {/* Progress bar */}
            <div className="h-0.5 bg-border w-full shrink-0">
              <motion.div
                className="h-full bg-foreground"
                animate={{ width: submitted ? "100%" : `${((step + 1) / 3) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 shrink-0 border-b border-border">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-0.5">
                  {submitted ? "Done" : `Step ${step + 1} of 3`}
                </p>
                <h2 className="text-lg font-bold text-foreground">
                  {submitted ? "I'll be in touch" : STEPS[step]}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-8 py-8">
              <AnimatePresence mode="wait" custom={dir}>
                {submitted ? (
                  <motion.div
                    key="success"
                    className="h-full flex flex-col items-center justify-center text-center py-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center mb-6">
                      <Check className="w-7 h-7 text-background" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">Got it, {form.name.split(" ")[0]}.</h3>
                    <p className="text-muted-foreground text-base max-w-xs leading-relaxed">
                      I&apos;ve received your brief and will get back to you at <span className="text-foreground font-medium">{form.email}</span> within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={step}
                    custom={dir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="space-y-6"
                  >
                    {/* Step 1 */}
                    {step === 0 && (
                      <>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          Let&apos;s start with the basics. I just need enough to know who I&apos;m talking to.
                        </p>
                        <Field label="Full name" error={errors.name}>
                          <Input value={form.name} onChange={set("name")} placeholder="Jane Mensah" />
                        </Field>
                        <Field label="Email address" error={errors.email}>
                          <Input value={form.email} onChange={set("email")} placeholder="jane@company.com" type="email" />
                        </Field>
                        <Field label="Company / Brand (optional)">
                          <Input value={form.company} onChange={set("company")} placeholder="Acme Inc." />
                        </Field>
                      </>
                    )}

                    {/* Step 2 */}
                    {step === 1 && (
                      <>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          What are you looking to build? Pick everything that applies.
                        </p>
                        <Field label="Services needed" error={errors.services}>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {SERVICES.map((s) => (
                              <button
                                key={s}
                                onClick={() => toggleService(s)}
                                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer ${
                                  form.services.includes(s)
                                    ? "bg-foreground text-background border-foreground"
                                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </Field>
                        <Field label="Tell us about your project" error={errors.description}>
                          <textarea
                            value={form.description}
                            onChange={(e) => set("description")(e.target.value)}
                            placeholder="What problem are you solving? Who's the audience? Any references or inspirations?"
                            rows={5}
                            className="w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/30 transition-colors resize-none"
                          />
                        </Field>
                      </>
                    )}

                    {/* Step 3 */}
                    {step === 2 && (
                      <>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          Almost there. This helps us prepare the right proposal for you.
                        </p>
                        <Field label="Budget range">
                          <div className="flex flex-wrap gap-2 mt-1">
                            {BUDGETS.map((b) => (
                              <button
                                key={b}
                                onClick={() => set("budget")(b)}
                                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer ${
                                  form.budget === b
                                    ? "bg-foreground text-background border-foreground"
                                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                                }`}
                              >
                                {b}
                              </button>
                            ))}
                          </div>
                        </Field>
                        <Field label="Ideal timeline">
                          <div className="flex flex-wrap gap-2 mt-1">
                            {TIMELINES.map((t) => (
                              <button
                                key={t}
                                onClick={() => set("timeline")(t)}
                                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer ${
                                  form.timeline === t
                                    ? "bg-foreground text-background border-foreground"
                                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                                }`}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </Field>
                        <Field label="How did you hear about us?">
                          <div className="flex flex-wrap gap-2 mt-1">
                            {SOURCES.map((s) => (
                              <button
                                key={s}
                                onClick={() => set("source")(s)}
                                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer ${
                                  form.source === s
                                    ? "bg-foreground text-background border-foreground"
                                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </Field>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {!submitted && (
              <div className="px-8 py-6 border-t border-border flex items-center justify-between shrink-0">
                {step > 0 ? (
                  <button
                    onClick={back}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                ) : (
                  <span />
                )}
                <motion.button
                  onClick={next}
                  className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full text-sm font-semibold cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {step === 2 ? "Send brief" : "Continue"}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
