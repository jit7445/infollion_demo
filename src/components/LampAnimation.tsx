"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function LampAnimation() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => {
      if (wrapRef.current) {
        wrapRef.current.style.transform = `translateY(${window.scrollY * 0.06}px)`;
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div
      className="pointer-events-none z-0 flex flex-col items-center"
      style={{ width: 1000, paddingTop: 40 }}
      aria-hidden
    >
      <motion.div 
        ref={wrapRef} 
        className="flex flex-col items-center w-full relative origin-top"
        animate={{ rotate: [-8, 8] }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          repeatType: "mirror", 
          ease: "easeInOut" 
        }}
      >
        
        {/* Ambient background wash */}
        <div className="absolute top-[80px] w-[500px] h-[500px] rounded-full blur-[80px] opacity-15 -z-10"
             style={{ background: "radial-gradient(circle, #FF7A30 0%, transparent 70%)", left: "50%", transform: "translateX(-50%)" }} />

        {/* Wire */}
        <div style={{
          width: 1,
          height: 140,
          background: "#333",
          opacity: 0.2,
          flexShrink: 0,
        }} />

        {/* Lamp Shade - Clean Semicircle Suncap */}
        <div className="relative" style={{ width: 140, height: 70, background: "#333", borderRadius: "70px 70px 0 0", boxShadow: "inset 0 -2px 10px rgba(255,255,255,0.1)", zIndex: 10 }}>
          {/* Internal shadow line - very subtle */}
          <div style={{ position: "absolute", bottom: 12, left: "15%", right: "15%", height: 1.5, background: "rgba(255,255,255,0.1)", borderRadius: 1 }} />
          
          {/* Glowing Bulb - Small orb hanging below */}
          <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 flex items-center justify-center">
             <div className="absolute w-20 h-20 rounded-full blur-xl opacity-40" style={{ background: "#FF7A30" }} />
             <div className="relative w-10 h-10 rounded-full border border-white/20" 
                  style={{ background: "radial-gradient(circle at 30% 30%, #FFF, rgba(255,122,48,0.6))", boxShadow: "0 0 15px rgba(255,122,48,0.4)" }}>
                <div className="absolute inset-1.5 rounded-full" style={{ background: "radial-gradient(circle, #FFF 0%, #FF7A30 100%)" }} />
             </div>
          </div>
        </div>

        {/* Light Cone - Sharp and Focused */}
        <svg
          width="1000"
          height="800"
          viewBox="0 0 1000 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", marginTop: 25, filter: "blur(15px)", opacity: 0.85 }}
        >
          <defs>
            <radialGradient id="lamp-cone-grad" cx="50%" cy="0%" r="100%" fx="50%" fy="0%">
              <stop offset="0%" stopColor="#FF7A30" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#FF7A30" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FF7A30" stopOpacity="0" />
            </radialGradient>
          </defs>
          <polygon points="500,0 150,800 850,800" fill="url(#lamp-cone-grad)" />
        </svg>

        {/* Scattered Particles - Tiny Sharp Dots */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[2px] h-[2px] rounded-full bg-[#FF7A30]"
              animate={{ 
                opacity: [0.1, 0.6, 0.1],
                y: [0, -30, 0]
              }}
              transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: i * 0.1 }}
              style={{
                top: 150 + Math.random() * 650,
                left: 50 + Math.random() * 900,
                filter: "blur(0.2px)"
              }}
            />
          ))}
        </div>

      </motion.div>
    </div>
  );
}
