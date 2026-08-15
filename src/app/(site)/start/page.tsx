"use client";

import { Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const STEPS = [
  { number: "01", label: "About you" },
  { number: "02", label: "Your project" },
  { number: "03", label: "Details" },
];

const SERVICES = ["Web Design", "Web Development", "Mobile App", "Brand Identity", "Digital Marketing", "UI/UX Design"];
const BUDGETS = ["Under $2k", "$2k – $5k", "$5k – $15k", "$15k – $30k", "$30k+"];
const TIMELINES = ["ASAP", "1 – 2 months", "3 – 6 months", "6 months+", "Not sure yet"];
const SOURCES = ["Google", "Social media", "Referral", "LinkedIn", "Other"];

type Form = {
  name: string; email: string; phone: string; company: string;
  services: string[]; description: string;
  budget: string; timeline: string; source: string;
};
type Errors = Partial<Record<keyof Form, string>>;

const empty: Form = {
  name: "", email: "", phone: "", company: "",
  services: [], description: "",
  budget: "", timeline: "", source: "",
};

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
};

const inputClass =
  "w-full bg-transparent border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground/30 transition-colors";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer ${
        active
          ? "bg-foreground text-background border-foreground"
          : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
      }`}
    >
      {label}
    </button>
  );
}

export default function StartPage() {
  return (
    <Suspense fallback={null}>
      <StartPageInner />
    </Suspense>
  );
}

function StartPageInner() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [form, setForm] = useState<Form>(() => ({ ...empty, email: searchParams.get("email") ?? "" }));
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof Form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleService = (s: string) =>
    setForm((f) => ({
      ...f,
      services: f.services.includes(s) ? f.services.filter((x) => x !== s) : [...f.services, s],
    }));

  const validate = (): boolean => {
    const e: Errors = {};
    if (step === 0) {
      if (!form.name.trim()) e.name = "Name is required";
      if (!form.email.trim()) e.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    }
    if (step === 1) {
      if (form.services.length === 0) e.services = "Select at least one service";
      if (!form.description.trim()) e.description = "Tell me about your project";
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          company: form.company,
          budget: form.budget,
          message: `Services: ${form.services.join(", ")}\n\nTimeline: ${form.timeline}\n\nHow they found me: ${form.source}\n\n${form.description}`,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setErrors({ description: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* Left — fixed brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-[#0a0a0a] overflow-hidden">
        {/* ShaderGradient */}
        <ShaderGradientCanvas
          style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.7 }}
          pixelDensity={1.5}
          fov={45}
          pointerEvents="none"
        >
          <ShaderGradient
            animate="on"
            brightness={1.2}
            cAzimuthAngle={180}
            cDistance={2.4}
            cPolarAngle={95}
            cameraZoom={1}
            color1="#9b5de5"
            color2="#2d1b4e"
            color3="#542e7b"
            envPreset="city"
            grain="off"
            lightType="3d"
            positionX={0}
            positionY={-2.1}
            positionZ={0}
            reflection={0.1}
            rotationX={0}
            rotationY={0}
            rotationZ={225}
            shader="defaults"
            type="waterPlane"
            uAmplitude={0}
            uDensity={1.8}
            uFrequency={5.5}
            uSpeed={0.2}
            uStrength={3}
            uTime={0.2}
            wireframe={false}
          />
        </ShaderGradientCanvas>

        {/* Dark overlay for legibility */}
        <div className="absolute inset-0 bg-black/50 z-10" />

        {/* Content */}
        <div className="relative z-20 flex flex-col justify-between h-full">
          {/* Logo */}
          <Link
            href="/"
            className="inline-block text-lg font-semibold tracking-tight text-white"
            aria-label="nanayawdev home"
          >
            nanayaw<span className="text-[#9b5de5]">dev</span>
          </Link>

          {/* Heading */}
          <div>
            <p className="text-white/50 text-sm font-medium uppercase tracking-widest mb-4">
              Start a Project
            </p>
            <h1 className="font-display text-4xl xl:text-5xl font-semibold text-white leading-tight tracking-tight mb-6">
              Let&apos;s build
              <br />
              something
              <br />
              great together.
            </h1>
            <p className="text-white/60 text-base leading-relaxed max-w-xs">
              Fill in the brief and I&apos;ll come back to you within 24 hours with a proposal.
            </p>
          </div>

          {/* Step indicators */}
          <div className="space-y-4">
            {submitted ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-black" />
                </div>
                <span className="text-white text-sm font-medium">Brief submitted</span>
              </div>
            ) : (
              STEPS.map((s, i) => (
                <div key={s.number} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                    i < step ? "bg-white border-white" :
                    i === step ? "border-white" : "border-white/20"
                  }`}>
                    {i < step ? (
                      <Check className="w-3.5 h-3.5 text-black" />
                    ) : (
                      <span className={`text-xs font-semibold ${i === step ? "text-white" : "text-white/30"}`}>
                        {i + 1}
                      </span>
                    )}
                  </div>
                  <span className={`text-sm transition-colors duration-300 ${
                    i === step ? "text-white font-medium" :
                    i < step ? "text-white/60" : "text-white/30"
                  }`}>
                    {s.label}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-col min-h-screen">
        {/* Progress bar */}
        <div className="h-0.5 bg-border w-full shrink-0">
          <motion.div
            className="h-full bg-foreground"
            animate={{ width: submitted ? "100%" : `${((step + 1) / 3) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* Mobile logo */}
        <div className="lg:hidden px-8 pt-8 pb-4">
          <Link
            href="/"
            className="inline-block text-base font-semibold tracking-tight text-foreground"
            aria-label="nanayawdev home"
          >
            nanayaw<span className="text-[#542e7b]">dev</span>
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12 max-w-xl w-full mx-auto lg:mx-0 lg:max-w-none">
          <AnimatePresence mode="wait" custom={dir}>
            {submitted ? (
              <motion.div
                key="success"
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center mb-6 mx-auto">
                  <Check className="w-7 h-7 text-background" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-3">
                  Got it, {form.name.split(" ")[0]}.
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-sm mx-auto">
                  I&apos;ve received your brief and will get back to you at{" "}
                  <span className="text-foreground font-medium">{form.email}</span> within 24 hours.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to home
                </Link>
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
              >
                {/* Step header */}
                <div className="mb-10">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
                    Step {step + 1} of 3
                  </p>
                  <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                    {step === 0 && "First, tell me about yourself."}
                    {step === 1 && "What are you building?"}
                    {step === 2 && "Almost there."}
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Step 1 */}
                  {step === 0 && (
                    <>
                      <Field label="Full name" error={errors.name}>
                        <input type="text" value={form.name} onChange={(e) => set("name")(e.target.value)}
                          placeholder="Jane Mensah" className={inputClass} />
                      </Field>
                      <Field label="Email address" error={errors.email}>
                        <input type="email" value={form.email} onChange={(e) => set("email")(e.target.value)}
                          placeholder="jane@company.com" className={inputClass} />
                      </Field>
                      <Field label="Phone number (optional)">
                        <input type="tel" value={form.phone} onChange={(e) => set("phone")(e.target.value)}
                          placeholder="+233 XX XXX XXXX" className={inputClass} />
                      </Field>
                      <Field label="Company / Brand (optional)">
                        <input type="text" value={form.company} onChange={(e) => set("company")(e.target.value)}
                          placeholder="Acme Inc." className={inputClass} />
                      </Field>
                    </>
                  )}

                  {/* Step 2 */}
                  {step === 1 && (
                    <>
                      <Field label="Services needed" error={errors.services}>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {SERVICES.map((s) => (
                            <Chip key={s} label={s} active={form.services.includes(s)} onClick={() => toggleService(s)} />
                          ))}
                        </div>
                      </Field>
                      <Field label="Tell me about your project" error={errors.description}>
                        <textarea
                          value={form.description}
                          onChange={(e) => set("description")(e.target.value)}
                          placeholder="What problem are you solving? Who's the audience? Any references or inspirations?"
                          rows={5}
                          className={`${inputClass} resize-none`}
                        />
                      </Field>
                    </>
                  )}

                  {/* Step 3 */}
                  {step === 2 && (
                    <>
                      <Field label="Budget range">
                        <div className="flex flex-wrap gap-2 mt-1">
                          {BUDGETS.map((b) => (
                            <Chip key={b} label={b} active={form.budget === b} onClick={() => set("budget")(b)} />
                          ))}
                        </div>
                      </Field>
                      <Field label="Ideal timeline">
                        <div className="flex flex-wrap gap-2 mt-1">
                          {TIMELINES.map((t) => (
                            <Chip key={t} label={t} active={form.timeline === t} onClick={() => set("timeline")(t)} />
                          ))}
                        </div>
                      </Field>
                      <Field label="How did you hear about me?">
                        <div className="flex flex-wrap gap-2 mt-1">
                          {SOURCES.map((s) => (
                            <Chip key={s} label={s} active={form.source === s} onClick={() => set("source")(s)} />
                          ))}
                        </div>
                      </Field>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer nav */}
        {!submitted && (
          <div className="px-8 lg:px-16 py-8 border-t border-border flex items-center justify-between shrink-0">
            {step > 0 ? (
              <button
                onClick={back}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" /> Home
              </Link>
            )}
            <motion.button
              onClick={next}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-foreground text-background px-7 py-3 rounded-full text-sm font-semibold cursor-pointer disabled:opacity-60"
              whileHover={{ scale: loading ? 1 : 1.03 }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
            >
              {loading ? "Sending…" : step === 2 ? "Send brief" : "Continue"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
