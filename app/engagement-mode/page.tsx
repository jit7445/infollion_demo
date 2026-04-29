"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, MotionValue, useScroll } from "framer-motion";
import { Cormorant_Garamond, DM_Mono } from "next/font/google";
import { Plus, Minus, Phone, Plane, Briefcase, MapPin, Users, Calendar, Tag, User, UserPlus } from "lucide-react";
import { GlowCard } from "@/components/GlowCard";
import { BackgroundParticles } from "@/components/BackgroundParticles";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"]
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"]
});

const MAIN_BALLS = [
  { id: "calls", label: "Calls", size: 180, left: "5%", top: 60, delay: 0, duration: 8, yRange: [0, -30, -10, -40, 0], xRange: [0, 10, -5, 5, 0], rx: [0, 2, -1, 3, 0], ry: [0, -3, 2, -2, 0], parallax: 0.02 },
  { id: "sit-ins", label: "Sit-Ins", size: 140, left: "28%", top: -20, delay: 1.5, duration: 10, yRange: [0, -25, -15, -35, 0], xRange: [0, -8, 5, -3, 0], rx: [0, -1, 2, -1, 0], ry: [0, 2, -1, 3, 0], parallax: 0.035 },
  { id: "tours", label: "Tours", size: 160, left: "50%", top: 80, delay: 2.2, duration: 9, yRange: [0, -25, -5, -35, 0], xRange: [0, -5, 8, -4, 0], rx: [0, -2, 1, -3, 0], ry: [0, 3, -1, 2, 0], parallax: 0.028 },
  { id: "paxpanel", label: "PaxPanel", size: 190, left: "68%", top: -30, delay: 0.8, duration: 12, yRange: [0, -40, -20, -50, 0], xRange: [0, 8, -10, 5, 0], rx: [0, 3, -2, 2, 0], ry: [0, -2, 3, -1, 0], parallax: 0.015 },
];

const TINY_BALLS = [
  { id: "tb1", size: 25, left: "10%", top: 80, delay: 0.2, duration: 12, yRange: [0, -30, 10, -20, 15, 0], xRange: [0, 20, -10, 25, -15, 0], rx: [0,0,0,0,0,0], ry: [0,0,0,0,0,0], parallax: 0.05 },
  { id: "tb2", size: 15, left: "25%", top: 150, delay: 1.5, duration: 15, yRange: [0, 25, -15, 30, -10, 0], xRange: [0, -20, 15, -25, 10, 0], rx: [0,0,0,0,0,0], ry: [0,0,0,0,0,0], parallax: 0.03 },
  { id: "tb3", size: 30, left: "40%", top: 50, delay: 0.8, duration: 14, yRange: [0, -40, 20, -30, 10, 0], xRange: [0, 30, -20, 15, -10, 0], rx: [0,0,0,0,0,0], ry: [0,0,0,0,0,0], parallax: 0.06 },
  { id: "tb4", size: 18, left: "60%", top: 120, delay: 2.1, duration: 11, yRange: [0, 20, -30, 15, -25, 0], xRange: [0, -15, 25, -10, 20, 0], rx: [0,0,0,0,0,0], ry: [0,0,0,0,0,0], parallax: 0.04 },
  { id: "tb5", size: 22, left: "80%", top: 70, delay: 0.5, duration: 16, yRange: [0, -25, 15, -35, 20, 0], xRange: [0, 25, -15, 30, -20, 0], rx: [0,0,0,0,0,0], ry: [0,0,0,0,0,0], parallax: 0.07 },
  { id: "tb6", size: 12, left: "90%", top: 200, delay: 3.0, duration: 13, yRange: [0, 35, -20, 25, -15, 0], xRange: [0, -30, 20, -25, 15, 0], rx: [0,0,0,0,0,0], ry: [0,0,0,0,0,0], parallax: 0.02 },
  { id: "tb7", size: 28, left: "5%", top: 300, delay: 1.1, duration: 17, yRange: [0, -20, 30, -10, 25, 0], xRange: [0, 15, -25, 20, -30, 0], rx: [0,0,0,0,0,0], ry: [0,0,0,0,0,0], parallax: 0.05 },
  { id: "tb8", size: 16, left: "30%", top: 350, delay: 2.5, duration: 10, yRange: [0, 30, -25, 15, -20, 0], xRange: [0, -25, 15, -30, 10, 0], rx: [0,0,0,0,0,0], ry: [0,0,0,0,0,0], parallax: 0.03 },
  { id: "tb9", size: 20, left: "50%", top: 280, delay: 0.3, duration: 14, yRange: [0, -35, 15, -25, 20, 0], xRange: [0, 20, -35, 10, -15, 0], rx: [0,0,0,0,0,0], ry: [0,0,0,0,0,0], parallax: 0.04 },
  { id: "tb10", size: 24, left: "70%", top: 320, delay: 1.8, duration: 15, yRange: [0, 25, -15, 30, -10, 0], xRange: [0, -15, 30, -20, 25, 0], rx: [0,0,0,0,0,0], ry: [0,0,0,0,0,0], parallax: 0.06 },
  { id: "tb11", size: 14, left: "85%", top: 380, delay: 2.8, duration: 12, yRange: [0, -20, 25, -15, 30, 0], xRange: [0, 30, -15, 25, -20, 0], rx: [0,0,0,0,0,0], ry: [0,0,0,0,0,0], parallax: 0.02 },
  { id: "tb12", size: 19, left: "15%", top: 220, delay: 0.7, duration: 16, yRange: [0, 35, -10, 20, -25, 0], xRange: [0, -20, 25, -15, 30, 0], rx: [0,0,0,0,0,0], ry: [0,0,0,0,0,0], parallax: 0.05 },
  { id: "tb13", size: 26, left: "45%", top: 180, delay: 1.4, duration: 11, yRange: [0, -15, 30, -20, 15, 0], xRange: [0, 15, -30, 20, -25, 0], rx: [0,0,0,0,0,0], ry: [0,0,0,0,0,0], parallax: 0.04 },
  { id: "tb14", size: 10, left: "65%", top: 250, delay: 2.2, duration: 18, yRange: [0, 20, -35, 10, -30, 0], xRange: [0, -35, 10, -25, 15, 0], rx: [0,0,0,0,0,0], ry: [0,0,0,0,0,0], parallax: 0.03 },
  { id: "tb15", size: 21, left: "95%", top: 100, delay: 0.9, duration: 13, yRange: [0, -25, 20, -15, 35, 0], xRange: [0, 25, -20, 30, -10, 0], rx: [0,0,0,0,0,0], ry: [0,0,0,0,0,0], parallax: 0.06 },
];

const ballGradient = `
  radial-gradient(circle at 25% 25%, #ffffff 0%, rgba(255,255,255,0) 40%),
  radial-gradient(circle at 10% 80%, #ff8c42 0%, rgba(255,140,66,0) 60%),
  radial-gradient(circle at 90% 50%, #e1dced 0%, rgba(225,220,237,0) 60%),
  radial-gradient(circle at 50% 50%, #fef5e7 0%, #f3d8c1 60%, #d6ad96 100%)
`;

const ballShadow = `
  inset -10px -10px 20px rgba(180, 160, 180, 0.4),
  inset 10px 10px 20px rgba(255, 255, 255, 0.9),
  15px 25px 40px rgba(160, 100, 60, 0.25),
  -10px 15px 30px rgba(255, 120, 50, 0.15)
`;

function HeroBall({ ball, mouseX, mouseY }: { ball: any, mouseX: MotionValue<number>, mouseY: MotionValue<number> }) {
  const isMain = !!ball.label;
  
  const springConfig = { damping: 20, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  
  const xOffset = useTransform(smoothX, [-500, 500], [ball.parallax * 500, -ball.parallax * 500]);
  const yOffset = useTransform(smoothY, [-500, 500], [ball.parallax * 500, -ball.parallax * 500]);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: ball.left,
        top: ball.top,
        width: ball.size,
        height: ball.size,
        x: xOffset,
        y: yOffset,
        zIndex: isMain ? 10 : 0,
      }}
      animate={{
        y: ball.yRange,
        x: ball.xRange,
        rotateX: ball.rx,
        rotateY: ball.ry,
      }}
      transition={{
        duration: ball.duration,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
        delay: ball.delay,
      }}
      className="group"
    >
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: ballGradient,
          boxShadow: ballShadow,
          opacity: isMain ? 1 : 0.4,
          cursor: isMain ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          filter: "drop-shadow(0 0 0px rgba(251,139,71,0))",
        }}
        whileHover={{
          scale: 1.15,
          filter: "drop-shadow(0 0 40px rgba(251,139,71,0.9))",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        onClick={() => {
          if (isMain) {
            const el = document.getElementById(ball.id);
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }
        }}
      >
        {isMain && (
          <span 
            className={`${cormorant.className} italic transition-colors duration-300 group-hover:text-[#c45a1f]`}
            style={{
              fontSize: ball.size * 0.18,
              color: "rgba(80, 45, 15, 0.75)",
              textShadow: "1px 1px 2px rgba(255,255,255,0.4), -1px -1px 2px rgba(0,0,0,0.15)",
              letterSpacing: "0.05em",
            }}
          >
            {ball.label}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}

function AccordionRow({ title, children }: { title: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5 last:border-0 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 px-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors text-left"
      >
        <span className={`${cormorant.className} text-[var(--text)] text-2xl font-light`}>{title}</span>
        <div className={`p-2 rounded-full border border-white/10 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}>
           {isOpen ? <Minus className="w-5 h-5 text-[#ec9324]" /> : <Plus className="w-5 h-5 text-[#ec9324]" />}
        </div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <div className={`p-8 pt-0 ${dmMono.className} text-sm text-gray-400 leading-relaxed border-t border-white/5 bg-white/[0.01]`}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export default function EngagementMode() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const mouseX = useMotionValue<number>(0);
  const mouseY = useMotionValue<number>(0);

  // Zoom-out scaling effect for the hero content
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - left - width / 2;
    const y = clientY - top - height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <div ref={containerRef} className="bg-[var(--bg)] text-[var(--text)] min-h-screen selection:bg-orange-500/30">
      
      {/* ─── SECTION 1: HERO ─── */}
      <section 
        className="relative min-h-screen flex flex-col justify-center items-center pt-24 pb-12 overflow-hidden text-center"
        style={{ color: "#cb9136" }}
        onMouseMove={handleMouseMove}
      >
        <BackgroundParticles />

        <motion.div 
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="relative z-10 flex flex-col items-center w-full max-w-6xl mx-auto px-6 text-center"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mb-16"
          >
            <TextGenerateEffect 
              words="MODES OF ENGAGEMENT" 
              className={`${dmMono.className} text-[#cb9136] text-xl font-medium tracking-[0.6em] uppercase text-center`}
            />
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="h-1 mt-8 bg-[#cb9136] rounded-full" 
            />
          </motion.div>

          <div className="relative w-full h-[250px] max-w-[900px] mx-auto perspective-1000">
            {TINY_BALLS.slice(0, 8).map((ball) => (
              <HeroBall key={ball.id} ball={ball} mouseX={mouseX} mouseY={mouseY} />
            ))}
            {MAIN_BALLS.map((ball) => (
              <HeroBall key={ball.id} ball={ball} mouseX={mouseX} mouseY={mouseY} />
            ))}
          </div>

          <motion.div 
            animate={{ y: [0, 10, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute bottom-[-10vh] flex flex-col items-center gap-2"
          >
            <span className={`${dmMono.className} text-[#ec9324] text-[0.7rem] uppercase tracking-[0.5em] font-bold`}>Scroll to Explore</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── SECTION 2: CALLS ─── */}
      <section id="calls" className="relative py-[120px] px-8 lg:px-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className={`${dmMono.className} text-[#ec9324] text-sm font-bold tracking-[0.5em] uppercase mb-10 block`}>
              01 — CALLS
            </span>
            <h2 className={`${cormorant.className} text-[clamp(3.5rem,6.5vw,5.5rem)] font-light text-[var(--text)] mb-8 leading-[1]`}>
              Telephonic Expert Consultations
            </h2>
            <p className="text-xl text-[var(--text-muted)] font-light leading-relaxed mb-10 max-w-lg">
              The fastest way to get surgical insights. Connect instantly with pre-vetted specialists across every industry niche.
            </p>
            <GlowCard className="!p-10 !rounded-3xl">
              <div className="grid grid-cols-2 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-[#ec9324] mb-2 font-playfair">48h</div>
                  <div className="text-[10px] uppercase tracking-widest font-bold opacity-50">Match Time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#ec9324] mb-2 font-playfair">100%</div>
                  <div className="text-[10px] uppercase tracking-widest font-bold opacity-50">Vetted</div>
                </div>
              </div>
            </GlowCard>
          </motion.div>

          <div className="grid gap-6">
            <GlowCard>
               <Phone className="w-10 h-10 text-[#ec9324] mb-4" />
               <h3 className="text-2xl font-bold mb-4">Instant Connectivity</h3>
               <p className="text-sm opacity-60">Direct line to market leaders and technical pioneers without the overhead of long-term contracts.</p>
            </GlowCard>
            <GlowCard>
               <Plus className="w-10 h-10 text-[#ec9324] mb-4" />
               <h3 className="text-2xl font-bold mb-4">Pre-set Agendas</h3>
               <p className="text-sm opacity-60">Maximize every minute with structured briefings prepared by our domain research team.</p>
            </GlowCard>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: SIT-INS ─── */}
      <section id="sit-ins" className="relative py-[120px] px-8 lg:px-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1 flex flex-col gap-6">
             <GlowCard className="!p-0 border-none shadow-none bg-transparent">
                <AccordionRow title="Why organise a Sit-In?">
                  Conferences are too generic. Sit-Ins provide surgical precision, allowing your team to ask critical questions in a private, high-stakes environment.
                </AccordionRow>
                <AccordionRow title="How do Sit-Ins work?">
                  You provide the objective; we curate the panel. We handle logistics, NDAs, and moderator support to ensure quality.
                </AccordionRow>
                <AccordionRow title="Pricing Model">
                  Tiered pricing based on expert seniority. Starting at $500 for mid-senior management consultations.
                </AccordionRow>
             </GlowCard>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="order-1 lg:order-2"
          >
            <span className={`${dmMono.className} text-[#ec9324] text-sm font-bold tracking-[0.5em] uppercase mb-10 block`}>
              02 — SIT-INS
            </span>
            <h2 className={`${cormorant.className} text-[clamp(3.5rem,6.5vw,5.5rem)] font-light text-[var(--text)] mb-8 leading-[1]`}>
              Private Expert Masterclasses
            </h2>
            <p className="text-xl text-[var(--text-muted)] font-light leading-relaxed mb-10 max-w-lg">
              Intensive, private workshops at your location or ours. Tailored specifically for internal project kick-offs or strategic shifts.
            </p>
            <div className="flex -space-x-4">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className={`w-14 h-14 rounded-full border-2 border-[#121212] bg-gradient-to-br from-orange-400 to-orange-600 shadow-xl`} style={{ opacity: 1 - i*0.1 }} />
               ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 4: PAXPANEL ─── */}
      <section id="paxpanel" className="relative py-[120px] px-8 lg:px-24">
        <div className="max-w-7xl mx-auto text-center mb-24">
          <span className="inline-block w-[1px] h-[30px] bg-[#ec9324] mb-8 mx-auto" />
          <span className={`${dmMono.className} text-[#ec9324] text-sm font-bold tracking-[0.5em] uppercase mb-10 block`}>
            03 — PAXPANEL
          </span>
          <h2 className={`${cormorant.className} text-[clamp(3.5rem,6.5vw,5.5rem)] font-light text-[var(--text)] mb-8 leading-[1]`}>
            Expert Access on Demand
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
           {[
              { title: "Strategic Leverage", icon: <Briefcase className="w-8 h-8"/>, body: "Augment your workforce with ex-C-suite executives and specialized freelancers for specific project arcs." },
              { title: "Custom Engagements", icon: <Calendar className="w-8 h-8"/>, body: "Flexible hours or Milestone-based SOWs. Scalable expertise that adapts to your project's heartbeat." },
              { title: "Risk Mitigation", icon: <Tag className="w-8 h-8"/>, body: "Reduce hiring risk. Test expertise in short-term roles before committing to long-term engagements." }
           ].map((item, i) => (
             <GlowCard key={i} className="flex flex-col text-left">
                <div className="text-[#ec9324] mb-8">{item.icon}</div>
                <h3 className="text-4xl font-bold mb-6 text-[var(--text)]">{item.title}</h3>
                <p className="text-[var(--text-muted)] leading-relaxed font-light">{item.body}</p>
             </GlowCard>
           ))}
        </div>
      </section>

      {/* ─── SECTION 5: TOURS ─── */}
      <section id="tours" className="relative py-[120px] px-8 lg:px-24 bg-[var(--bg2)]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <GlowCard className="!p-0">
               <div className="p-10 space-y-8">
                  {["Phase 1: Market Briefing", "Phase 2: On-site Visitation", "Phase 3: Executive Interaction", "Phase 4: Synthesis & Reporting"].map((step, i) => (
                    <div key={i} className="flex items-center gap-6">
                       <div className="w-10 h-10 rounded-full border border-orange-500/30 bg-orange-500/10 flex items-center justify-center text-[#ec9324] text-xs font-bold">0{i+1}</div>
                       <span className="text-xl font-medium text-[var(--text)]">{step}</span>
                    </div>
                  ))}
               </div>
            </GlowCard>
          </motion.div>

          <div>
            <span className={`${dmMono.className} text-[#ec9324] text-sm font-bold tracking-[0.5em] uppercase mb-10 block`}>
              04 — KNOWLEDGE TOURS
            </span>
            <h2 className={`${cormorant.className} text-[clamp(3.5rem,6.5vw,5.5rem)] font-light text-[var(--text)] mb-8 leading-[1]`}>
              Research in Motion
            </h2>
            <p className="text-xl text-[var(--text-muted)] font-light leading-relaxed mb-10">
              Curated field research trips for fund managers and C-suite leaders. We bridge the gap between boardroom data and ground reality.
            </p>
            <div className="grid grid-cols-2 gap-4">
               <GlowCard className="flex flex-col items-center justify-center !p-6 text-center !rounded-2xl">
                  <MapPin className="text-[#ec9324] mb-3" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-faint)]">Field-checked</span>
               </GlowCard>
               <GlowCard className="flex flex-col items-center justify-center !p-6 text-center !rounded-2xl">
                  <Users className="text-[#ec9324] mb-3" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-faint)]">Top Focus</span>
               </GlowCard>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER STRIP ─── */}
      <footer className="bg-[var(--bg2)] border-t border-[var(--border)] py-24 px-8 lg:px-24">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className={`${cormorant.className} text-[clamp(2rem,4vw,3.5rem)] font-light text-[var(--text)] mb-8`}>Ready to deepen your insights?</h2>
          <form className="flex flex-wrap md:flex-nowrap gap-4 justify-center" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Full Name" className={`${dmMono.className} bg-[var(--bg)] border border-[var(--border)] rounded-xl px-6 py-4 text-sm text-[var(--text)] w-full md:w-auto outline-none focus:border-[#ec9324]/50 transition-colors`} />
            <input type="email" placeholder="Business Email" className={`${dmMono.className} bg-[var(--bg)] border border-[var(--border)] rounded-xl px-6 py-4 text-sm text-[var(--text)] w-full md:w-auto outline-none focus:border-[#ec9324]/50 transition-colors`} />
            <button className={`${dmMono.className} bg-[#ec9324] text-white font-bold px-10 py-4 rounded-xl text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all w-full md:w-auto shadow-xl shadow-orange-500/20`}>
              Contact Us
            </button>
          </form>
        </div>
      </footer>

    </div>
  );
}
