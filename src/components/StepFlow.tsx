"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { Search, Plane, SquareCheckBig } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Define",
    icon: <Search className="w-6 h-6" />,
    description: "Describe the knowledge gap or the kind of ex-CEO you'd hire if budgets allowed.",
  },
  {
    number: "02",
    title: "Request",
    icon: <Plane className="w-6 h-6" />,
    description: "We research your topic and share the most relevant profiles with pricing & past work.",
  },
  {
    number: "03",
    title: "Choose",
    icon: <SquareCheckBig className="w-6 h-6" />,
    description: "Pick the expert and the engagement mode that perfectly fits your need.",
  },
];

export function StepFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section ref={containerRef} className="py-32 px-6 lg:px-24 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Section Header */}
        <div className="mb-24 text-center">
          <h2 className="text-3xl font-bold tracking-[0.4em] uppercase text-brand-text mb-4">How it works</h2>
          <div className="w-16 h-1 mx-auto bg-brand-primary" />
        </div>

        <div className="relative w-full">
          {/* Central Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-brand-primary/10 -translate-x-1/2 z-0" />
          
          {/* Animated Progress Line */}
          <motion.div 
            style={{ scaleY: pathLength }}
            className="absolute left-1/2 top-0 bottom-0 w-[1.5px] bg-brand-primary -translate-x-1/2 z-0 origin-top shadow-[0_0_15px_rgba(236,147,36,0.6)]"
          />

          <div className="space-y-32">
            {steps.map((step, i) => {
              const isEven = i % 2 === 1;
              return (
                <div key={step.number} className="relative flex items-center justify-center min-h-[160px]">
                  {/* Central Icon */}
                  <div className="absolute left-1/2 -translate-x-1/2 z-10">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="w-14 h-14 rounded-full bg-[var(--bg)] border border-brand-primary/30 flex items-center justify-center text-brand-primary relative shadow-[0_0_20px_rgba(236,147,36,0.1)] group"
                    >
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-full bg-brand-primary/5 blur-md group-hover:bg-brand-primary/20 transition-all duration-300" />
                      <div className="relative z-10">
                        {step.icon}
                      </div>
                    </motion.div>
                  </div>

                  {/* Content (Zig-Zag) */}
                  <div className={`w-full flex ${isEven ? "justify-end" : "justify-start"} items-center`}>
                    <motion.div 
                      initial={{ x: isEven ? 50 : -50, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`w-[42%] flex flex-col ${isEven ? "items-start text-left pl-12" : "items-end text-right pr-12"}`}
                    >
                      <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-30 mb-3 block">
                        STEP {step.number}
                      </span>
                      <h3 className="text-3xl lg:text-5xl font-medium text-brand-text mb-4 tracking-tight">
                        {step.title}
                      </h3>
                      <p className="text-brand-text-muted leading-relaxed max-w-sm text-sm lg:text-base opacity-70">
                        {step.description}
                      </p>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
