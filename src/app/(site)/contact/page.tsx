"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Twitter, Linkedin, Github, Instagram } from "lucide-react";

const subjects = ["General Enquiry", "Project Brief", "Partnership", "Careers", "Other"];

const details = [
  { label: "Email", value: "hello@luminixstudio.com", href: "mailto:hello@luminixstudio.com" },
  { label: "Location", value: "Accra, Ghana", href: null },
  { label: "Response time", value: "Within 24 hours", href: null },
];

const socials = [
  { icon: Twitter, label: "Twitter", href: "https://twitter.com/luminixstudio" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/luminixstudio" },
  { icon: Github, label: "GitHub", href: "https://github.com/luminixstudio" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/luminixstudio" },
];

type Form = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof Form, string>>;

const empty: Form = { name: "", email: "", subject: "", message: "" };

const inputClass =
  "w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/30 transition-colors";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState<Form>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set =
    (key: keyof Form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.subject) e.subject = "Please select a subject";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 pt-40 lg:pt-48 pb-24">

        {/* Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">

          {/* Left — brand panel */}
          <div className="flex flex-col">
            <motion.p
              className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Contact
            </motion.p>

            <motion.h1
              className="text-5xl lg:text-7xl font-bold text-foreground leading-none tracking-tight mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              Let&apos;s build
              <br />
              something
              <br />
              great.
            </motion.h1>

            <motion.p
              className="text-muted-foreground text-base leading-relaxed max-w-sm mb-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Whether you have a fully formed brief or just the seed of an idea, we&apos;d love
              to hear from you. Drop us a message and we&apos;ll get back to you within a day.
            </motion.p>

            {/* Socials */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  className="flex flex-col items-center justify-center text-center py-28"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center mb-6">
                    <Check className="w-7 h-7 text-background" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    Message sent, {form.name.split(" ")[0]}.
                  </h3>
                  <p className="text-muted-foreground text-base max-w-xs leading-relaxed">
                    We&apos;ll get back to you at{" "}
                    <span className="text-foreground font-medium">{form.email}</span> within
                    24 hours.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Field label="Full name" error={errors.name}>
                      <input
                        type="text"
                        value={form.name}
                        onChange={set("name")}
                        placeholder="Jane Mensah"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Email address" error={errors.email}>
                      <input
                        type="email"
                        value={form.email}
                        onChange={set("email")}
                        placeholder="jane@company.com"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <Field label="Subject" error={errors.subject}>
                    <select
                      value={form.subject}
                      onChange={set("subject")}
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      <option value="" disabled>Select a subject</option>
                      {subjects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Message" error={errors.message}>
                    <textarea
                      value={form.message}
                      onChange={set("message")}
                      placeholder="Tell us what's on your mind…"
                      rows={6}
                      className={`${inputClass} resize-none`}
                    />
                  </Field>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-foreground text-background px-7 py-3.5 rounded-full text-sm font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    whileHover={{ scale: loading ? 1 : 1.03 }}
                    whileTap={{ scale: loading ? 1 : 0.97 }}
                  >
                    {loading ? "Sending…" : "Send message"}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom detail strip */}
        <div className="border-t border-border pt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {details.map(({ label, value, href }) => (
            <div key={label}>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                {label}
              </p>
              {href ? (
                <a
                  href={href}
                  className="text-base font-medium text-foreground hover:text-muted-foreground transition-colors"
                >
                  {value}
                </a>
              ) : (
                <p className="text-base font-medium text-foreground">{value}</p>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
