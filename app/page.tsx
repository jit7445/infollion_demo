"use client";

import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue } from "motion/react";
import { 
  Phone, Users, UserPlus, Plane, 
  Sparkles, ArrowRight, ShieldCheck, Search, 
  FileText, SquareCheckBig, ChevronRight, 
  Zap, Shield, Globe, Building, Lightbulb, Coins
} from "lucide-react";
import { BackgroundParticles } from "@/components/BackgroundParticles";
import { GlowCard } from "@/components/GlowCard";
import { StepFlow } from "@/components/StepFlow";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

// Dynamic imports for client-heavy components
const NetworkGlobe = dynamic(() => import("@/components/NetworkGlobe").then(mod => mod.NetworkGlobe), { ssr: false });
const InfollionStory = dynamic(() => import("@/components/InfollionStory").then(mod => mod.InfollionStory), { ssr: false });

// ─── Sub-Components ─────────────────────────────────────────────────────────

function MagneticButton({ 
  children, 
  href, 
  variant = "primary" 
}: { 
  children: React.ReactNode, 
  href?: string, 
  variant?: "primary" | "ghost" 
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);
  
  // Simple implementation for recovery
  return (
    <motion.a
      href={href}
      className={`relative inline-flex items-center gap-3 rounded-full px-10 py-5 font-bold transition-all duration-300 text-sm uppercase tracking-widest ${
        variant === "primary"
          ? "bg-[#ec9324] text-white shadow-[0_20px_40px_-10px_rgba(255,122,48,0.3)] hover:scale-105 active:scale-95"
          : "border-2 border-[#ec9324]/30 text-[#ec9324] hover:bg-[#ec9324]/5 hover:border-[#ec9324]/60"
      }`}
    >
      {children}
    </motion.a>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0.05, 0.15], [0, 1]);
  const scale = useTransform(scrollYProgress, [0.05, 0.15], [0.9, 1]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  const useCases = [
    {
      title: "Corporations",
      desc: "Kick-starter teams, Private long-term advisors, One-time events, Board members.",
      icon: <Building className="w-10 h-10 text-brand-primary" />,
    },
    {
      title: "Research & Consulting",
      desc: "Project proposals, Kick-off hypothesis, Benchmarking, KOL surveys, Analysis validation.",
      icon: <Lightbulb className="w-10 h-10 text-brand-primary" />,
    },
    {
      title: "Investment Funds",
      desc: "Exploratory research, Deal flow, due-diligence, portfolio resources group.",
      icon: <Coins className="w-10 h-10 text-brand-primary" />,
    },
  ];

  return (
    <div ref={containerRef} className="relative">
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[90vh] pt-20 lg:pt-28 pb-10 px-6 lg:pl-12 lg:pr-10 overflow-hidden w-full flex items-center">
        <NetworkGlobe />
        

        <div className="relative z-10 grid lg:grid-cols-12 gap-0 items-center w-full px-4 lg:px-0">
          {/* Left Content */}
          <motion.div 
            style={{ 
              y: useTransform(scrollYProgress, [0, 0.4], [0, 120]),
              opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0])
            }}
            className="col-span-12 lg:col-span-6 flex flex-col items-start relative px-4 lg:pl-8 xl:pl-12"
          >

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 border border-brand-primary/20 bg-brand-primary/5"
            >
              <Sparkles className="h-3 w-3 text-brand-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary/80">
                Curated experts who've been there, done that
              </span>
            </motion.div>

            <div className="mb-4">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-semibold tracking-tight leading-[1.1] sm:leading-[0.95]">
                Get <span className="text-brand-primary italic font-serif">On-Demand</span> Expertise.
              </h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-2 max-w-xl text-base sm:text-lg opacity-60 leading-relaxed text-brand-text"
            >
              Phone calls · Personal advisors · On-site workshops · Knowledge tours · Consultants · SOW employees. One panel, infinite expertise.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-8 flex flex-wrap items-center gap-6"
            >
              <MagneticButton href="#request" variant="primary">
                Request Experts <ArrowRight className="h-5 w-5 ml-1" />
              </MagneticButton>
              <MagneticButton variant="ghost" href="#register">
                Register as an Expert
              </MagneticButton>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 1 }}
              className="mt-12 flex flex-wrap gap-x-16 gap-y-6"
            >
              {[
                ["12k+", "Vetted experts"],
                ["48 hr", "Avg. match time"],
                ["140+", "Industries covered"]
              ].map(([val, label]) => (
                <div key={label} className="flex flex-col">
                  <div className="text-4xl font-bold text-brand-primary mb-1 font-playfair">{val}</div>
                  <div className="uppercase tracking-[0.2em] font-bold text-[10px] opacity-40 text-brand-text">{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Cinematic Storyboard */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="col-span-12 lg:col-span-6 relative mt-8 lg:mt-0 flex justify-center z-50 w-full"
          >
            <InfollionStory />
            <div className="absolute -inset-20 bg-brand-primary/5 blur-[120px] -z-10 pointer-events-none opacity-50" />
          </motion.div>
        </div>

        <motion.div 
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
        >
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold opacity-40">Scroll ↓</span>
        </motion.div>
      </section>

      {/* ── ABOUT SECTION ── */}
      <motion.section 
        id="services" 
        style={{ opacity, scale }}
        className="mt-24 grid lg:grid-cols-2 gap-20 items-center px-10 lg:px-24"
      >
        <div className="reveal-left relative">
          <div className="w-20 h-1 mb-8 bg-brand-primary" />
          <TextGenerateEffect 
            words="Know More About Us" 
            className="text-3xl font-bold tracking-[0.25em] uppercase mb-8 text-brand-text" 
          />
          <p className="leading-relaxed text-lg mb-6 font-light text-brand-text-muted">
            Infollion aggregates subject matter experts, independent consultants and freelancers to facilitate their access for short-term expertise to{" "}
            <span className="text-brand-primary font-medium">companies, consulting firms and investment funds</span>. 
            Infollion offers flexible <span className="text-brand-primary font-medium">modes of engagement</span> to reach out to experts on its panel.
          </p>
          <p className="leading-relaxed text-lg font-light text-brand-text-muted">
            It ranges from a very short phone call to a few months long project based on pre-determined statement of work. The Panel can be accessed in 3 easy steps.
          </p>
        </div>

        <div 
          className="reveal-right rounded-[40px] p-8 flex flex-col gap-6 shadow-2xl"
          style={{ background: "rgba(255,122,48,0.03)", border: "1px solid rgba(255,122,48,0.1)" }}
        >
          {[
            { title: "Expert Network", desc: "10,000+ verified experts across 150+ industries globally.", icon: <Globe className="text-brand-primary w-7 h-7" /> },
            { title: "AI Matching", desc: "Our algorithms match your brief to the right expert in under 48 hours.", icon: <Zap className="text-brand-primary w-7 h-7" /> },
            { title: "Compliant", desc: "GDPR-compliant processes, NDAs, and secure communications.", icon: <Shield className="text-brand-primary w-7 h-7" /> }
          ].map(item => (
            <div key={item.title} className="flex items-start gap-4">
              <div className="p-3 rounded-xl flex-shrink-0 bg-brand-primary/10">
                {item.icon}
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider mb-1 text-brand-text">{item.title}</h4>
                <p className="text-sm leading-relaxed text-brand-text-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── STEPS SECTION ── */}
      <StepFlow />

      {/* ── MODES SECTION ── */}
      <section id="experts" className="mt-24 text-center relative px-10 lg:px-24">
        <h2 className="reveal text-2xl font-bold tracking-[0.4em] uppercase mb-6 relative z-10 text-brand-text">
          Modes of Engagement
        </h2>
        <div className="reveal stagger-1 w-16 h-1 mx-auto mb-16 relative z-10 bg-brand-primary" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {[
            { label: "Calls", icon: <Phone className="w-6 h-6" />, desc: "Rapid telephonic consultations." },
            { label: "Sit-Ins", icon: <Users className="w-6 h-6" />, desc: "Interactive deep-dive workshops." },
            { label: "Tours", icon: <Plane className="w-6 h-6" />, desc: "Field research and site visits." },
            { label: "PexPanel", icon: <UserPlus className="w-6 h-6" />, desc: "Long-term professional engagement." }
          ].map((item, i) => (
            <GlowCard key={i}>
              <div className="mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500 text-brand-primary">
                {item.icon}
              </div>
              <h4 className="font-bold uppercase tracking-widest mb-3 text-sm text-brand-text">{item.label}</h4>
              <p className="text-xs leading-relaxed opacity-60 text-brand-text">{item.desc}</p>
            </GlowCard>
          ))}
        </div>
      </section>

      {/* ── USE CASES SECTION ── */}
      <section className="mt-24 text-center pb-24 px-10 lg:px-24">
        <TextGenerateEffect 
          words="Sample Use-Cases" 
          className="reveal text-2xl font-bold tracking-[0.4em] uppercase mb-6 text-center" 
        />
        <div className="reveal stagger-1 w-16 h-1 mx-auto mb-20 bg-brand-primary" />

        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {useCases.map((item, i) => (
            <GlowCard key={i} className="flex flex-col items-center text-center !rounded-[2.5rem] !p-12 hover:shadow-[0_20px_80px_-20px_rgba(236,147,36,0.15)] group">
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-10 transition-all duration-500 bg-brand-primary/5 border border-brand-primary/10 text-brand-primary group-hover:scale-110 group-hover:bg-brand-primary/10 group-hover:border-brand-primary/30 group-hover:shadow-[0_10px_30px_-5px_rgba(236,147,36,0.2)]">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold uppercase tracking-[0.2em] mb-6 text-brand-text group-hover:text-brand-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed opacity-60 text-brand-text max-w-[240px]">
                {item.desc}
              </p>
            </GlowCard>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
